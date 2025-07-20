import { useEffect, useState } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./appwrite";
import { useRef } from "react";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [trendingMovies, setTrendingMovies] = useState([]);

  // Prevents an API call for every change in searchTerm
  // Waits for the user to stop typing before making the API call
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();

      if (data.Response === "False") {
        setErrorMessage(data.error.message);
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);
      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.log(`Error fetching movies ${error}`);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main className="">
      <header className="flex justify-between fixed left-0 right-0 top-0 items-center bg-black py-4 px-8">
        <div className="flex justify-between items-center gap-16">
          <img className="w-30 h-9" src="/logo.png" alt="logo" />
          <a className="text-white" href="">
            Movies
          </a>
          <a className="text-gray-500">TV Shows</a>
        </div>

        <div className="flex justify-center items-center gap-8">
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <img
            className="w-10 h-10"
            src="/profile-picture.jpg"
            alt="Smiley Icon"
          />
        </div>
      </header>
      <div className="py-25 px-10">
        {trendingMovies.length > 0 && searchTerm.length === 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul className="flex items-center gap-3">
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id} className="flex items-start">
                  <p>{index + 1}</p>
                  <img
                    className="w-50 h-auto movie-poster"
                    src={movie.poster_url}
                    alt={movie.title}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}
        <section className="all-movies">
          <h2 className="">
            {searchTerm ? `Showing results for "${searchTerm}"` : "All movies"}
          </h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul
              className="grid grid-cols-5 gap-5"
            >
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
