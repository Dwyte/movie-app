import { useQuery } from "@tanstack/react-query";

import { useAuth } from "../../contexts/AuthContext";
import { getAccountLists } from "../../misc/tmdbAPI";

import MyListsListItem, { MyListsListItemSkeleton } from "./MyListsListItem";
import ListItemDiv from "../../components/Lists/ListItemDiv";
import UnorderedList from "../../components/Lists/UnorderedList";
import PageContainer from "../../components/PageContainer";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ListPagination from "../../components/ListPagination";
import ScrollToTop from "../../components/ScrollToTop";
import EmptyListPlaceholder from "../ListPage/EmptyListPlaceholder";
import { AccountLists } from "../../misc/types";

const MyListsPage = () => {
  const { authDetails, isLoggedIn, isAuthInitialized } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const { data: userLists, isLoading } = useQuery({
    queryKey: ["lists", authDetails?.accountId, currentPage],
    queryFn: async () => {
      const response = await getAccountLists(
        authDetails!.accessToken,
        authDetails!.accountId,
        currentPage
      );

      return response;
    },
  });

  useEffect(() => {
    if (isAuthInitialized && !authDetails) {
      navigate("/login");
    }
  }, [isAuthInitialized]);

  return (
    <PageContainer className="pt-6">
      <ScrollToTop />
      <h1 className="text-3xl text-white mb-2 sm:mb-6 ml-2 sm:ml-4" id="my-lists-heading">
        My Lists
      </h1>
      <div className="flex flex-col gap-4">
        {isLoading && (
          <div className="sr-only" role="status">
            Loading My Lists...
          </div>
        )}
        <div>
          <UnorderedList
            aria-labelledby="my-lists-heading"
            aria-busy={isLoading}
          >
            {isLoading &&
              Array.from({ length: 10 }, (_, k) => (
                <li key={k} aria-hidden={true}>
                  <MyListsListItemSkeleton key={k} />
                </li>
              ))}

            {!isLoading &&
              userLists &&
              userLists.results.map((listItem, index) => (
                <li key={listItem.id}>
                  <Link
                    className="group focus:outline-none"
                    to={`/list/${listItem.id}`}
                  >
                    <ListItemDiv index={index + 1}>
                      <MyListsListItem listItem={listItem} />
                    </ListItemDiv>
                  </Link>
                </li>
              ))}

            {userLists?.results.length === 0 && (
              <li aria-live="polite">
                <EmptyListPlaceholder />
              </li>
            )}
          </UnorderedList>
        </div>
        {userLists && userLists.results.length > 0 && (
          <ListPagination
            currentPage={currentPage}
            totalPages={userLists.total_pages}
            onPrevPage={() => setCurrentPage((p) => p - 1)}
            onNextPage={() => setCurrentPage((p) => p + 1)}
            aria-label="Navigate through pages of lists."
          />
        )}
      </div>
    </PageContainer>
  );
};

export default MyListsPage;
