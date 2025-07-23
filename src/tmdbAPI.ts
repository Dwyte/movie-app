import {
  DiscoverMoviesAPIResult,
  MovieImage,
  MovieImagesResult,
} from "./types";
import { MovieGenre } from "./types";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

export const searchMovies = async (query: string) => {
  const url = new URL(`${API_BASE_URL}/search/movie`);
  url.searchParams.append("query", query);

  const response = await fetch(url, API_OPTIONS);

  if (!response.ok) {
    throw new Error("Failed to seach movies.");
  }

  return await response.json();
};

export const getMovies = async (
  genres: MovieGenre[] = []
): Promise<DiscoverMoviesAPIResult> => {
  const url = new URL(`${API_BASE_URL}/discover/movie`);
  url.searchParams.append("sort_by", "popularity.desc");

  genres.forEach((genre) => {
    url.searchParams.append("with_genres", genre.id.toString());
  });

  const response = await fetch(url, API_OPTIONS);

  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }

  return await response.json();
};

export const getMovieImages = async (
  movieId: number
): Promise<MovieImagesResult> => {
  const url = new URL(`${API_BASE_URL}/movie/${movieId}/images`);

  const response = await fetch(url, API_OPTIONS);

  if (!response.ok) {
    throw new Error("Failed to get movie images");
  }
  return await response.json();
};

export const getMovieImageURL = (path: string) => {
  const MOVIE_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
  return `${MOVIE_IMAGE_BASE_URL}${path}`;
};
