import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import MediaCard from "../components/MediaCard";

import { getSearchMediaItems } from "../misc/tmdbAPI";
import { Media } from "../misc/types";

const SearchResults = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [results, setResults] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchParams] = useSearchParams();

  const searchMediaItems = async (query: string) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await getSearchMediaItems("movie", query);
      setResults(data.results || []);
    } catch (error) {
      console.log(`Error searching media ${error}`);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Unknown Error.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const query = searchParams.get("q");

  useEffect(() => {
    if (query) {
      searchMediaItems(query);
    }
  }, [searchParams]);

  return (
    <div className="px-4 pb-4 pt-20 sm:px-16">
      <h2>Search Results for "{query}":</h2>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-3">
        {results.map((mediaItem) => (
          <MediaCard
            key={mediaItem.id}
            media={mediaItem}
            imgClassNames="h-full"
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
