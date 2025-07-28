import { Route, Routes, useLocation } from "react-router-dom";

import SearchResults from "./pages/SearchResults";
import MoviePage from "./pages/MoviePage";
import Home from "./pages/Home";

import Header from "./components/Header";
import useIsSmUp from "./hooks/useIsSmUp";

const App = () => {
  const location = useLocation();

  // Set from the page where the Modal Page was viewed.
  const backgroundLocation = location.state?.backgroundLocation;

  // Similar behavior to tailwind's sm:
  const isSmUp = useIsSmUp();

  return (
    <main>
      <Header />

      <div>
        {/** This renders current location or the origin page
         * before Modal Page was activated. */}
        <Routes location={isSmUp ? backgroundLocation || location : location}>
          <Route path="/search" element={<SearchResults />} />
          <Route path="/" element={<Home />} />
          {/** In mobile, render the MoviePage as standalone page. */}
          <Route path="/movie/:movieId" element={<MoviePage />} />
        </Routes>

        {/** This renders the MoviePage on top of origin component */}
        {isSmUp && backgroundLocation && (
          <Routes>
            <Route path="/movie/:movieId" element={<MoviePage />} />
          </Routes>
        )}
      </div>
    </main>
  );
};

export default App;
