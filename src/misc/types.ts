import { COUNTRY_CODES, LANGUAGE_CODES } from "./constants";

export interface Genre {
  id: number;
  name: string;
}

export type MediaType = "movie" | "tv";

export interface Media {
  media_type: MediaType;
  title: string;
  release_date: string;

  id: number;
  genre_ids: number[];
  backdrop_path: string;
  poster_path: string;
  overview: string;
  adult: boolean;
  original_language: LanguageCode;
  popularity: number;
  vote_average: number;
  vote_count: number;

  video?: boolean; // Movie
  original_country?: CountryCode[]; // TV
}

export interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: LanguageCode;
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

export interface TV {
  adult: boolean;
  backdrop_path: string;
  first_air_date: string;
  genre_ids: number[];
  id: number;
  name: string;
  origin_country: CountryCode[];
  original_language: LanguageCode;
  original_name: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  vote_count: number;
}

export interface MovieDetails {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: string;
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imbd_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountries[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguages[];
  status: string;
  tagline: string;
  title: string;
  video: false;
  vote_average: number;
  vote_count: number;
}

export interface TVDetails {
  adult: boolean;
  backdrop_path: string;
  created_by: {
    id: number;
    credit_id: string;
    name: string;
    gender: number;
    profile_path: string;
  }[];
  episode_run_time: number[];
  first_air_date: string;
  genres: Genre[];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: LanguageCode[];
  last_air_date: string;
  last_episode_to_air: Episode;
  name: string;
  next_episode_to_air: Episode | null;
  networks: TVNetwork[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: CountryCode[];
  original_language: LanguageCode;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountries[];
  seasons: Season[];
  spoken_languages: SpokenLanguages[];
  status: "Ended" | "Returning Series" | "Canceled" | "Pilot";
  tagline: string;
  type: "Scripted" | "Reality" | "Documentary" | "Talk Show" | "Animation";
  vote_average: number;
  vote_count: number;
}

export interface SpokenLanguages {
  english_name: string;
  iso_639_1: LanguageCode;
  name: string;
}

export interface Season {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  poster_path: string;
  season_number: number;
  vote_average: number;
}

export interface TVNetwork {
  id: number;
  logo_path: string;
  name: string;
  origin_country: CountryCode;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  air_date: string;
  episode_number: number;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

export interface ProductionCountries {
  iso_3166_1: CountryCode;
  name: string;
}

export interface SpokenLanguages {
  english_name: string;
  iso_639_1: LanguageCode;
  name: string;
}

export interface WatchProvider {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

export interface WatchProvidersAPIResults {
  id: number;
  results: {
    [key in CountryCode]: {
      link: string;
      flatrate: WatchProvider[];
      rent: WatchProvider[];
      buy: WatchProvider[];
    };
  };
}

export type CountryCode = (typeof COUNTRY_CODES)[number];

export type LanguageCode = (typeof LANGUAGE_CODES)[number];

export interface Cast {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface Crew {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  credit_id: string;
  department: string;
  job: string;
}

export interface MovieCreditsAPIResult {
  id: number;
  cast: Cast[];
  crew: Crew[];
}

export interface DiscoverMoviesAPIResult {
  page: number;
  total_pages: number;
  total_results: number;
  results: Movie[];
}

export interface MovieImage {
  aspect_ratio: number;
  height: number;
  iso_639_1: LanguageCode;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface MovieImagesResult {
  backdrops: MovieImage[];
  logos: MovieImage[];
  posters: MovieImage[];
}

export interface NavLinks {
  name: string;
  path: string;
}
