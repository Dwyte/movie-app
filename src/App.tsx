import { useState } from "react";
import Header from "./components/Header";
import TrendingMovies from "./components/TrendingMovies";
import MovieList from "./components/MovieList";
import { movieGenres } from "./constants";
import MovieSearchResults from "./components/MovieSearchResults";
import { Route, Routes } from "react-router-dom";

const App = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  return (
    <main className="">
      <Header />
      <div className="py-25 px-10">
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <TrendingMovies /> <MovieList genre={movieGenres[0]} />
              </div>
            }
          />

          <Route
            path="/search"
            element={<MovieSearchResults searchTerm={searchTerm} />}
          />
        </Routes>
      </div>
    </main>
  );
};

export default App;
