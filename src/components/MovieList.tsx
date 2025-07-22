import React, { useEffect, useState } from "react";
import { Movie, MovieGenre } from "../types";
import MovieCard from "./MovieCard";
import { getMovies } from "../tmdbAPI";

interface Props {
  genre: MovieGenre;
}

const MovieListByGenre = ({ genre }: Props) => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getMovies([genre]);
        setMovies(data.results);
      } catch (error) {
        console.error(error);
        setMovies([]);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="overflow-hidden">
      <h2>{genre.name}</h2>
      <div className="flex overflow-hidden gap-3">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default MovieListByGenre;
