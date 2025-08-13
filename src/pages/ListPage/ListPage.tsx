import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

import {
  deleteList,
  deleteListItems,
  getListDetails,
} from "../../misc/tmdbAPI";
import { useAuth } from "../../contexts/AuthContext";

import ListContainer from "../MyLists/ListContainer";
import MediaListItem from "../MyLists/MediaListItem";
import ListItem from "../MyLists/ListItem";

import { ListDetails, Media, MediaRef } from "../../misc/types";

import PageContainer from "../../components/PageContainer";
import EditListModal from "./EditListModal";
import ScrollToTop from "../../components/ScrollToTop";
import EmptyListPlaceholder from "./EmptyListPlaceholder";
import Skeleton from "../../components/Skeleton";
import ListDetailsSection from "./ListDetailsSection";
import ListSkeleton from "./ListSkeleton";

export enum EditListState {
  BACKDROP = "BACKDROP",
  DETAILS = "DETAILS",
  COMMENTS = "COMMENTS",
}

const ListPage = () => {
  const queryClient = useQueryClient();
  const { authDetails } = useAuth();
  const params = useParams();
  const navigate = useNavigate();

  const listId = params?.listId ? parseInt(params?.listId) : null;

  const [currentEditState, setCurrentEditState] =
    useState<EditListState | null>(null);
  const [currentListItemToEdit, setCurrentListItemToEdit] =
    useState<Media | null>(null);

  const listDetailsQueryKey = ["listDetails", listId];
  const { data: listDetails, isLoading: isListDetailsFetching } = useQuery({
    enabled: !!listId,
    queryKey: listDetailsQueryKey,
    queryFn: async ({ queryKey }) => {
      const [_, listId, currentPage] = queryKey as [string, number, number];

      const response = await getListDetails(
        listId,
        authDetails?.accessToken,
        currentPage
      );

      return response;
    },
    staleTime: 1000 * 60 * 10,
  });

  const listResultsQueryKey = ["listResults", listId];
  const { data: allListResults } = useQuery({
    enabled: !!listId,
    queryKey: listResultsQueryKey,
    queryFn: async () => {
      if (!listId) return;

      const paginatedListResults: Media[][] = [];
      let totalPages = 1;
      for (let page = 1; page <= totalPages; page++) {
        const response = await getListDetails(
          listId,
          authDetails?.accessToken,
          page
        );

        paginatedListResults.push(response.results);
        totalPages = response.total_pages;
      }

      return paginatedListResults.flat();
    },
    staleTime: 1000 * 60 * 5,
  });

  const deleteListItemMutation = useMutation({
    mutationFn: (mediaRefToDelete: MediaRef) => {
      if (!authDetails?.accessToken) throw Error("Unauthorized");
      if (!listId) throw Error("No List Id");
      return deleteListItems(authDetails?.accessToken, listId, [
        mediaRefToDelete,
      ]);
    },

    onMutate: async (mediaRefToDelete: MediaRef) => {
      await queryClient.cancelQueries({ queryKey: listDetailsQueryKey });
      await queryClient.cancelQueries({ queryKey: listResultsQueryKey });

      const previousListDetails: ListDetails | undefined =
        queryClient.getQueryData(listDetailsQueryKey);
      const previousListResults: Media[][] | undefined =
        queryClient.getQueryData(listResultsQueryKey);

      // Optimistic Update on ListResults
      queryClient.setQueryData(listResultsQueryKey, (prev: Media[]) => {
        const newResults = prev.filter(
          (media) => mediaRefToDelete.media_id !== media.id
        );

        return newResults;
      });

      return { previousListDetails, previousListResults };
    },

    onError: (error, id, context) => {
      // Rollback if error
      if (context?.previousListDetails) {
        queryClient.setQueryData(
          listDetailsQueryKey,
          context.previousListDetails
        );
      }

      if (context?.previousListResults) {
        queryClient.setQueryData(
          listResultsQueryKey,
          context.previousListResults
        );
      }
    },
    onSuccess: () => {
      // Invalidate cache to refetch and be synced with the server.
      queryClient.invalidateQueries({ queryKey: listDetailsQueryKey });
      queryClient.invalidateQueries({ queryKey: listResultsQueryKey });
    },
  });

  const deleteListMutation = useMutation({
    mutationFn: async () => {
      if (!authDetails) throw Error("Unauthorized.");
      if (!listId) throw Error("No ListId");

      const response = await deleteList(authDetails.accessToken, listId);
      return response;
    },
    onSettled: () => {
      // Invalidated User's List cache to refetch and be synced with the server.
      queryClient.invalidateQueries({
        queryKey: ["lists", authDetails?.accountId],
      });

      navigate("/mylists");
    },
  });

  const closeEditModal = () => {
    setCurrentEditState(null);
  };

  const handleListItemEdit = (listItem: Media) => {
    setCurrentListItemToEdit(listItem);
    setCurrentEditState(EditListState.COMMENTS);
  };

  const listResults = allListResults || listDetails?.results || [];

  const isUserOwner =
    !!authDetails && authDetails.accountId === listDetails?.created_by.id;

  return (
    <PageContainer>
      <ScrollToTop />

      {authDetails && currentEditState && listDetails && (
        <EditListModal
          onClose={closeEditModal}
          listResults={listResults}
          currentState={currentEditState}
          listDetails={listDetails}
          listItem={currentListItemToEdit}
        />
      )}

      {isListDetailsFetching && <Skeleton className="h-80 w-full mb-4" />}
      {!isListDetailsFetching && listDetails && (
        <ListDetailsSection
          listDetails={listDetails}
          isUserOwner={isUserOwner}
          onEditDetails={() => setCurrentEditState(EditListState.DETAILS)}
          onEditBackdrop={() => setCurrentEditState(EditListState.BACKDROP)}
          onDeleteList={() => deleteListMutation.mutate()}
        />
      )}

      {isListDetailsFetching && <ListSkeleton />}
      {!isListDetailsFetching && listDetails && (
        <ListContainer>
          {listResults.map((media, index) => {
            const commentKey = `${media.media_type}:${media.id}`;

            return (
              <ListItem index={index + 1} key={media.id}>
                <MediaListItem
                  media={media}
                  comment={listDetails.comments[commentKey]}
                  onDelete={isUserOwner ? deleteListItemMutation.mutate : null}
                  isDeleting={deleteListItemMutation.isPending}
                  onComment={isUserOwner ? handleListItemEdit : null}
                />
              </ListItem>
            );
          })}

          {listResults.length === 0 && <EmptyListPlaceholder />}
        </ListContainer>
      )}
    </PageContainer>
  );
};

export default ListPage;
