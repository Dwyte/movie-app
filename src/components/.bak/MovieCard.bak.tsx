import { useEffect, useState } from "react";
import { MOVIE_GENRES } from "../../constants";
import { Movie } from "../../types";
import { getMovieImages, getTMDBImageURL } from "../../tmdbAPI";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BsSuitHeartFill,
  BsPlusLg,
  BsPlayFill,
  BsBadgeHd,
  BsExplicitFill,
} from "react-icons/bs";
import GenreList from "../GenreList";
import useIsSmUp from "../../hooks/useIsSmUp";

const MovieCard = ({ movie }: { movie: Movie }) => {
  const [movieImageFilePath, setMovieImageFilePath] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const isSmUp = useIsSmUp();

  useEffect(() => {
    const fetchMovieImages = async () => {
      try {
        console.log(isSmUp);
        if (isSmUp) {
          const movieImages = await getMovieImages(movie.id);
          const movieBackdrop = movieImages.backdrops.find(
            (movieImage) =>
              movieImage.iso_639_1 === "en" && movieImage.aspect_ratio > 1
          );
          if (movieBackdrop) setMovieImageFilePath(movieBackdrop?.file_path);
        } else {
          setMovieImageFilePath(movie.poster_path);
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
    <div onClick={handleViewMovie} className="w-70">
      <div className="w-80">
        <img
          className="w-200"
          src={
            movieImageFilePath
              ? getTMDBImageURL(movieImageFilePath)
              : "/no-movie.png"
          }
          alt={movie.title}
        />

        <div className="hidden movie-card-info">
          <div className="flex gap-2">
            <button className="icon-btn">
              <BsPlayFill />
            </button>
            <button className="icon-btn">
              <BsPlusLg />
            </button>
            <button className="icon-btn">
              <BsSuitHeartFill />
            </button>
          </div>
          <div className="flex text-stone-500 items-center text-xs gap-1">
            {movie.adult && <BsExplicitFill className="text-base" />}
            <div>1h 58m</div>
            <BsBadgeHd className="text-lg" />
          </div>

          <GenreList genreIds={movie.genre_ids} className="text-sm" />
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
