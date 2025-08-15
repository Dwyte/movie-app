import { useQuery } from "@tanstack/react-query";

import { useAuth } from "../../contexts/AuthContext";
import { getAccountLists } from "../../misc/tmdbAPI";

import ListItem from "./ListItem";
import ListListItem, { ListListItemSkeleton } from "./ListListItem";
import ListContainer from "./ListContainer";
import PageContainer from "../../components/PageContainer";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ListPagination from "../../components/ListPagination";
import ScrollToTop from "../../components/ScrollToTop";
import EmptyListPlaceholder from "../ListPage/EmptyListPlaceholder";

const MyLists = () => {
  const { authDetails, isLoggedIn, isAuthInitialized } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const { data: userLists, isLoading } = useQuery({
    enabled: isLoggedIn,
    queryKey: ["lists", authDetails?.accountId, currentPage],
    queryFn: async () => {
      if (!authDetails) return null;

      const response = await getAccountLists(
        authDetails.accessToken,
        authDetails.accountId,
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
    <PageContainer>
      <ScrollToTop />
      <h1 className="text-3xl text-white mb-2 sm:mb-6">My Lists</h1>
      <div className="flex flex-col gap-4">
        <div>
          <ListContainer>
            {(!userLists || isLoading) &&
              Array.from({ length: 10 }, (_, k) => (
                <ListListItemSkeleton key={k} />
              ))}

            {!isLoading &&
              userLists &&
              userLists.results.map((listItem, index) => (
                <Link key={listItem.id} to={`/list/${listItem.id}`}>
                  <ListItem index={index + 1}>
                    <ListListItem listItem={listItem} />
                  </ListItem>
                </Link>
              ))}
            {userLists?.results.length === 0 && <EmptyListPlaceholder />}
          </ListContainer>
        </div>
        {userLists && userLists.results.length > 0 && (
          <ListPagination
            currentPage={currentPage}
            totalPages={userLists.total_pages}
            onPrevPage={() => setCurrentPage((p) => p - 1)}
            onNextPage={() => setCurrentPage((p) => p + 1)}
          />
        )}
      </div>
    </PageContainer>
  );
};

export default MyLists;
