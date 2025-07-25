import { useEffect, useState } from "react";
import { Movie } from "../types";
import {
  getMovieImages,
  getMovieImageURL,
  getTrendingMovies,
} from "../tmdbAPI";
import { BsPlusCircleFill } from "react-icons/bs";
import { FaInfoCircle } from "react-icons/fa";
import GenreList from "./GenreList";

const HeroSection = () => {
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      const trendingMovies = await getTrendingMovies("week");
      const movie = trendingMovies.results[0];
      const images = await getMovieImages(movie.id);

      const backdrop = images.backdrops.filter(
        (backdrop) => backdrop.iso_639_1 === null
      )[Math.floor(Math.random() * images.backdrops.length)];

      if (backdrop) movie.backdrop_path = backdrop.file_path;

      const logo = images.logos.find((logo) => logo.iso_639_1 === "en");
      if (logo) movie.poster_path = logo.file_path;

      setMovie(movie);
    };

    fetchMovies();
  }, []);

  return (
    <div className="relative">
      <div className="hidden sm:block absolute inset-0 bg-linear-to-r from-black to-black/0 to-60%"></div>
      <img
        className="w-full h-120 sm:h-150 object-cover sm:inset-shadow-lg"
        src={
          movie
            ? getMovieImageURL(movie?.backdrop_path, "1920")
            : "/hero-image.jpg"
        }
        alt="Random Movie Posters"
      />
      {movie && (
        <div className="flex items-end justify-center sm:justify-start absolute top-0 bottom-[-1px] right-0 left-0 bg-linear-to-t from-[#000] to-black/0 to-50% sm:to-25%">
          <div className="flex flex-col justify-center sm:ml-12">
            <div className="flex mb-2 justify-center sm:justify-start sm:mb-8">
              <img
                className="w-50 sm:w-100"
                src={getMovieImageURL(movie?.poster_path, "500")}
                alt=""
              />
            </div>

            <div className="hidden text-white sm:block sm:w-150 sm:text-sm sm:mb-4">
              {movie.overview}
            </div>

            <GenreList
              genreIds={movie.genre_ids}
              className="text-center mb-2 sm:text-left sm:mb-4"
            />
            <div className="flex gap-4 justify-center sm:justify-start">
              <button className="rounded-sm py-2 px-3 text-stone-900 font-semibold cursor-pointer bg-white flex items-center hover:opacity-80">
                <BsPlusCircleFill className="text-md mr-2" />
                Add to my List
              </button>

              <button className="rounded-sm py-2 px-3 text-stone-100 font-semibold cursor-pointer bg-stone-500 flex items-center hover:opacity-80">
                <FaInfoCircle className="text-md mr-2" />
                More Info
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSection;
