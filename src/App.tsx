import { useEffect, useState } from "react";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./appwrite";
import Header from "./components/Header";
import TrendingMovies from "./components/TrendingMovies";
import { Movie, TrendingMovie } from "./types";
import { getMovies, searchMovies } from "./tmdbAPI";

const App = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [trendingMovies, setTrendingMovies] = useState<TrendingMovie[]>([]);

  // Prevents an API call for every change in searchTerm
  // Waits for the user to stop typing before making the API call
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = query ? await searchMovies(query) : await getMovies();

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
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Unknown Error.");
      }
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

  const renderMovieLists = () => {
    if (isLoading) return <Spinner />;
    if (errorMessage) return <p className="text-red-500">{errorMessage}</p>;

    return (
      <ul className="grid grid-cols-5 gap-5">
        {movieList.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </ul>
    );
  };

  return (
    <main className="">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="py-25 px-10">
        {searchTerm.length === 0 && (
          <TrendingMovies trendingMovies={trendingMovies} />
        )}
        <section className="all-movies">
          <h2 className="">
            {searchTerm ? `Showing results for "${searchTerm}"` : "All movies"}
          </h2>
          {renderMovieLists()}
        </section>
      </div>
    </main>
  );
};

export default App;
