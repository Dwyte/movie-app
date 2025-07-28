import { countryCodes, languageCodes } from "./constants";

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

export interface MovieDetails {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: string;
  budget: number;
  genres: MovieGenre[];
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

export type CountryCode = (typeof countryCodes)[number];

export type LanguageCode = (typeof languageCodes)[number];

export type Cast = {
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
};

export type Crew = {
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
};

export type MovieCreditsAPIResult = {
  id: number;
  cast: Cast[];
  crew: Crew[];
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
  iso_639_1: LanguageCode;
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
