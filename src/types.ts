import { Models } from "appwrite";

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
}
