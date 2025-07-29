import {
  DiscoverMoviesAPIResult,
  MovieCreditsAPIResult,
  MovieDetails,
  MovieImagesResult,
  WatchProvidersAPIResults,
  Genre,
} from "./types";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

export const get = async (url: URL): Promise<any> => {
  const response = await fetch(url, API_OPTIONS);
  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }
  return await response.json();
};

export const getSearchMovies = async (
  query: string
): Promise<DiscoverMoviesAPIResult> => {
  const url = new URL(`${API_BASE_URL}/search/movie`);
  url.searchParams.append("query", query);
  return await get(url);
};

export const getDiscoverMovies = async (
  genres: Genre[] = []
): Promise<DiscoverMoviesAPIResult> => {
  const url = new URL(`${API_BASE_URL}/discover/movie`);
  url.searchParams.append("sort_by", "popularity.desc");

  genres.forEach((genre) => {
    url.searchParams.append("with_genres", genre.id.toString());
  });

  return await get(url);
};

export const getTrendingMovies = async (
  timeWindow: "day" | "week"
): Promise<DiscoverMoviesAPIResult> => {
  const url = new URL(`${API_BASE_URL}/trending/movie/${timeWindow}`);
  return await get(url);
};

export const getMovieImages = async (
  movieId: number
): Promise<MovieImagesResult> => {
  const url = new URL(`${API_BASE_URL}/movie/${movieId}/images`);
  return await get(url);
};

export const getMovieDetails = async (
  movieId: number
): Promise<MovieDetails> => {
  const url = new URL(`${API_BASE_URL}/movie/${movieId}`);
  return await get(url);
};

export const getMovieWatchProviders = async (
  movieId: number
): Promise<WatchProvidersAPIResults> => {
  const url = new URL(`${API_BASE_URL}/movie/${movieId}/watch/providers`);
  return await get(url);
};

export const getTMBDImageURL = (path: string, quality: string = "500") => {
  if (!path) throw Error(`Invalid path.  <${path}>`);

  const MOVIE_IMAGE_BASE_URL = `https://image.tmdb.org/t/p/w${quality}`;
  return `${MOVIE_IMAGE_BASE_URL}${path}`;
};

export const getMovieCredits = async (
  movieId: number
): Promise<MovieCreditsAPIResult> => {
  const url = new URL(`${API_BASE_URL}/movie/${movieId}/credits`);
  return await get(url);
};

export const getDiscoverTVShows = async (genres: Genre[]) => {
  const url = new URL(`${API_BASE_URL}/discover/tv`);
  genres.forEach((genre) => {
    url.searchParams.append("with_genres", genre.id.toString());
  });
  url.searchParams.append("sort_by", "popularity.desc");

  return await get(url);
};
