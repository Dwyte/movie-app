import { useState } from "react";
import Header from "./components/Header";
import TrendingMovies from "./components/TrendingMovies";
import MovieList from "./components/MovieList";
import { movieGenres } from "./constants";
import MovieSearchResults from "./components/MovieSearchResults";
import { Route, Routes, useLocation } from "react-router-dom";
import ViewMovieModal from "./components/ViewMovieModal";
import HeroSection from "./components/HeroSection";

const Home = () => {
  return (
    <div>
      <HeroSection />

      <div className="px-10 py-20">
        <TrendingMovies /> <MovieList genre={movieGenres[0]} />
      </div>
    </div>
  );
};

const App = () => {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };
  const backgroundLocation = state?.backgroundLocation;
  console.log(backgroundLocation);
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
