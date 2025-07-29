import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import { getMovieImages } from "../../misc/tmdbAPI";
import { getTMDBImageURL } from "../../misc/utils";
import { Movie } from "../../misc/types";

import useIsSmUp from "../../hooks/useIsSmUp";

interface Props {
  movie: Movie;
  imgClassNames?: string;
  sourcePathName?: string;
}
const MovieCard = ({ movie, imgClassNames, sourcePathName }: Props) => {
  // Backdrop with Logo used for landscape versions
  const [backdropWithTitleFilePath, setBackdropWithTitleFilePath] = useState<
    string | null
  >(null);
  const isSmUp = useIsSmUp();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const findMovieBackdrop = async () => {
      try {
        const movieImages = await getMovieImages(movie.id);

        // We look for a backdrop that has "en" for language, meaning
        // that backdrop image has the title/logo and we use that as preview
        // for the movie card so it's easier for the user to identify
        const movieBackdropWithTitle = movieImages.backdrops.find(
          (movieImage) =>
            movieImage.iso_639_1 === "en" && movieImage.aspect_ratio > 1
        );

        if (movieBackdropWithTitle) {
          setBackdropWithTitleFilePath(movieBackdropWithTitle?.file_path);
        }
      } catch (error) {
        console.error(error);
      }
    };

    // Only need to find backdrop/landscape image in Desktop mode.
    // Portrait posters for mobile.
    if (isSmUp && backdropWithTitleFilePath === null) {
      findMovieBackdrop();
    }
  }, [isSmUp]);

  const handleMovieCardClick = () => {
    // Goto MoviePage and set backgroundLocation to tell what page to render
    // at the background when rendering the Modal MoviePage in desktop.
    navigate(`/movie/${movie.id}`, {
      // Current location as default origin before viewing the modal,
      // sourcePathName for recursive MoviePage viewing e.g. Viewing another
      // Movie inside recommendations in MoviePage, the original backgroundLocation
      // is passed as sourcePathName from the first MoviePage's MovieCards.
      state: { backgroundLocation: sourcePathName || location },
    });
  };

  // On Desktop we use landscape/backdrop image, on mobile we use
  // portrait/poster image (this always has the title)
  const imgSource = useMemo(() => {
    if (isSmUp) {
      if (backdropWithTitleFilePath !== null) {
        return getTMDBImageURL(backdropWithTitleFilePath);
      }

      if (movie.backdrop_path) {
        return getTMDBImageURL(movie.backdrop_path);
      }

      return "/no-image-landscape.png";
    }

    if (movie.poster_path) {
      return getTMDBImageURL(movie.poster_path);
    }

    return "no-image-portrait.png";
  }, [backdropWithTitleFilePath, isSmUp]);

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
