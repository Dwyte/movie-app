import { useSearchParams } from "react-router-dom";

import MediaCard from "../components/MediaCard";

import { getSearchMediaItems } from "../misc/tmdbAPI";
import { useQuery } from "@tanstack/react-query";
import { Media } from "../misc/types";
import PageContainer from "../components/PageContainer";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q");

  const {
    data: results,
    error,
    isLoading,
  } = useQuery<Media[]>({
    enabled: !!searchQuery,
    queryKey: ["search", searchQuery],
    queryFn: async ({ queryKey }) => {
      const [_, searchQuery] = queryKey as [string, string];
      const movieResults = (await getSearchMediaItems("movie", searchQuery))
        .results;
      const tvResults = (await getSearchMediaItems("tv", searchQuery)).results;
      return [...movieResults, ...tvResults];
    },
  });

  if (isLoading) return <div className="mt-100 text-white">Searching...</div>;
  if (!results) return;

  return (
    <PageContainer>
      <h1 className="hidden sm:block text-2xl text-stone-500 sm:mb-8">
        Search Results for: <span className="text-white">"{searchQuery}"</span>
      </h1>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-y-8">
        {results.map((media) => (
          <MediaCard key={media.id} media={media} flexible />
        ))}
      </div>
    </PageContainer>
  );
};

export default SearchResults;
