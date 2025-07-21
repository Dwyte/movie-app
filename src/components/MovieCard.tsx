import { Movie } from "../types";

const MovieCard = ({ movie: { backdrop_path, title } }: { movie: Movie }) => {
  const movieImageSource = backdrop_path
    ? `https://image.tmdb.org/t/p/w500/${backdrop_path}`
    : "/no-movie.png";

  return (
    <div className="movie-poster relative rounded-sm overflow-hidden">
      <img className="w-75 h-auto" src={movieImageSource} alt={title} />

      <div className="flex items-end bg-[linear-gradient(to_top,_black_0%,_transparent_30%)] font-sans tracking-wide text-white absolute top-0 left-0 right-0 bottom-0 px-1">
        <div>{title}</div>
      </div>
    </div>
  );
};

export default MovieCard;
