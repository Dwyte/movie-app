import { useEffect, useState } from "react";
import { movieGenres } from "../constants";
import { Movie } from "../types";
import { getMovieImages, getMovieImageURL } from "../tmdbAPI";
import { Link, useLocation, useNavigate } from "react-router-dom";

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
      <div className="w-70 h-40 absolute group-hover:w-90 group-hover:h-50 group-hover:z-100 group-hover:top-[-50px] group-hover:shadow-2xl">
        <img
          className="w-70 h-40 rounded-sm object-cover group-hover:w-90 group-hover:h-50 group-hover:rounded-t-sm group-hover:rounded-b-none"
          src={
            movieImageFilePath
              ? getMovieImageURL(movieImageFilePath)
              : "/no-movie.png"
          }
          alt={movie.title}
        />

        <div className="movie-card-info">
          <div className="font-[Oswald] text-white">{movie.title}</div>
          <div className="font-[Oswald] text-white">
            {genreIdsToName(movie.genre_ids).toString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
