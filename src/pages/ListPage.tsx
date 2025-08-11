import React from "react";
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

const ListPage = () => {
  const queryClient = useQueryClient();
  const { authDetails } = useAuth();
  const params = useParams();

  const listId = params?.listId ? parseInt(params?.listId) : null;
  const queryKey = ["list", listId];

  const { data: listDetails } = useQuery({
    enabled: !!authDetails && !!listId,
    queryKey: queryKey,
    queryFn: async () => {
      if (!authDetails || !listId) return null;

      const response = await getListDetails(authDetails?.accessToken, listId);
      return response;
    },
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

  console.log(listDetails);

  return (
    <PageContainer>
      <h1 className="text-white text-3xl mb-4">List {listDetails?.name}</h1>

      <ListContainer>
        {listDetails?.results.map((media) => {
          return (
            <ListItem>
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
