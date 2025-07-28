import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import MovieCard from "../components/MovieCard";

import { searchMovies } from "../tmdbAPI";
import { Movie } from "../types";

const SearchResults = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchParams] = useSearchParams();

  const fetchMovies = async (query: string) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await searchMovies(query);
      setMovieList(data.results || []);
    } catch (error) {
      console.log(`Error fetching movies ${error}`);
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
      fetchMovies(query);
    }
  }, [searchParams]);

  return (
    <div className="px-4 pb-4 pt-20 sm:px-16">
      <h2>Search Results for "{query}":</h2>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-3">
        {movieList.map((movie) => (
          <MovieCard key={movie.id} movie={movie} imgClassNames="h-full" />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
