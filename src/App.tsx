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
import RouteErrorBoundary from "./components/RouteErrorBoundary";

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
              <RouteErrorBoundary>
                <SearchResults />
              </RouteErrorBoundary>
            }
          />
          <Route
            path="/"
            element={
              <RouteErrorBoundary>
                <Home />
              </RouteErrorBoundary>
            }
          />
          <Route
            path="/movies"
            element={
              <RouteErrorBoundary key="movie">
                <Home mediaType="movie" />
              </RouteErrorBoundary>
            }
          />
          <Route
            path="/series"
            element={
              <RouteErrorBoundary key="tv">
                <Home mediaType="tv" />
              </RouteErrorBoundary>
            }
          />
          <Route
            path="/login"
            element={
              <RouteErrorBoundary>
                <LoginPage />
              </RouteErrorBoundary>
            }
          />
          <Route
            path="/test"
            element={
              <RouteErrorBoundary>
                <Test />
              </RouteErrorBoundary>
            }
          />
          <Route
            path="/mylists"
            element={
              <RouteErrorBoundary>
                <MyLists />
              </RouteErrorBoundary>
            }
          />
          <Route
            path="/list/:listId"
            element={
              <RouteErrorBoundary>
                <ListPage />
              </RouteErrorBoundary>
            }
          />
          {/** In mobile, render the MoviePage as standalone page. */}
          <Route
            path="/tv/:mediaId/*"
            element={
              <RouteErrorBoundary>
                <MediaPage mediaType="tv" />
              </RouteErrorBoundary>
            }
          />
          <Route
            path="/movie/:mediaId/*"
            element={
              <RouteErrorBoundary>
                <MediaPage mediaType="movie" />
              </RouteErrorBoundary>
            }
          />
        </Routes>

        {/** This renders the MoviePage on top of origin component */}
        {isSmUp && backgroundLocation && (
          <Routes>
            <Route
              path="/tv/:mediaId/*"
              element={
                <RouteErrorBoundary isModal>
                  <MediaPage mediaType="tv" />
                </RouteErrorBoundary>
              }
            />
            <Route
              path="/movie/:mediaId/*"
              element={
                <RouteErrorBoundary isModal>
                  <MediaPage mediaType="movie" />
                </RouteErrorBoundary>
              }
            />
          </Routes>
        )}
      </div>
    </main>
  );
};

export default App;
