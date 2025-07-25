import { useEffect, useState } from "react";
import { Movie } from "../types";
import { getTrendingMovies } from "../tmdbAPI";
import MovieCard from "./MovieCard";

const MoviesRow = ({
  title,
  fetchMovies,
}: {
  title: string;
  fetchMovies: () => Promise<Movie[]>;
}) => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const loadTrendingMovies = async () => {
      try {
        const response = await fetchMovies();
        setMovies(response);
      } catch (error) {
        console.log(error);
      }
    };

    loadTrendingMovies();
  }, []);

  return (
    movies.length > 0 && (
      <section>
        <h2 className="ml-4 sm:ml-12">{title}</h2>
        <div className="flex items-center gap-2 scrollable-x">
          <div className="shrink-0 w-2 sm:w-10"></div>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
          <div className="shrink-0 w-2 sm:w-4"></div>
        </div>
      </section>
    )
  );
};

export default MoviesRow;
