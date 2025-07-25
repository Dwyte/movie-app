import { useState } from "react";
import Header from "./components/Header";
import TrendingMovies from "./components/TrendingMovies";
import MovieList from "./components/MovieList";
import { movieGenres } from "./constants";
import MovieSearchResults from "./components/MovieSearchResults";
import { Route, Routes, useLocation } from "react-router-dom";
import ViewMovieModal from "./components/ViewMovieModal";
import HeroSection from "./components/HeroSection";
import MoviesRow from "./components/TrendingMovies";
import { getMovies, getTrendingMovies } from "./tmdbAPI";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <div className="flex flex-col gap-2 py-6 pl-6 sm:pt-6 sm:pb-16 sm:pl-16">
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
  );
};

const App = () => {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };
  const backgroundLocation = state?.backgroundLocation;
  return (
    <main>
      <Header />
      <div className="relative">
        <Routes location={backgroundLocation || location}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<MovieSearchResults />} />
          <Route path="/movie/:movieId" element={<ViewMovieModal />} />
        </Routes>
        {backgroundLocation && (
          <Routes>
            <Route path="/movie/:movieId" element={<ViewMovieModal />} />
          </Routes>
        )}
      </div>
    </main>
  );
};

export default App;
