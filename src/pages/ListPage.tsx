import React from "react";
import PageContainer from "../components/PageContainer";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getListDetails } from "../misc/tmdbAPI";
import { useAuth } from "../contexts/AuthContext";
import ListContainer from "./MyLists/ListContainer";
import ListItem from "./MyLists/ListItem";
import MediaListItem from "./MyLists/MediaListItem";

const ListPage = () => {
  const params = useParams();
  const listId = params?.listId ? parseInt(params?.listId) : null;
  const { authDetails } = useAuth();

  const { data: listDetails } = useQuery({
    enabled: !!authDetails && !!listId,
    queryKey: ["list", listId],
    queryFn: async () => {
      if (!authDetails || !listId) return null;

      const response = await getListDetails(authDetails?.accessToken, listId);
      return response;
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
              <MediaListItem media={media} />
            </ListItem>
          );
        })}
      </ListContainer>
    </PageContainer>
  );
};

export default ListPage;
