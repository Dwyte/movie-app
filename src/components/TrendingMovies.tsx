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
        <h2>{title}</h2>
        <div className="flex items-center gap-2 scrollable-x">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    )
  );
};

export default MoviesRow;
