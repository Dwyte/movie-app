import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

import {
  deleteList,
  deleteListItems,
  getListDetails,
} from "../../misc/tmdbAPI";
import { ListDetails, Media, MediaRef } from "../../misc/types";
import { MEDIA_TYPE_NAME } from "../../misc/constants";
import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";

import UnorderedList from "../../components/Lists/UnorderedList";
import ListItemDiv from "../../components/Lists/ListItemDiv";
import PageContainer from "../../components/PageContainer";
import ScrollToTop from "../../components/ScrollToTop";
import Skeleton from "../../components/Skeleton";

import MediaListItem, { MediaListItemSkeleton } from "./MediaListItem";
import EmptyListPlaceholder from "./EmptyListPlaceholder";
import EditListModal from "./EditListModal";
import ListDetailsSection from "./ListDetailsSection";

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
  const location = useLocation();

  const { showToast, showConfirmation } = useToast();
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
      const paginatedListResults: Media[][] = [];
      let totalPages = 1;
      for (let page = 1; page <= totalPages; page++) {
        const response = await getListDetails(
          listId!,
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
    onSettled: (response) => {
      // Invalidated User's List cache to refetch and be synced with the server.
      queryClient.invalidateQueries({
        queryKey: ["lists", authDetails?.accountId],
      });

      if (response?.success) {
        showToast(`List "${listDetails?.name}" was successfuly deleted.`);
      } else {
        showToast(
          `${response?.status_message} (${response?.status_code})`,
          "error"
        );
      }

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

  const [loadedMediaRecord, setLoadedMediaRecord] = useState<{
    [key: number]: boolean;
  }>({});
  const isDoneLoadingListItems =
    listDetails &&
    listDetails.results.every((media) => loadedMediaRecord[media.id]);

  const handleDeleteList = () => {
    showConfirmation(
      `Delete "${listDetails?.name}" list?`,
      () => deleteListMutation.mutate(),
      () => console.log("Delete operation cancelled.")
    );
  };

  const handleDeleteListItem = (mediaRefToDelete: MediaRef) => {
    showConfirmation(
      `Remove ${MEDIA_TYPE_NAME[mediaRefToDelete.media_type]} from the list?`,
      () => deleteListItemMutation.mutate(mediaRefToDelete),
      () => console.log("Delete operation cancelled.")
    );
  };

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
          onDeleteList={handleDeleteList}
        />
      )}

      <UnorderedList
        aria-busy={isListDetailsFetching}
        aria-labelledby="user-list-page-name"
      >
        {isListDetailsFetching &&
          Array.from({ length: 10 }, (_, k) => (
            <li key={k} aria-hidden={true}>
              <MediaListItemSkeleton />
            </li>
          ))}

        {isListDetailsFetching && (
          <div role="status" className="sr-only">
            Loading List Items...
          </div>
        )}

        {!isListDetailsFetching &&
          listDetails &&
          listResults.map((media, index) => {
            const comment =
              listDetails.comments[`${media.media_type}:${media.id}`];

            return (
              <li className="relative" key={media.id}>
                {!isDoneLoadingListItems && (
                  <div className="absolute inset-0">
                    <MediaListItemSkeleton />
                  </div>
                )}

                <Link
                  to={`/${media.media_type}/${media.id}`}
                  state={{ backgroundLocation: location }}
                  className={`group outline-none transition-opacity ${
                    isDoneLoadingListItems ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <ListItemDiv index={index + 1}>
                    <MediaListItem
                      media={media}
                      comment={comment}
                      onDelete={isUserOwner ? handleDeleteListItem : null}
                      isDeleting={deleteListItemMutation.isPending}
                      onComment={isUserOwner ? handleListItemEdit : null}
                      onLoad={() =>
                        setLoadedMediaRecord((p) => {
                          return { ...p, [media.id]: true };
                        })
                      }
                    />
                  </ListItemDiv>
                </Link>
              </li>
            );
          })}

        {isDoneLoadingListItems && listResults.length === 0 && (
          <li aria-live="polite">
            <EmptyListPlaceholder />
          </li>
        )}
      </UnorderedList>
    </PageContainer>
  );
};

export default ListPage;
