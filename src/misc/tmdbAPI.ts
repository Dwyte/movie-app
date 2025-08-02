import {
  WatchProvidersAPIResults,
  MediaType,
  TMDBGetMediaAPIResponse,
  MediaImagesResult,
  MediaDetails,
  MediaCreditsAPIResult,
  DiscoverQueryParams,
  Movie,
  TV,
  Media,
  TVSeasonDetailsAPIResult,
} from "./types";
import { normalizeMedia, normalizeMediaDetails } from "./utils";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const normalizedAPIResult = (
  apiResult: TMDBGetMediaAPIResponse<TV | Movie>
) => {
  return {
    ...apiResult,
    results: apiResult.results.map((mediaItem) => normalizeMedia(mediaItem)),
  };
};

export const get = async (url: URL): Promise<any> => {
  const response = await fetch(url, API_OPTIONS);
  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }
  return await response.json();
};

const toSearchParams = (
  params: DiscoverQueryParams
): Record<string, string> => {
  const result: Record<string, string> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    result[key] = value.toString();
  });

  return result;
};
/**
 * Fetch mediaItems from TMDB using filter and sort options.
 * @param mediaType movie or tv
 * @param queryParams - filter option
 * see https://developer.themoviedb.org/reference/discover-movie
 * and https://developer.themoviedb.org/reference/discover-tv
 * @returns
 */
export const getDiscoverMediaItems = async (
  mediaType: MediaType,
  queryParams: DiscoverQueryParams = {}
): Promise<TMDBGetMediaAPIResponse<Media>> => {
  const urlSearchParams = new URLSearchParams(toSearchParams(queryParams));
  const url = new URL(
    `${API_BASE_URL}/discover/${mediaType}?${urlSearchParams.toString()}`
  );

  const response = (await get(url)) as TMDBGetMediaAPIResponse<TV | Movie>;

  return normalizedAPIResult(response);
};

/**
 * Search MediaItems by query
 * @param mediaType movie or tv
 * @param query
 * @returns
 */
export const getSearchMediaItems = async (
  mediaType: MediaType,
  query: string
): Promise<TMDBGetMediaAPIResponse<Media>> => {
  const url = new URL(`${API_BASE_URL}/search/${mediaType}`);
  url.searchParams.append("query", query);

  const response = (await get(url)) as TMDBGetMediaAPIResponse<TV | Movie>;

  return normalizedAPIResult(response);
};

/**
 * Fetch the TrendingItems on TMDB
 * @param mediaType movie or tv
 * @param timeWindow day or week
 * @returns
 */
export const getTrendingMediaItems = async (
  mediaType: MediaType,
  timeWindow: "day" | "week"
): Promise<TMDBGetMediaAPIResponse<Media>> => {
  const url = new URL(`${API_BASE_URL}/trending/${mediaType}/${timeWindow}`);

  const response = (await get(url)) as TMDBGetMediaAPIResponse<TV | Movie>;

  return normalizedAPIResult(response);
};

/**
 * Get available images for MediaItem
 * @param mediaType movie or tv
 * @param mediaItemId
 * @returns
 */
export const getMediaItemImages = async (
  mediaType: MediaType,
  mediaItemId: number
): Promise<MediaImagesResult> => {
  const url = new URL(`${API_BASE_URL}/${mediaType}/${mediaItemId}/images`);

  const response = await get(url);

  return response;
};

/**
 * Fetches full details of MediaItem from the TMDB API
 * @param mediaType movie or tv
 * @param mediaItemId
 * @returns
 */
export const getMediaItemDetails = async (
  mediaType: MediaType,
  mediaItemId: number
): Promise<MediaDetails> => {
  const url = new URL(`${API_BASE_URL}/${mediaType}/${mediaItemId}`);

  const response = await get(url);

  return normalizeMediaDetails(response);
};

/**
 * Get Watch Providers for Media Item
 * @param mediaType movie or tv
 * @param mediaId
 * @returns
 */
export const getMediaItemWatchProviders = async (
  mediaType: MediaType,
  mediaId: number
): Promise<WatchProvidersAPIResults> => {
  const url = new URL(
    `${API_BASE_URL}/${mediaType}/${mediaId}/watch/providers`
  );
  return await get(url);
};

/**
 * Get Credits for Media Item
 * @param mediaType movie or tv
 * @param mediaId
 * @returns
 */
export const getMediaItemCredits = async (
  mediaType: MediaType,
  mediaId: number
): Promise<MediaCreditsAPIResult> => {
  const url = new URL(`${API_BASE_URL}/${mediaType}/${mediaId}/credits`);
  return await get(url);
};

export const getTVSeasonDetails = async (
  tvId: number,
  seasonNumber: number
): Promise<TVSeasonDetailsAPIResult> => {
  const url = new URL(`${API_BASE_URL}/tv/${tvId}/season/${seasonNumber}`);
  return await get(url);
};
