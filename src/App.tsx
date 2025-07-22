import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import { updateSearchCount } from "./appwrite";
import Header from "./components/Header";
import TrendingMovies from "./components/TrendingMovies";
import { Movie } from "./types";
import { getMovies, searchMovies } from "./tmdbAPI";
import MovieList from "./components/MovieList";
import { movieGenres } from "./constants";
import MovieSearchResults from "./components/MovieSearchResults";

const App = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  return (
    <main className="">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="py-25 px-10">
        {searchTerm.length === 0 ? (
          <div>
            <TrendingMovies />
            <MovieList genre={movieGenres[0]} />
          </div>
        ) : (
          <MovieSearchResults searchTerm={searchTerm} />
        )}
      </div>
    </main>
  );
};

export default App;
