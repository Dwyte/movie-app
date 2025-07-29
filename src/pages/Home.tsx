import HeroSection from "../components/HeroSection";
import MoviesRow from "../components/MoviesRow";
import { MOVIE_GENRES } from "../misc/constants";
import { getDiscoverMovies, getTrendingMovies } from "../misc/tmdbAPI";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <div className="relative">
        <div className="flex flex-col gap-2 py-6 sm:absolute sm:top-[-200px] sm:pt-6 sm:pb-16">
          <MoviesRow
            title="Popular Today"
            fetchMovies={async () => {
              const movies = await getTrendingMovies("day");
              return movies.results;
            }}
          />
          <MoviesRow
            title="Animation"
            fetchMovies={async () => {
              const movies = await getDiscoverMovies([MOVIE_GENRES[2]]);
              return movies.results;
            }}
          />

          <MoviesRow
            title="Comedy"
            fetchMovies={async () => {
              const movies = await getDiscoverMovies([MOVIE_GENRES[3]]);
              return movies.results;
            }}
          />
          <MoviesRow
            title="Horror"
            fetchMovies={async () => {
              const movies = await getDiscoverMovies([MOVIE_GENRES[10]]);
              return movies.results;
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
