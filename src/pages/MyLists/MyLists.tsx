import { useQuery } from "@tanstack/react-query";

import { useAuth } from "../../contexts/AuthContext";
import { getAccountLists } from "../../misc/tmdbAPI";

import ListItem from "./ListItem";
import ListListItem from "./ListListItem";
import ListContainer from "./ListContainer";
import PageContainer from "../../components/PageContainer";

const MyLists = () => {
  const { authDetails, isLoggedIn } = useAuth();

  const { data: userLists } = useQuery({
    enabled: isLoggedIn,
    initialData: null,
    queryKey: ["lists", authDetails?.accountId],
    queryFn: async () => {
      if (!authDetails) return null;

      const response = await getAccountLists(
        authDetails.accessToken,
        authDetails.accountId
      );

      return response.results;
    },
  });

  return (
    <PageContainer>
      <h1 className="text-3xl text-white mb-2 sm:mb-6">My Lists</h1>
      <ListContainer>
        {userLists?.map((listItem) => (
          <ListItem>
            <ListListItem listItem={listItem} />
          </ListItem>
        ))}
      </ListContainer>
    </PageContainer>
  );
};

export default MyLists;
