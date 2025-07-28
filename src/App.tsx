import { Route, Routes, useLocation, useMatch } from "react-router-dom";

import SearchResults from "./pages/SearchResults";
import MoviePage from "./pages/MoviePage";
import Home from "./pages/Home";

import Header from "./components/Header";
import useIsSmUp from "./hooks/useIsSmUp";

const App = () => {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };
  const backgroundLocation = state?.backgroundLocation;

  const isSmUp = useIsSmUp();
  const isViewingMovie = useMatch("/movie/:id");

  return (
    <main>
      {(!isViewingMovie || isSmUp) && <Header />}

      <div>
        <Routes location={isSmUp ? backgroundLocation || location : location}>
          <Route path="/movie/:movieId" element={<MoviePage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/" element={<Home />} />
        </Routes>
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
