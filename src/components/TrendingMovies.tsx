import { useEffect, useState } from "react";
import { TrendingMovie } from "../types";
import { getTrendingMovies } from "../appwrite";

const TrendingMovies = () => {
  const [trendingMovies, setTrendingMovies] = useState<TrendingMovie[]>([]);

  useEffect(() => {
    const loadTrendingMovies = async () => {
      try {
        const movies = await getTrendingMovies();
        setTrendingMovies(movies || []);
        console.log(movies);
      } catch (error) {
        console.log(error);
      }
    };

    loadTrendingMovies();
  }, []);

  return (
    trendingMovies.length > 0 && (
      <section className="trending">
        <h2>Trending Movies</h2>
        <ul className="flex items-center gap-16 pl-8 overflow-hidden">
          {trendingMovies.map((movie, index) => (
            <li
              key={movie.$id}
              className="flex-none flex items-start cursor-pointer relative"
            >
              <p className="m-0 font-[Bebas_Neue] font-[500] text-[200px] leading-none text-black absolute left-[-42px] bottom-0">
                {index + 1}
              </p>
              <img
                className="w-50 h-auto movie-poster rounded-sm"
                src={movie.poster_url}
                alt={movie.title}
              />
            </li>
          ))}
        </ul>
      </section>
    )
  );
};

export default TrendingMovies;
