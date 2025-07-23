import { useEffect, useState } from "react";
import { movieGenres } from "../constants";
import { Movie } from "../types";
import { getMovieImages, getMovieImageURL } from "../tmdbAPI";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BsSuitHeartFill,
  BsPlusLg,
  BsPlayFill,
  BsBadgeHd,
  BsExplicitFill,
} from "react-icons/bs";

const genreIdsToName = (genreIds: number[]): string[] => {
  return movieGenres
    .filter((genre) => genreIds.includes(genre.id))
    .map((genre) => genre.name);
};

const MovieCard = ({ movie }: { movie: Movie }) => {
  const [movieImageFilePath, setMovieImageFilePath] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchMovieImages = async () => {
      try {
        const movieImages = await getMovieImages(movie.id);
        console.log(movieImages);
        const movieImageWithTitle = movieImages.backdrops.find(
          (movieImage) =>
            movieImage.iso_639_1 === "en" && movieImage.aspect_ratio > 1
        );

        if (movieImageWithTitle) {
          setMovieImageFilePath(movieImageWithTitle.file_path);
          return;
        }

        if (movie.backdrop_path) {
          setMovieImageFilePath(movie.backdrop_path);
          return;
        }

        if (movie.poster_path) {
          setMovieImageFilePath(movie.poster_path);
          return;
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchMovieImages();
  }, []);

  const handleViewMovie = () => {
    navigate(`/movie/${movie.id}`, {
      state: { backgroundLocation: location, movie },
    });
  };

  return (
    <div
      onClick={handleViewMovie}
      className="movie-card w-70 h-40 relative group flex justify-center items-center"
    >
      <div className="w-70 h-40 absolute rounded-sm group-hover:w-77 group-hover:h-44 group-hover:z-100 group-hover:top-[-60px] group-hover:shadow-[0_2px_10px_black]">
        <img
          className="w-70 h-40 rounded-sm object-cover group-hover:w-77 group-hover:h-44 group-hover:rounded-t-sm group-hover:rounded-b-none"
          src={
            movieImageFilePath
              ? getMovieImageURL(movieImageFilePath)
              : "/no-movie.png"
          }
          alt={movie.title}
        />

        <div className="movie-card-info">
          <div className="flex gap-2">
            <button className="round-button round-button-light hover:round-button-dark">
              <BsPlayFill />
            </button>
            <button className="round-button round-button-dark hover:round-button-light">
              <BsPlusLg />
            </button>
            <button className="round-button round-button-dark hover:round-button-light">
              <BsSuitHeartFill />
            </button>
          </div>
          <div className="flex text-stone-500 items-center text-xs gap-1">
            {movie.adult && <BsExplicitFill className="text-base" />}
            <div>1h 58m</div>
            <BsBadgeHd className="text-lg" />
          </div>
          <div className="text-white text-sm">
            {genreIdsToName(movie.genre_ids).slice(0, 4).join(" • ").toString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
