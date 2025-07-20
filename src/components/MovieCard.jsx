import React from "react";

function MovieCard({
  movie: { title, vote_average, poster_path, release_date, original_language },
}) {
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
}

export default MovieCard;
