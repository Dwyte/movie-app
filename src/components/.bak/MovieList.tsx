import React, { useCallback, useEffect, useRef, useState } from "react";
import { Movie, MovieGenre } from "../../types";
import MovieCard from "./MovieCard.bak";
import { getMovies } from "../../tmdbAPI";
import {
  BsChevronBarRight,
  BsChevronLeft,
  BsChevronRight,
} from "react-icons/bs";

interface Props {
  genre: MovieGenre;
}

interface ScrollInfo {
  atStart: boolean;
  atEnd: boolean;
}

const MAX_PAGES = 2;

const MovieListByGenre = ({ genre }: Props) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [scrollInfo, setScrollInfo] = useState<ScrollInfo | null>(null);
  const scrollContainer = useRef<HTMLDivElement>(null);

  const updateScrollInfo = () => {
    if (scrollContainer?.current === null) return;

    const { scrollWidth, scrollLeft, clientWidth } = scrollContainer.current;
    const maxScrollLeft = scrollWidth - clientWidth;
    const atStart = scrollLeft === 0;
    const atEnd = scrollLeft >= maxScrollLeft * 0.999;

    console.log({ scrollWidth, scrollLeft, clientWidth });

    setScrollInfo((prev) => {
      const noChanges = prev?.atStart === atStart && prev?.atEnd === atEnd;
      if (noChanges) return prev;

      return { atEnd, atStart };
    });
  };

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

  useEffect(() => {
    updateScrollInfo();
  }, [movies]);

  useEffect(() => {
    const element = scrollContainer.current;
    if (!element) return;

    updateScrollInfo();

    element.addEventListener("scroll", updateScrollInfo);
    return element.addEventListener("scroll", updateScrollInfo);
  }, []);

  const handleScroll = (direction: number) => {
    if (scrollContainer === null) return;
    if (scrollContainer.current === null) return;

    const { scrollWidth, scrollLeft, clientWidth } = scrollContainer.current;
    const maxScrollLeft = scrollWidth - clientWidth;

    scrollContainer.current.scrollTo({
      left: scrollLeft + maxScrollLeft * direction,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <h2 className="absolute">{genre.name}</h2>
      <div className="relative flex items-center">
        <div
          ref={scrollContainer}
          className="flex items-center w-full overflow-x-hidden py-20 px-5 gap-2"
        >
          {movies.slice(0, 10).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        {!scrollInfo?.atStart && (
          <div className="flex items-center h-40 absolute left-0 bg-black p-2">
            <button
              onClick={() => handleScroll(-1)}
              className="movie-list-scroll-button"
            >
              <BsChevronLeft />
            </button>
          </div>
        )}

        {!scrollInfo?.atEnd && (
          <div className="flex items-center h-40 absolute right-0 bg-black p-2">
            <button
              onClick={() => handleScroll(1)}
              className="movie-list-scroll-button right-0"
            >
              <BsChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieListByGenre;
