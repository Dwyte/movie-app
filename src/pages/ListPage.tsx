import React, { ReactNode } from "react";
import PageContainer from "../components/PageContainer";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteListItems, getListDetails } from "../misc/tmdbAPI";
import { useAuth } from "../contexts/AuthContext";
import ListContainer from "./MyLists/ListContainer";
import ListItem from "./MyLists/ListItem";
import MediaListItem from "./MyLists/MediaListItem";
import { List, ListDetails, Media, MediaRef } from "../misc/types";
import { MdNearbyError } from "react-icons/md";
import { NO_IMAGE_LANDSCAPE_PATH } from "../misc/constants";
import { getDurationString, getTMDBImageURL } from "../misc/utils";
import FiveStarRating from "../components/FiveStarRating";

const ListDetailsDataField = ({
  label,
  value,
}: {
  label: ReactNode | string;
  value: ReactNode | string;
}) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-stone-400">{label}</span>
      {value}
    </div>
  );
};

const ListPage = () => {
  const queryClient = useQueryClient();
  const { authDetails } = useAuth();
  const params = useParams();

  const listId = params?.listId ? parseInt(params?.listId) : null;
  const queryKey = ["listDetails", listId];

  const { data: listDetails } = useQuery({
    enabled: !!authDetails && !!listId,
    queryKey: queryKey,
    queryFn: async () => {
      if (!authDetails || !listId) return null;

      const response = await getListDetails(authDetails?.accessToken, listId);
      return response;
    },
    staleTime: 1000 * 60 * 10,
  });

  const deleteMutation = useMutation({
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

  const thumbnail =
    listDetails && listDetails.backdrop_path
      ? getTMDBImageURL(listDetails.backdrop_path, "1920")
      : NO_IMAGE_LANDSCAPE_PATH;

  return (
    <PageContainer>
      <div className="relative mb-8 rounded-sm overflow-hidden">
        <img className="h-80 sm:h-80 sm:w-full object-cover" src={thumbnail} />
        <div className="bg-black/33 w-full h-full absolute top-0"></div>

        <div className="flex flex-col absolute bottom-0 text-white w-full">
          <div className="p-2 sm:p-4">
            <h1 className="text-4xl font-bold">{listDetails?.name}</h1>
            <p className="text-base">
              {listDetails?.description || "No description."}
            </p>
          </div>

          <div className="flex text-sm sm:text-base flex-col sm:flex-row sm:gap-8 sm:items-center sm:bg-black/80 p-2 sm:p-4">
            <ListDetailsDataField
              label={"Created by:"}
              value={listDetails?.created_by.username}
            />
            <ListDetailsDataField
              label={"Shows Count:"}
              value={listDetails?.item_count}
            />
            <ListDetailsDataField
              label={"Total Runtime:"}
              value={getDurationString(listDetails?.runtime || 0)}
            />
            <ListDetailsDataField
              label={"Average Rating:"}
              value={
                <FiveStarRating rating={listDetails?.average_rating || 0} />
              }
            />
          </div>
        </div>
      </div>

      <ListContainer>
        {listDetails?.results.map((media) => {
          return (
            <ListItem key={media.id}>
              <MediaListItem
                media={media}
                onDelete={() =>
                  deleteMutation.mutate({
                    media_id: media.id,
                    media_type: media.media_type,
                  })
                }
                isDeleting={deleteMutation.isPending}
              />
            </ListItem>
          );
        })}
      </ListContainer>
    </PageContainer>
  );
};

export default ListPage;
