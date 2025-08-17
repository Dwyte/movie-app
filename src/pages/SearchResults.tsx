import { useSearchParams } from "react-router-dom";

import MediaCard from "../components/MediaCard";

import { getSearchMediaItems } from "../misc/tmdbAPI";
import { useQuery } from "@tanstack/react-query";
import { Media } from "../misc/types";
import PageContainer from "../components/PageContainer";
import Skeleton from "../components/Skeleton";
import { useState } from "react";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q");

  const {
    data: results,
    error,
    isFetching,
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

  const [loadedMedia, setLoadedMedia] = useState<{ [k: number]: boolean }>({});
  const isLoadingMediaImages =
    results && !results.every((m) => loadedMedia[m.id]);

  console.log(Object.keys(loadedMedia).length);
  console.log(results?.length);

  const renderResults = () => {
    if (isFetching) {
      return Array.from({ length: 30 }, (_, i) => (
        <Skeleton key={i} className="w-full aspect-[16/9]" />
      ));
    }

    if (results) {
      return results.map((media) => (
        <div key={media.id} className="relative">
          {isLoadingMediaImages && <Skeleton className="absolute inset-0" />}
          <MediaCard
            key={media.id}
            media={media}
            onImageLoad={() =>
              setLoadedMedia((p) => {
                console.log(p);
                return { ...p, [media.id]: true };
              })
            }
            flexible
          />
        </div>
      ));
    }
  };

  return (
    <PageContainer>
      <h1 className="hidden sm:block text-2xl text-stone-500 sm:mb-8">
        Search Results for: <span className="text-white">"{searchQuery}"</span>
      </h1>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-y-8">
        {renderResults()}
      </div>
    </PageContainer>
  );
};

export default SearchResults;
