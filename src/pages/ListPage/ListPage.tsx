import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BsBoxArrowUpRight,
  BsImages,
  BsPencilSquare,
  BsTrash,
} from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

import {
  deleteList,
  deleteListItems,
  getListDetails,
} from "../../misc/tmdbAPI";
import { getDurationString, getTMDBImageURL } from "../../misc/utils";
import { useAuth } from "../../contexts/AuthContext";

import ListContainer from "../MyLists/ListContainer";
import MediaListItem from "../MyLists/MediaListItem";
import ListItem from "../MyLists/ListItem";

import { NO_IMAGE_LANDSCAPE_PATH } from "../../misc/constants";
import { ListDetails, Media, MediaRef } from "../../misc/types";

import PageContainer from "../../components/PageContainer";
import FiveStarRating from "../../components/FiveStarRating";
import VisibilityIcon from "../../components/VisibilityIcon";
import ListPagination from "../../components/ListPagination";
import StyledKeyValue from "../../components/StyledKeyValue";
import EditListModal from "./EditListModal";

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

  const [currentPage, setCurrentPage] = useState(1);
  const [currentEditState, setCurrentEditState] =
    useState<EditListState | null>(null);
  const [currentListItemToEdit, setCurrentListItemToEdit] =
    useState<Media | null>(null);

  const listDetailsQueryKey = ["listDetails", listId];
  const { data: listDetails } = useQuery({
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
  const { data: paginatedListResults } = useQuery({
    enabled: !!listDetails,
    queryKey: listResultsQueryKey,
    queryFn: async () => {
      if (!listDetails || !listId) return;
      const paginatedResults: Media[][] = [listDetails.results];
      for (let page = 2; page <= listDetails.total_pages; page++) {
        const response = await getListDetails(
          listId,
          authDetails?.accessToken,
          page
        );

        paginatedResults.push(response.results);
      }
      return paginatedResults;
    },
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

      const previousListDetails: ListDetails | undefined =
        queryClient.getQueryData(listDetailsQueryKey);

      // Optimistic Update
      queryClient.setQueryData(listDetailsQueryKey, (prev: ListDetails) => {
        const newResults = prev.results.filter(
          (media) => mediaRefToDelete.media_id !== media.id
        );

        return { ...prev, results: newResults };
      });

      return { previousListDetails };
    },

    onError: (error, id, context) => {
      // Rollback if error
      if (context?.previousListDetails) {
        queryClient.setQueryData(
          listDetailsQueryKey,
          context.previousListDetails
        );
      }
    },

    onSettled: () => {
      // Invalidate cache to refetch and be synced with the server.
      queryClient.invalidateQueries({ queryKey: listDetailsQueryKey });
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

  if (!listDetails) return null;

  const thumbnail = listDetails.backdrop_path
    ? getTMDBImageURL(listDetails.backdrop_path, "1920")
    : NO_IMAGE_LANDSCAPE_PATH;

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
  };

  const isUserOwner =
    authDetails && authDetails.accountId === listDetails.created_by.id;

  const closeEditModal = () => {
    setCurrentEditState(null);
  };

  const currentPageListItems = paginatedListResults
    ? paginatedListResults[currentPage - 1]
    : listDetails.results;

  const listResults = paginatedListResults
    ? paginatedListResults.flat()
    : listDetails.results;

  const handleListItemEdit = (listItem: Media) => {
    setCurrentListItemToEdit(listItem);
    setCurrentEditState(EditListState.COMMENTS);
  };

  return (
    <PageContainer>
      {authDetails && currentEditState && (
        <EditListModal
          onClose={closeEditModal}
          listResults={listResults}
          currentState={currentEditState}
          listDetails={listDetails}
          listItem={currentListItemToEdit}
        />
      )}

      <div className="relative mb-8 rounded-sm overflow-hidden">
        <img className="h-80 sm:h-80 sm:w-full object-cover" src={thumbnail} />
        <div className="bg-black/33 w-full h-full absolute top-0"></div>

        {isUserOwner && (
          <div className="absolute top-0 right-0 p-4 flex flex-col gap-2 z-1000">
            <button onClick={handleShare} className="secondary-icon-btn p-3">
              <BsBoxArrowUpRight />
            </button>
            <button
              onClick={() => setCurrentEditState(EditListState.BACKDROP)}
              className="secondary-icon-btn p-3"
            >
              <BsImages />
            </button>
            <button
              onClick={() => setCurrentEditState(EditListState.DETAILS)}
              className="secondary-icon-btn p-3"
            >
              <BsPencilSquare />
            </button>
            <button
              onClick={() => deleteListMutation.mutate()}
              className="secondary-icon-btn p-3"
            >
              <BsTrash />
            </button>
          </div>
        )}

        <div className="flex flex-col absolute bottom-0 text-white w-full">
          <div className="p-2 sm:p-4">
            <h1 className="text-4xl font-bold flex gap-2 items-center">
              {listDetails.name}
            </h1>
            <p className="text-base">
              {listDetails.description || "No description."}
            </p>
          </div>

          <div className="flex bg-gradient-to-t from-black via-60% via-black/50 to-black/0 text-sm lg:text-base flex-col md:flex-row md:gap-4 lg:gap-8 md:items-center md:bg-none md:bg-black/75 p-2 md:p-4">
            <VisibilityIcon isPublic={listDetails.public} showLabel />
            <StyledKeyValue
              label={"Created by:"}
              value={listDetails.created_by.username}
            />
            <StyledKeyValue
              label={"Shows Count:"}
              value={listDetails.item_count}
            />
            <StyledKeyValue
              label={"Total Runtime:"}
              value={getDurationString(listDetails.runtime)}
            />
            <StyledKeyValue
              className="items-center"
              label={"Average Rating:"}
              value={<FiveStarRating rating={listDetails.average_rating} />}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center gap-4">
        <ListContainer>
          {currentPageListItems.map((media, index) => {
            const commentKey = `${media.media_type}:${media.id}`;

            return (
              <ListItem
                index={(currentPage - 1) * 20 + index + 1}
                key={media.id}
              >
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
        </ListContainer>
        <ListPagination
          totalPages={listDetails.total_pages}
          currentPage={currentPage}
          onNextPage={() => {
            setCurrentPage((prev) => prev + 1);
          }}
          onPrevPage={() => {
            setCurrentPage((prev) => prev - 1);
          }}
        />
      </div>
    </PageContainer>
  );
};

export default ListPage;
