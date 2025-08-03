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
    query && (
      <div className="py-20 sm:py-24 px-4 sm:px-16">
        <h1 className="hidden sm:block text-2xl text-stone-500 sm:mb-8">
          Search Results for: <span className="text-white">"{query}"</span>
        </h1>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-y-8">
          {results.map((media) => (
            <MediaCard media={media} flexible />
          ))}
        </div>
      </div>
    )
  );
};

export default SearchResults;
