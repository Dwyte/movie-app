import { Fragment, useEffect, useRef, useState } from "react";

import PageIndicator from "./PageIndicator";
import ScrollButton from "./ScrollButton";
import MovieCard from "./../MovieCard";

import useIsOnMobile from "../../hooks/useIsOnMobile";

import { Movie } from "../../misc/types";

const MOVIE_CARD_DIV_WIDTH = 272; // Includes 8px right-gap
const LEFT_END_SPACE_WIDTH = 48; // Includes 8px right-gap
const RIGHT_END_SPACE_WIDTH = 16; // 16px, no right-gap
const TOTAL_SPACE_WIDTH = LEFT_END_SPACE_WIDTH + RIGHT_END_SPACE_WIDTH;

interface Props {
  title: string;
  fetchMovies: () => Promise<Movie[]>;
}

const MoviesRow = ({ title, fetchMovies }: Props) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const scrollableDiv = useRef<HTMLDivElement | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const isOnMobile = useIsOnMobile();

  const canScrollLeft = currentPage > 0;
  const canScrollRight = currentPage < totalPages - 1;

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

  const handleResize = () => {
    const currentDiv = scrollableDiv.current;
    if (!currentDiv) return;

    // Compute TotalPages and CurrentPage
    const actualScrollWidth = currentDiv.scrollWidth - TOTAL_SPACE_WIDTH;
    const visibleMoviesCount = Math.floor(
      currentDiv.clientWidth / MOVIE_CARD_DIV_WIDTH
    );

    const step = MOVIE_CARD_DIV_WIDTH * visibleMoviesCount;
    const newTotalPages = Math.ceil(actualScrollWidth / step);
    const newCurrentPage = Math.round(currentDiv.scrollLeft / step);

    setCurrentPage(newCurrentPage);
    setTotalPages(newTotalPages);
  };

  useEffect(() => {
    // Initial compute once the items are loaded.
    if (movies.length > 0) {
      handleResize();
    }
  }, [movies]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /**
   * Moves the scrollable div to show the targetPage based on direction
   * @param direction -1 for previous page, 1 next page
   */
  const shiftPage = (direction: -1 | 1) => {
    const currentDiv = scrollableDiv.current;
    if (currentDiv) {
      const visibleMoviesCount = Math.floor(
        currentDiv.clientWidth / MOVIE_CARD_DIV_WIDTH
      );

      const step = MOVIE_CARD_DIV_WIDTH * visibleMoviesCount;
      const targetPage = Math.max(
        0,
        Math.min(currentPage + direction, totalPages)
      );
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
      <section className="group">
        <div className="flex justify-between items-end ml-4 sm:ml-12">
          <h2>{title}</h2>
          {!isOnMobile && (
            <PageIndicator totalPages={totalPages} currentPage={currentPage} />
          )}
        </div>
        <div className="relative flex items-center">
          {!isOnMobile && (
            <Fragment>
              <ScrollButton
                direction="left"
                onClick={() => shiftPage(-1)}
                isVisible={canScrollLeft}
              />
              <ScrollButton
                direction="right"
                onClick={() => shiftPage(1)}
                isVisible={canScrollRight}
              />
            </Fragment>
          )}
          <div
            ref={scrollableDiv}
            className="flex items-center gap-2 scrollable"
          >
            {/** Acts as left padding, also being scrolled so items go through the edges of the screen.*/}
            <div className="shrink-0 w-2 sm:w-10"></div>

            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}

            {/** Acts as right padding/space when the user reaches the last page. */}
            <div className="shrink-0 w-2 sm:w-4"></div>
          </div>
        </div>
      </section>
    )
  );
};

export default MoviesRow;
