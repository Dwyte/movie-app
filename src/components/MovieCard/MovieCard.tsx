import { useEffect, useState } from "react";
import { movieGenres } from "../../constants";
import { Movie } from "../../types";
import { getMovieImages, getMovieImageURL } from "../../tmdbAPI";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  // Backdrop with Logo used for landscape versions
  const [movieBackdropFilePath, setMovieBackdropFilePath] = useState("");
  const isSmUp = useIsSmUp();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const findMovieBackdrop = async () => {
      try {
        const movieImages = await getMovieImages(movie.id);
        const movieBackdrop = movieImages.backdrops.find(
          (movieImage) =>
            movieImage.iso_639_1 === "en" && movieImage.aspect_ratio > 1
        );
        if (movieBackdrop) {
          setMovieBackdropFilePath(movieBackdrop?.file_path);
        } else if (movie.backdrop_path) {
          setMovieBackdropFilePath(movie.backdrop_path);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (isSmUp && movieBackdropFilePath === "") {
      findMovieBackdrop();
    }
  }, [isSmUp]);

  const img = isSmUp
    ? getMovieImageURL(movieBackdropFilePath)
    : getMovieImageURL(movie.poster_path);

  const handleMovieCardClick = () => {
    navigate(`/movie/${movie.id}`, {
      state: { backgroundLocation: location, movie },
    });
  };

  return (
    <div onClick={handleMovieCardClick} className="shrink-0 cursor-pointer">
      <img
        className="rounded-sm object-cover w-30 h-45 sm:w-66 sm:h-36"
        src={img}
        alt={movie.title}
      />
    </div>
  );
};

export default MovieCard;
