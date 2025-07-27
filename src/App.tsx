import Header from "./components/Header";
import { movieGenres } from "./constants";
import MovieSearchResults from "./components/MovieSearchResults";
import { Route, Routes, useLocation, useMatch } from "react-router-dom";
import ViewMovieModal from "./components/ViewMovieModal";
import HeroSection from "./components/HeroSection";
import MoviesRow from "./components/MoviesRow";
import { getMovies, getTrendingMovies } from "./tmdbAPI";
import useIsSmUp from "./hooks/useIsSmUp";

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
              const movies = await getMovies([movieGenres[2]]);
              return movies.results;
            }}
          />

          <MoviesRow
            title="Comedy"
            fetchMovies={async () => {
              const movies = await getMovies([movieGenres[3]]);
              return movies.results;
            }}
          />
          <MoviesRow
            title="Horror"
            fetchMovies={async () => {
              const movies = await getMovies([movieGenres[10]]);
              return movies.results;
            }}
          />
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };
  const backgroundLocation = state?.backgroundLocation;

  const isSmUp = useIsSmUp();
  const hideHeader = useMatch("/movie/:id");

  return (
    <main>
      {!hideHeader && <Header />}

      <div>
        <Routes location={isSmUp ? backgroundLocation || location : location}>
          <Route path="/movie/:movieId" element={<ViewMovieModal />} />
          <Route path="/search" element={<MovieSearchResults />} />
          <Route path="/" element={<Home />} />
        </Routes>
        {isSmUp && backgroundLocation && (
          <Routes>
            <Route path="/movie/:movieId" element={<ViewMovieModal />} />
          </Routes>
        )}
      </div>
    </main>
  );
};

export default App;
