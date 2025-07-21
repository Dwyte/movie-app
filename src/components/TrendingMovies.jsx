function TrendingMovies({ trendingMovies }) {
  return (
    trendingMovies.length > 0 && (
      <section className="trending">
        <h2>Trending Movies</h2>
        <ul className="flex items-center gap-3">
          {trendingMovies.map((movie, index) => (
            <li key={movie.$id} className="flex items-start">
              <p>{index + 1}</p>
              <img
                className="w-50 h-auto movie-poster"
                src={movie.poster_url}
                alt={movie.title}
              />
            </li>
          ))}
        </ul>
      </section>
    )
  );
}

export default TrendingMovies;
