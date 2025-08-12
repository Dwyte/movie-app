import { useState } from "react";
import PageContainer from "../components/PageContainer";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteList, deleteListItems, getListDetails } from "../misc/tmdbAPI";
import { useAuth } from "../contexts/AuthContext";
import ListContainer from "./MyLists/ListContainer";
import ListItem from "./MyLists/ListItem";
import MediaListItem from "./MyLists/MediaListItem";
import { ListDetails, MediaRef } from "../misc/types";
import { NO_IMAGE_LANDSCAPE_PATH } from "../misc/constants";
import { getDurationString, getTMDBImageURL } from "../misc/utils";
import FiveStarRating from "../components/FiveStarRating";
import { BsBoxArrowUpRight, BsPencilSquare, BsTrash } from "react-icons/bs";
import VisibilityIcon from "../components/VisibilityIcon";
import ListPagination from "../components/ListPagination";
import StyledKeyValue from "../components/StyledKeyValue";

const ListPage = () => {
  const queryClient = useQueryClient();
  const { authDetails } = useAuth();
  const params = useParams();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);

  const listId = params?.listId ? parseInt(params?.listId) : null;
  if (!listId) return;

  const queryKey = ["listDetails", listId, currentPage];

  const { data: listDetails } = useQuery({
    enabled: !!listId,
    queryKey: queryKey,
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

  const deleteListItemMutation = useMutation({
    mutationFn: (mediaRefToDelete: MediaRef) => {
      if (!authDetails?.accessToken) throw Error("Unauthorized");
      if (!listId) throw Error("No List Id");
      return deleteListItems(authDetails?.accessToken, listId, [
        mediaRefToDelete,
      ]);
    },

    onMutate: async (mediaRefToDelete: MediaRef) => {
      await queryClient.cancelQueries({ queryKey });

      const previousListDetails: ListDetails | undefined =
        queryClient.getQueryData(queryKey);

      // Optimistic Update
      queryClient.setQueryData(queryKey, (prev: ListDetails) => {
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
        queryClient.setQueryData(queryKey, context.previousListDetails);
      }
    },

    onSettled: () => {
      // Invalidate cache to refetch and be synced with the server.
      queryClient.invalidateQueries({ queryKey });
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

  const thumbnail =
    listDetails && listDetails.backdrop_path
      ? getTMDBImageURL(listDetails.backdrop_path, "1920")
      : NO_IMAGE_LANDSCAPE_PATH;

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
  };

  if (!listDetails) return;

  const isUserOwner =
    authDetails && authDetails.accountId === listDetails.created_by.id;
  return (
    <PageContainer>
      <div className="relative mb-8 rounded-sm overflow-hidden">
        <img className="h-80 sm:h-80 sm:w-full object-cover" src={thumbnail} />
        <div className="bg-black/33 w-full h-full absolute top-0"></div>

        {isUserOwner && (
          <div className="absolute top-0 right-0 p-4 flex flex-col gap-2">
            <button onClick={handleShare} className="secondary-icon-btn p-3">
              <BsBoxArrowUpRight />
            </button>
            <button className="secondary-icon-btn p-3">
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

          <div className="flex text-sm sm:text-base flex-col sm:flex-row sm:gap-8 sm:items-center sm:bg-black/80 p-2 sm:p-4">
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
          {listDetails?.results.map((media, index) => {
            return (
              <ListItem
                index={(currentPage - 1) * 20 + index + 1}
                key={media.id}
              >
                <MediaListItem
                  media={media}
                  onDelete={isUserOwner ? deleteListItemMutation.mutate : null}
                  isDeleting={deleteListItemMutation.isPending}
                />
              </ListItem>
            );
          })}
        </ListContainer>
        <ListPagination
          totalPages={listDetails.total_pages}
          currentPage={listDetails.page}
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
