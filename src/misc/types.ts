import { UseQueryOptions } from "@tanstack/react-query";
import { COUNTRY_CODES, LANGUAGE_CODES } from "./constants";

type RequiredKeys<T, U> = keyof T & keyof U;
type OptionalKeys<T, U> = Exclude<keyof T | keyof U, RequiredKeys<T, U>>;

type CombineExclusiveOptional<T, U> = {
  [K in RequiredKeys<T, U>]: T[K] & U[K];
} & {
  [K in OptionalKeys<T, U>]?: K extends keyof T
    ? T[K]
    : K extends keyof U
    ? U[K]
    : never;
};

export type MediaType = "movie" | "tv";

type MovieTVCombined = CombineExclusiveOptional<Movie, TV>;

export type Media = { media_type: MediaType } & Omit<
  MovieTVCombined,
  "name" | "original_name"
> &
  Required<Pick<MovieTVCombined, "title" | "original_title">>;

type MovieTVDetailsCombined = CombineExclusiveOptional<MovieDetails, TVDetails>;

export type MediaDetails = { media_type: MediaType } & Omit<
  MovieTVDetailsCombined,
  "name" | "original_name"
> &
  Required<Pick<MovieTVDetailsCombined, "title" | "original_title">>;

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
  popularity: number;
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
  original_language: LanguageCode;
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
  created_by: Creator[];
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
  status: string;
  tagline: string;
  type: "Scripted" | "Reality" | "Documentary" | "Talk Show" | "Animation";
  vote_average: number;
  vote_count: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Creator {
  id: number;
  credit_id: string;
  name: string;
  gender: number;
  profile_path: string;
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

export interface NavLinks {
  name: string;
  path: string;
}

export interface TMDBGetMediaAPIResponse<ResultType> {
  page: number;
  total_pages: number;
  total_results: number;
  results: ResultType[];
}

export interface MediaImage {
  aspect_ratio: number;
  height: number;
  iso_639_1: LanguageCode;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface MediaImagesResult {
  backdrops: MediaImage[];
  logos: MediaImage[];
  posters: MediaImage[];
}

export interface MediaCreditsAPIResult {
  id: number;
  cast: Cast[];
  crew: Crew[];
}

// Specific typed enums/unions for clarity
export type SortBy =
  | "popularity.asc"
  | "popularity.desc"
  | "release_date.asc"
  | "release_date.desc"
  | "revenue.asc"
  | "revenue.desc"
  | "primary_release_date.asc"
  | "primary_release_date.desc"
  | "original_title.asc"
  | "original_title.desc"
  | "vote_average.asc"
  | "vote_average.desc"
  | "vote_count.asc"
  | "vote_count.desc"
  | "first_air_date.asc"
  | "first_air_date.desc"
  | "name.asc"
  | "name.desc";

export type TvStatus = 0 | 1 | 2 | 3 | 4 | 5;
export type TvType = 0 | 1 | 2 | 3 | 4;
export type ReleaseType = 1 | 2 | 3 | 4 | 5 | 6; // bitmask - can be combined by bitwise OR if needed

export interface DiscoverQueryParams {
  language?: string;
  sort_by?: SortBy;
  page?: number;
  timezone?: string;
  with_watch_providers?: string;
  watch_region?: string;
  with_genres?: string;
  with_keywords?: string;
  with_origin_country?: string;

  // Numeric filters flattened
  "with_runtime.gte"?: number;
  "with_runtime.lte"?: number;
  "vote_count.gte"?: number;
  "vote_count.lte"?: number;
  "vote_average.gte"?: number;
  "vote_average.lte"?: number;

  // Boolean flags
  include_adult?: boolean;
  include_video?: boolean;
  include_null_first_air_dates?: boolean;
  screened_theatrically?: boolean;

  // Movie-specific date filters
  "primary_release_date.gte"?: string; // YYYY-MM-DD
  "primary_release_date.lte"?: string;
  "release_date.gte"?: string;
  "release_date.lte"?: string;
  with_release_type?: ReleaseType | number; // bitmask supported

  // TV-specific date filters
  "first_air_date.gte"?: string; // YYYY-MM-DD
  "first_air_date.lte"?: string;
  "air_date.gte"?: string;
  "air_date.lte"?: string;

  // TV-specific filters
  with_status?: TvStatus;
  with_type?: TvType;
  with_networks?: string;
}

export interface MediaSection {
  id: string;
  title: string;
  mediaItems: Media[];
}

export interface Episode {
  air_date: string;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  production: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string;
  vote_average: number;
  vote_count: number;
  crew: Crew[];
  guest_stars: Cast[];
}

export interface TVSeasonDetailsAPIResult {
  _id: string;
  air_date: string;
  episodes: Episode[];
  name: string;
  overview: string;
  id: number;
  poster_path: string;
  season_number: number;
  vote_average: number;
}

export type TimeWindow = "day" | "week";

export type TMDBStatusResponse = {
  status_code: number;
  success: boolean;
  status_message: string;
};

export interface TMDBRequestToken extends TMDBStatusResponse {
  request_token: string;
}

export interface TMDBAccessToken extends TMDBStatusResponse {
  access_token: string;
  account_id: string;
}

export interface TMDBSession {
  success: boolean;
  session_id: string;
}

export interface AccountDetails {
  avatar: {
    gravatar: {
      hash: string;
    };
    tmdb: {
      avatar_path: null;
    };
  };
  id: number;
  iso_639_1: LanguageCode;
  iso_3166_1: CountryCode;
  name: string;
  include_adult: boolean;
  username: string;
}

export interface ListDetails {
  average_rating: number;
  backdrop_path: string;
  results: (Movie | TV)[];
  created_by: {
    avatar_path: string;
    gravatar_hash: string;
    id: string;
    name: string;
    username: string;
  };
  description: string;
  id: number;
  iso_3166_1: CountryCode;
  iso_639_1: LanguageCode;
  item_count: number;
  name: string;
  page: number;
  poster_path: string;
  public: true;
  revenue: number;
  runtime: number;
  sort_by: string;
  total_pages: number;
  total_results: number;
  comments: {
    [key: string]: string | null;
  };
}

export interface ListOptions {
  name: string;
  iso_639_1: CountryCode;
  description?: string;
  public?: boolean;
  iso_3166_1?: string;
  sort_by?:
    | "original_order.asc"
    | "original_order.desc"
    | "primary_release_date.asc"
    | "primary_release_date.desc"
    | "title.asc"
    | "title.desc"
    | "vote_average.asc"
    | "vote_average.desc";
}

export interface List {
  account_object_id: string;
  adult: number;
  average_rating: number;
  backdrop_path: string | null;
  created_at: string;
  description: string;
  featured: number;
  id: number;
  iso_3166_1: LanguageCode;
  iso_639_1: CountryCode;
  name: string;
  number_of_items: number;
  poster_path: string | null;
  public: number;
  revenue: number;
  runtime: number;
  sort_by: number;
  updated_at: string;
}

export type AccountLists = TMDBGetMediaAPIResponse<List>;

export interface TMDBCreateListResponse extends TMDBStatusResponse {
  id?: number;
}

export type MediaRef = {
  media_type: MediaType;
  media_id: number;
};

export interface TMDBListItemsResponse extends TMDBStatusResponse {
  results: (MediaRef & { error?: string[]; success: boolean })[];
}

export type TMDBListItemStatusResponse = TMDBStatusResponse &
  MediaRef & { id: number };

export type TMDBListClearItemsResponse = TMDBStatusResponse & {
  id?: number;
  items_deleted?: number;
};
