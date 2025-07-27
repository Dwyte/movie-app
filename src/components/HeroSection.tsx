import { useEffect, useState } from "react";
import { Movie, MovieImage } from "../types";
import {
  getMovieImages,
  getMovieImageURL,
  getTrendingMovies,
} from "../tmdbAPI";
import { BsPlusCircleFill } from "react-icons/bs";
import { FaInfoCircle } from "react-icons/fa";
import GenreList from "./GenreList";
import { shortenParagraph } from "../utils";

const HeroSection = () => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [logo, setLogo] = useState<MovieImage | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      const trendingMovies = await getTrendingMovies("week");
      const movie =
        trendingMovies.results[
          Math.floor(Math.random() * trendingMovies.results.length)
        ];
      const images = await getMovieImages(movie.id);

      const backdrop = images.backdrops.filter(
        (backdrop) => backdrop.iso_639_1 === null
      )[Math.floor(Math.random() * images.backdrops.length)];

      if (backdrop) movie.backdrop_path = backdrop.file_path;

      const logo = images.logos.find((logo) => logo.iso_639_1 === "en");
      console.log(logo);
      if (logo) setLogo(logo);

      setMovie(movie);
    };

    fetchMovies();
  }, []);

  return (
    <div className="relative">
      <div className="hidden sm:block absolute inset-0 bg-linear-to-r from-black to-black/0 to-60%"></div>
      <img
        className="w-full h-120 sm:h-screen object-cover sm:inset-shadow-lg"
        src={
          movie
            ? getMovieImageURL(movie?.backdrop_path, "1920")
            : "/hero-image.jpg"
        }
        alt="Random Movie Posters"
      />
      {movie && (
        <div className="flex items-end sm:items-center sm:mt-[-100px] justify-center sm:justify-start absolute top-0 bottom-[-1px] right-0 left-0 bg-linear-to-t from-[#000] to-black/0 to-50% sm:to-25%">
          <div className="flex flex-col gap-2 sm:gap-4 justify-center sm:ml-12">
            {logo && (
              <div className="flex mb-2 px-10 justify-center sm:px-0 sm:justify-start">

                <img
                  className={`w-auto max-h-50 sm:w-auto sm:max-h-65`}
                  src={getMovieImageURL(logo.file_path, "500")}
                  alt=""
                />
              </div>
            )}

            <div className="hidden text-white sm:block sm:w-150 sm:text-sm">
              {shortenParagraph(movie.overview, 100)}
            </div>

            <GenreList
              genreIds={movie.genre_ids}
              className="text-center sm:text-left"
            />
            <div className="flex gap-4 justify-center sm:justify-start">
              <button className="primary-btn">
                <BsPlusCircleFill className="text-md mr-2" />
                Add to my List
              </button>

              <button className="secondary-btn">
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
