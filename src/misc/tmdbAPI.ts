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
  TimeWindow,
  TMDBSession,
  TMDBAccessToken,
  TMDBRequestToken,
  AccountDetails,
  ListOptions,
  AccountLists,
  LanguageCode,
  ListDetails,
  TMDBCreateListResponse,
  MediaRef,
  TMDBListItemsResponse,
  TMDBListItemStatusResponse,
  TMDBStatusResponse,
  TMDBListClearItemsResponse,
} from "./types";
import { normalizeMedia, normalizeMediaDetails } from "./utils";

const API_BASE_URL_V3 = "https://api.themoviedb.org/3";
const API_BASE_URL_V4 = "https://api.themoviedb.org/4";
const API_KEY_V4 = import.meta.env.VITE_TMDB_API_KEY_V4;
const API_KEY_V3 = import.meta.env.VITE_TMDB_API_KEY_V3;

const HEADERS: Record<string, string> = {
  accept: "application/json",
  "Content-Type": "application/json",
};

const normalizedAPIResult = (
  apiResult: TMDBGetMediaAPIResponse<TV | Movie>
) => {
  return {
    ...apiResult,
    results: apiResult.results.map((mediaItem) => normalizeMedia(mediaItem)),
  };
};

const get = async (url: URL, accessToken?: string): Promise<any> => {
  url.searchParams.append("api_key", API_KEY_V3);

  const headers = HEADERS;
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(url, { method: "GET", headers });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}`);
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
    `${API_BASE_URL_V3}/discover/${mediaType}?${urlSearchParams.toString()}`
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
  const url = new URL(`${API_BASE_URL_V3}/search/${mediaType}`);
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
  timeWindow: TimeWindow
): Promise<TMDBGetMediaAPIResponse<Media>> => {
  const url = new URL(`${API_BASE_URL_V3}/trending/${mediaType}/${timeWindow}`);

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
  const url = new URL(`${API_BASE_URL_V3}/${mediaType}/${mediaItemId}/images`);

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
  const url = new URL(`${API_BASE_URL_V3}/${mediaType}/${mediaItemId}`);

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
    `${API_BASE_URL_V3}/${mediaType}/${mediaId}/watch/providers`
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
  const url = new URL(`${API_BASE_URL_V3}/${mediaType}/${mediaId}/credits`);
  return await get(url);
};

export const getTVSeasonDetails = async (
  tvId: number,
  seasonNumber: number
): Promise<TVSeasonDetailsAPIResult> => {
  const url = new URL(`${API_BASE_URL_V3}/tv/${tvId}/season/${seasonNumber}`);
  return await get(url);
};

export const getCreateGuestSession = async () => {
  const url = new URL(`${API_BASE_URL_V3}/authentication/guest_session/new`);
  return await get(url);
};

/**
 * This is the step #3 from tmdb user authentication page.
 * @returns
 */
export const postCreateAccessToken = async (
  requestToken: string
): Promise<TMDBAccessToken> => {
  const url = new URL(`${API_BASE_URL_V4}/auth/access_token`);
  const response = await fetch(url, {
    method: "POST",
    headers: { ...HEADERS, Authorization: `Bearer ${API_KEY_V4}` },
    body: JSON.stringify({ request_token: requestToken }),
  });
  return await response.json();
};

/**
 * This is the step #1 from tmdb user authentication page.
 * @returns
 */
export const postCreateRequestToken = async (): Promise<TMDBRequestToken> => {
  const url = new URL(`${API_BASE_URL_V4}/auth/request_token`);
  const response = await fetch(url, {
    method: "POST",
    headers: { ...HEADERS, Authorization: `Bearer ${API_KEY_V4}` },
  });
  return await response.json();
};

export const deleteLogoutAccessToken = async (accessToken: string) => {
  const url = new URL(`${API_BASE_URL_V4}/auth/access_token`);
  const response = await fetch(url, {
    method: "DELETE",
    body: JSON.stringify({ access_token: accessToken }),
    headers: { ...HEADERS, Authorization: `Bearer ${accessToken}` },
  });
  return await response.json();
};

export const deleteLogoutSession = async (sessionId: string) => {
  const url = new URL(`${API_BASE_URL_V3}/authentication/session`);
  const response = await fetch(url, {
    method: "DELETE",
    body: JSON.stringify({ session_id: sessionId }),
    headers: HEADERS,
  });
  return await response.json();
};

export const postCreateSessionFromV4Token = async (
  accessToken: string
): Promise<TMDBSession> => {
  const url = new URL(`${API_BASE_URL_V3}/authentication/session/convert/4`);
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({ access_token: accessToken }),
    headers: { ...HEADERS, Authorization: `Bearer ${accessToken}` },
  });

  return await response.json();
};

export const getAccountDetails = async (
  accountId: string,
  sessionId: string
): Promise<AccountDetails> => {
  const url = new URL(`${API_BASE_URL_V3}/account/${accountId}`);
  url.searchParams.append("session_id", sessionId);
  return await get(url);
};

export const postCreateList = async (
  accessToken: string,
  options: ListOptions
): Promise<TMDBCreateListResponse> => {
  const url = new URL(`${API_BASE_URL_V4}/list`);
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(options),
    headers: { ...HEADERS, Authorization: `Bearer ${accessToken}` },
  });

  return await response.json();
};

export const getAccountLists = async (
  accessToken: string,
  accountId: string,
  page?: number
): Promise<AccountLists> => {
  const url = new URL(`${API_BASE_URL_V4}/account/${accountId}/lists`);
  if (page) url.searchParams.append("page", encodeURIComponent(page));
  return await get(url, accessToken);
};

export const getListDetails = async (
  listId: number,
  accessToken?: string,
  page: number = 1,
  language: LanguageCode = "en"
): Promise<ListDetails> => {
  const url = new URL(`${API_BASE_URL_V4}/list/${listId}`);
  url.searchParams.append("page", encodeURIComponent(page));
  url.searchParams.append("language", encodeURIComponent(language));

  const listDetails = await get(url, accessToken);

  const normalizedResults = listDetails.results.map((media: TV | Movie) =>
    normalizeMedia(media)
  );

  listDetails.results = normalizedResults;

  return listDetails;
};

export const postListAddItems = async (
  accessToken: string,
  listId: number,
  items: MediaRef[]
): Promise<TMDBListItemsResponse> => {
  const url = new URL(`${API_BASE_URL_V4}/list/${listId}/items`);

  const response = await fetch(url, {
    method: "POST",
    headers: { ...HEADERS, Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ items }),
  });

  return await response.json();
};

export const deleteListItems = async (
  accessToken: string,
  listId: number,
  items: MediaRef[]
): Promise<TMDBListItemsResponse> => {
  const url = new URL(`${API_BASE_URL_V4}/list/${listId}/items`);

  const response = await fetch(url, {
    method: "DELETE",
    headers: { ...HEADERS, Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ items }),
  });

  return await response.json();
};

export const getListItemStatus = async (
  accessToken: string,
  listId: number,
  item: MediaRef
): Promise<TMDBListItemStatusResponse> => {
  const url = new URL(`${API_BASE_URL_V4}/list/${listId}/items_status`);
  url.searchParams.append("media_id", encodeURIComponent(item.media_id));
  url.searchParams.append("media_type", encodeURIComponent(item.media_type));

  return await get(url, accessToken);
};

export const deleteList = async (
  accessToken: string,
  listId: number
): Promise<TMDBStatusResponse> => {
  const url = new URL(`${API_BASE_URL_V4}/list/${listId}`);

  const response = await fetch(url, {
    method: "DELETE",
    headers: { ...HEADERS, Authorization: `Bearer ${accessToken}` },
  });

  return await response.json();
};

export const getListClearItems = async (
  accessToken: string,
  listId: number
): Promise<TMDBListClearItemsResponse> => {
  const url = new URL(`${API_BASE_URL_V4}/list/${listId}/clear`);

  return await get(url, accessToken);
};

export const putUpdateList = async (
  accessToken: string,
  listId: number,
  options: Partial<ListOptions>
): Promise<TMDBStatusResponse> => {
  const url = new URL(`${API_BASE_URL_V4}/list/${listId}`);
  const response = await fetch(url, {
    method: "PUT",
    body: JSON.stringify(options),
    headers: { ...HEADERS, Authorization: `Bearer ${accessToken}` },
  });

  return await response.json();
};

export const putUpdateListItem = async (
  accessToken: string,
  listId: number,
  item: MediaRef,
  comment: string
): Promise<TMDBListItemsResponse> => {
  const url = new URL(`${API_BASE_URL_V4}/list/${listId}/items`);

  const response = await fetch(url, {
    method: "PUT",
    body: JSON.stringify({ items: [{ ...item, comment }] }),
    headers: { ...HEADERS, Authorization: `Bearer ${accessToken}` },
  });

  return await response.json();
};
