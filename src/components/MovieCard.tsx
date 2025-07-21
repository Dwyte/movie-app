import { Movie } from "../types";

const MovieCard = ({ movie: { poster_path, title } }: { movie: Movie }) => {
  return (
    <img
      className="movie-poster w-75 h-auto"
      src={
        poster_path
          ? `https://image.tmdb.org/t/p/w500/${poster_path}`
          : "/no-movie.png"
      }
      alt={title}
    />
  );
};

export default MovieCard;
