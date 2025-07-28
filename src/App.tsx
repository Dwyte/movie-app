import { Route, Routes, useLocation, useMatch } from "react-router-dom";

import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import ViewMovieModal from "./components/ViewMovieModal";
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
          <Route path="/movie/:movieId" element={<ViewMovieModal />} />
          <Route path="/search" element={<SearchResults />} />
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
