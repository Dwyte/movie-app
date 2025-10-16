import { Route, Routes, useLocation } from "react-router-dom";

import SearchResults from "./pages/SearchResults";
import MediaPage from "./pages/MediaPage";
import Home from "./pages/Home";

import Header from "./components/Header";
import Test from "./pages/Test";
import LoginPage from "./pages/LoginPage";
import MyLists from "./pages/MyListsPage";
import ListPage from "./pages/ListPage";
import { useMediaQueries } from "./contexts/MediaQueriesContext";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./components/ErrorFallback";

const App = () => {
  const location = useLocation();

  // Set from the page where the Modal Page was viewed.
  const backgroundLocation = location.state?.backgroundLocation;

  // Similar behavior to tailwind's sm:
  const { isSmUp } = useMediaQueries();

  return (
    <main>
      <Header />
      <div>
        {/** This renders current location or the origin page
         * before Modal Page was activated. */}
        <Routes location={isSmUp ? backgroundLocation || location : location}>
          <Route
            path="/search"
            element={
              <ErrorBoundary
                fallbackRender={(props) => (
                  <ErrorFallback className="h-[100vh]" {...props} displayMessage />
                )}
              >
                <SearchResults />
              </ErrorBoundary>
            }
          />
          <Route path="/" element={<Home />} />
          <Route
            path="/movies"
            element={<Home key="movie" mediaType="movie" />}
          />
          <Route path="/series" element={<Home key="tv" mediaType="tv" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/test" element={<Test />} />
          <Route path="/mylists" element={<MyLists />} />
          <Route path="/list/:listId" element={<ListPage />} />
          {/** In mobile, render the MoviePage as standalone page. */}
          <Route path="/tv/:mediaId/*" element={<MediaPage mediaType="tv" />} />
          <Route
            path="/movie/:mediaId/*"
            element={<MediaPage mediaType="movie" />}
          />
        </Routes>

        {/** This renders the MoviePage on top of origin component */}
        {isSmUp && backgroundLocation && (
          <Routes>
            <Route
              path="/tv/:mediaId/*"
              element={<MediaPage mediaType="tv" />}
            />
            <Route
              path="/movie/:mediaId/*"
              element={<MediaPage mediaType="movie" />}
            />
          </Routes>
        )}
      </div>
    </main>
  );
};

export default App;
