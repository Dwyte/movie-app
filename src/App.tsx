import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import Home from "./pages/Home";

import Header from "./components/Header";
import { useMediaQueries } from "./contexts/MediaQueriesContext";
import RouteErrorBoundary from "./components/RouteErrorBoundary";

const SearchResults = lazy(() => import("./pages/SearchResults"));
const TestPage = lazy(() => import("./pages/Test"));
const MyListsPage = lazy(() => import("./pages/MyListsPage"));
const ListPage = lazy(() => import("./pages/ListPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const MediaPage = lazy(() => import("./pages/MediaPage/MediaPage"));

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
                <Suspense>
                  <SearchResults />
                </Suspense>
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
                <Suspense>
                  <LoginPage />
                </Suspense>
              </RouteErrorBoundary>
            }
          />
          <Route
            path="/test"
            element={
              <RouteErrorBoundary>
                <Suspense>
                  <TestPage />
                </Suspense>
              </RouteErrorBoundary>
            }
          />
          <Route
            path="/mylists"
            element={
              <RouteErrorBoundary>
                <Suspense>
                  <MyListsPage />
                </Suspense>
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
                <Suspense>
                  <MediaPage mediaType="tv" />
                </Suspense>
              </RouteErrorBoundary>
            }
          />
          <Route
            path="/movie/:mediaId/*"
            element={
              <RouteErrorBoundary>
                <Suspense>
                  <MediaPage mediaType="movie" />
                </Suspense>
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
                  <Suspense>
                    <MediaPage mediaType="tv" />
                  </Suspense>
                </RouteErrorBoundary>
              }
            />
            <Route
              path="/movie/:mediaId/*"
              element={
                <RouteErrorBoundary isModal>
                  <Suspense>
                    <MediaPage mediaType="movie" />
                  </Suspense>
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
