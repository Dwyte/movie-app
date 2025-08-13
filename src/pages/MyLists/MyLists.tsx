import { useQuery } from "@tanstack/react-query";

import { useAuth } from "../../contexts/AuthContext";
import { getAccountLists } from "../../misc/tmdbAPI";

import ListItem from "./ListItem";
import ListListItem from "./ListListItem";
import ListContainer from "./ListContainer";
import PageContainer from "../../components/PageContainer";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ListPagination from "../../components/ListPagination";
import ScrollToTop from "../../components/ScrollToTop";

const MyLists = () => {
  const { authDetails, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const { data: userLists } = useQuery({
    enabled: isLoggedIn,
    initialData: null,
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
    if (!authDetails) {
      navigate("/login");
    }
  });

  if (!userLists) return;

  return (
    <PageContainer>
      <ScrollToTop />
      <h1 className="text-3xl text-white mb-2 sm:mb-6">My Lists</h1>
      <div className="flex flex-col gap-4">
        <ListContainer>
          {userLists.results.map((listItem, index) => (
            <Link key={listItem.id} to={`/list/${listItem.id}`}>
              <ListItem index={index + 1}>
                <ListListItem listItem={listItem} />
              </ListItem>
            </Link>
          ))}
        </ListContainer>
        <ListPagination
          currentPage={currentPage}
          totalPages={userLists.total_pages}
          onPrevPage={() => setCurrentPage((p) => p - 1)}
          onNextPage={() => setCurrentPage((p) => p + 1)}
        />
      </div>
    </PageContainer>
  );
};

export default MyLists;
