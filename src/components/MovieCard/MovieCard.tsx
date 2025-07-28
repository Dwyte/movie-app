import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import { getMovieImages, getMovieImageURL } from "../../misc/tmdbAPI";
import { Movie } from "../../misc/types";

import useIsSmUp from "../../hooks/useIsSmUp";

const MovieCard = ({
  movie,
  imgClassNames,
  sourcePathName,
}: {
  movie: Movie;
  imgClassNames?: string;
  sourcePathName?: string;
}) => {
  // Backdrop with Logo used for landscape versions
  const [movieBackdropFilePath, setMovieBackdropFilePath] = useState<
    string | null
  >(null);
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

    if (isSmUp && movieBackdropFilePath === null) {
      findMovieBackdrop();
    }
  }, [isSmUp]);

  const handleMovieCardClick = () => {
    navigate(`/movie/${movie.id}`, {
      state: { backgroundLocation: sourcePathName || location },
    });
  };

  const imgSource = useMemo(() => {
    if (isSmUp) {
      if (movieBackdropFilePath !== null)
        return getMovieImageURL(movieBackdropFilePath);

      return "/no-image-landscape.png";
    }

    if (movie.poster_path) {
      return getMovieImageURL(movie.poster_path);
    }

    return "no-image-portrait.png";
  }, [movieBackdropFilePath, isSmUp]);

  return (
    <div onClick={handleMovieCardClick} className="shrink-0 cursor-pointer">
      <img
        className={`rounded-sm object-cover ${
          imgClassNames || "w-30 h-45 sm:w-66 sm:h-36"
        }`}
        src={imgSource}
        alt={movie.title}
      />
    </div>
  );
};

export default MovieCard;
