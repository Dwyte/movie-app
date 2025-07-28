import { useEffect, useRef, useState } from "react";
import { Movie } from "../misc/types";
import MovieCard from "./MovieCard";
import {
  BsChevronBarLeft,
  BsChevronBarRight,
  BsChevronCompactLeft,
  BsChevronCompactRight,
} from "react-icons/bs";

const MOVIE_CARD_DIV_WIDTH = 272; // Includes 8px gap
const LEFT_END_SPACE_WIDTH = 48; // 40 + 8px gap
const RIGHT_END_SPACE_WIDTH = 16; // 16
const TOTAL_SPACE_WIDTH = LEFT_END_SPACE_WIDTH + RIGHT_END_SPACE_WIDTH;

const MoviesRow = ({
  title,
  fetchMovies,
}: {
  title: string;
  fetchMovies: () => Promise<Movie[]>;
}) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const scrollableDiv = useRef<HTMLDivElement | null>(null);
  const [pages, setPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);

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

  useEffect(() => {
    const handleResize = () => {
      const currentDiv = scrollableDiv.current;
      if (!currentDiv) return;
      const actualScrollWidth = currentDiv.scrollWidth - TOTAL_SPACE_WIDTH;
      const visibleMoviesCount = Math.floor(
        currentDiv.clientWidth / MOVIE_CARD_DIV_WIDTH
      );

      const step = MOVIE_CARD_DIV_WIDTH * visibleMoviesCount;
      const newPages = actualScrollWidth / step;
      const newCurrentPage = Math.round(currentDiv.scrollLeft / step);

      setCurrentPage(newCurrentPage);
      setPages(newPages);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleScrollButtonClick = (direction: number) => {
    const currentDiv = scrollableDiv.current;
    if (currentDiv) {
      const actualScrollWidth = currentDiv.scrollWidth - TOTAL_SPACE_WIDTH;
      const visibleMoviesCount = Math.floor(
        currentDiv.clientWidth / MOVIE_CARD_DIV_WIDTH
      );

      const step = MOVIE_CARD_DIV_WIDTH * visibleMoviesCount;
      const pages = actualScrollWidth / step;

      const currentPage = Math.round(currentDiv.scrollLeft / step);
      const targetPage = Math.max(0, Math.min(currentPage + direction, pages));
      setCurrentPage(targetPage);
      const targetPageScrollLeft = step * targetPage;

      currentDiv.scrollTo({
        left: targetPageScrollLeft,
        behavior: "smooth",
      });
    }
  };

  return (
    movies.length > 0 && (
      <section>
        <h2 className="ml-4 sm:ml-12">{title}</h2>
        <div ref={scrollableDiv} className="flex items-center gap-2 scrollable">
          {currentPage > 0 && (
            <div className="absolute flex items-center justify-start left-0 text-white w-16 h-36 bg-linear-to-r from-black to-black/0">
              <button
                onClick={() => handleScrollButtonClick(-1)}
                className="px-2 h-full cursor-pointer"
              >
                <BsChevronCompactLeft className="text-2xl" />
              </button>
            </div>
          )}

          <div className="shrink-0 w-2 sm:w-10"></div>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
          <div className="shrink-0 w-2 sm:w-4"></div>
          {currentPage + 1 < pages && (
            <div className="absolute flex items-center justify-end right-0 text-white w-16 h-36 bg-linear-to-l from-black to-black/0">
              <button
                onClick={() => handleScrollButtonClick(1)}
                className="px-2 h-full cursor-pointer"
              >
                <BsChevronCompactRight className="text-2xl" />
              </button>
            </div>
          )}
        </div>
      </section>
    )
  );
};

export default MoviesRow;
