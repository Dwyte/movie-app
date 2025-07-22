import { Movie } from "../types";

const MovieCard = ({
  movie: { backdrop_path, poster_path, title },
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
    <div className="flex-none movie-poster relative rounded-sm overflow-hidden cursor-pointer">
      <img
        className="w-full h-40 object-cover"
        src={getMovieImageSource()}
        alt={title}
      />
      <div className="flex items-end bg-[linear-gradient(to_top,_black_0%,_transparent_25%)] absolute top-0 left-0 right-0 bottom-0 px-1">
        <div className="font-[Oswald] text-white">{title}</div>
      </div>
    </div>
  );
};

export default MovieCard;
