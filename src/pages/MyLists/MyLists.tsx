import { useQuery } from "@tanstack/react-query";

import { useAuth } from "../../contexts/AuthContext";
import { getAccountLists } from "../../misc/tmdbAPI";

import ListItem from "./ListItem";
import ListListItem from "./ListListItem";
import ListContainer from "./ListContainer";

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
    <div className="mx-4 mt-20 mb-4 sm:px-12 sm:mx-0 sm:my-24">
      <h1 className="text-3xl text-white mb-2 sm:mb-6">My Lists</h1>
      <ListContainer>
        {userLists?.map((listItem) => (
          <ListItem>
            <ListListItem listItem={listItem} />
          </ListItem>
        ))}
      </ListContainer>
    </div>
  );
};

export default MyLists;
