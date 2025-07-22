import { movieGenres } from "../constants";
import { Movie } from "../types";

const genreIdsToName = (genreIds: number[]): string[] => {
  return movieGenres
    .filter((genre) => genreIds.includes(genre.id))
    .map((genre) => genre.name);
};

const MovieCard = ({
  movie: { backdrop_path, poster_path, title, genre_ids },
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

  return (
    <div className="movie-card">
      <div className="w-70 h-40 relative group flex justify-center items-center">
        <div className="w-full absolute group-hover:w-90 group-hover:z-100 group-hover:top-[-50px]">
          <img
            className="object-cover"
            src={getMovieImageSource()}
            alt={title}
          />

          <div className="movie-card-info">
            <div className="font-[Oswald] text-white">{title}</div>
            <div className="font-[Oswald] text-white">{genreIdsToName(genre_ids).toString()}</div>
          </div>
        </div>
        <div className="movie-card-title">
          <div className="font-[Oswald] text-white">{title}</div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
