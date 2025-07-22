import React, { useEffect, useState } from "react";
import { Movie } from "../types";
import { useDebounce } from "react-use";
import { updateSearchCount } from "../appwrite";
import { searchMovies } from "../tmdbAPI";
import MovieCard from "./MovieCard";

interface Props {
  searchTerm: string;
}

const MovieSearchResults = ({ searchTerm }: Props) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");

  // Prevents an API call for every change in searchTerm
  // Waits for the user to stop typing before making the API call
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query: string) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await searchMovies(query);

      if (data.Response === "False") {
        setErrorMessage(data.error.message);
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);
      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
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

  useEffect(() => {
    if (debouncedSearchTerm.length > 0) {
      fetchMovies(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <div>
      <h2>Search Results for "{searchTerm}":</h2>
      <div className="grid grid-cols-5 gap-3">
        {movieList.map((movie) => (
          <MovieCard movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default MovieSearchResults;
