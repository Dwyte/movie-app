import { useEffect, useState } from "react";
import { movieGenres } from "../constants";
import { Movie } from "../types";
import { getMovieImages } from "../tmdbAPI";

const genreIdsToName = (genreIds: number[]): string[] => {
  return movieGenres
    .filter((genre) => genreIds.includes(genre.id))
    .map((genre) => genre.name);
};

const MOVIE_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const MovieCard = ({
  movie: { backdrop_path, poster_path, title, genre_ids, id },
}: {
  movie: Movie;
}) => {
  const getMovieImageSource = () => {
    if (backdrop_path) {
      return `https://image.tmdb.org/t/p/w500/${backdrop_path}`;
    }

    if (poster_path) {
      return `https://image.tmdb.org/t/p/w500/${poster_path}`;
    }

    return "/no-movie.png";
  };

  const [moveImageFilePath, setMovieImageFilePath] = useState("");

  useEffect(() => {
    const fetchMovieImages = async () => {
      try {
        const movieImages = await getMovieImages(id);
        console.log(movieImages);
        const movieImageWithTitle = movieImages.backdrops.find(
          (movieImage) =>
            movieImage.iso_639_1 === "en" && movieImage.aspect_ratio > 1
        );

        if (movieImageWithTitle) {
          setMovieImageFilePath(movieImageWithTitle.file_path);
          return;
        }

        if (backdrop_path) {
          setMovieImageFilePath(backdrop_path);
          return;
        }

        if (poster_path) {
          setMovieImageFilePath("");
          return;
        }

        setMovieImageFilePath("/no-movie.png");
      } catch (error) {
        console.error(error);
      }
    };

    fetchMovieImages();
  }, []);

  return (
    <div className="movie-card">
      <div className="w-70 h-40 relative group flex justify-center items-center">
        <div className="w-full absolute group-hover:w-90 group-hover:z-100 group-hover:top-[-50px] group-hover:shadow-2xl">
          <img
            className="rounded-sm object-cover group-hover:rounded-t-sm group-hover:rounded-b-none"
            src={
              moveImageFilePath
                ? `${MOVIE_IMAGE_BASE_URL}${moveImageFilePath}`
                : "/no-movie.png"
            }
            alt={title}
          />

          <div className="movie-card-info">
            <div className="font-[Oswald] text-white">{title}</div>
            <div className="font-[Oswald] text-white">
              {genreIdsToName(genre_ids).toString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
