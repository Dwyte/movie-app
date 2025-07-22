import React, { useEffect, useRef, useState } from "react";
import { Movie, MovieGenre } from "../types";
import MovieCard from "./MovieCard";
import { getMovies } from "../tmdbAPI";

interface Props {
  genre: MovieGenre;
}

const MovieListByGenre = ({ genre }: Props) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const scrollContainer = useRef<HTMLDivElement>(null);

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

  const handleScroll = (value: number) => {
    if (scrollContainer === null) return;
    if (scrollContainer.current === null) return;

    scrollContainer.current.scrollTo({
      left: scrollContainer.current.scrollLeft + value,
      behavior: "smooth",
    });
  };

  return (
    <div className="overflow-hidden">
      <h2>{genre.name}</h2>
      <div className="relative flex items-center">
        <div ref={scrollContainer} className="flex overflow-hidden gap-3">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        <button
          onClick={() => handleScroll(-1500)}
          className="absolute left-0 text-white z-5 bg-black cursor-pointer"
        >
          Back
        </button>
        <button
          onClick={() => handleScroll(1500)}
          className="absolute right-0 text-white z-5 bg-black cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MovieListByGenre;
