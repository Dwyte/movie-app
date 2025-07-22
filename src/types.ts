import { Models } from "appwrite";

export interface MovieGenre {
  id: number;
  name: string;
}

export interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export type TrendingMovie = Models.Document & {
  movie_id: number;
  searchTerm: string;
  poster_url: string;
  count: number;
};

export type DiscoverMoviesAPIResult = {
  page: number;
  total_pages: number;
  total_results: number;
  results: Movie[];
};

export type MovieImage = {
  aspect_ratio: number;
  height: number;
  iso_639_1: string;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
};

export type MovieImagesResult = {
  backdrops: MovieImage[];
  logos: MovieImage[];
  posters: MovieImage[];
};
