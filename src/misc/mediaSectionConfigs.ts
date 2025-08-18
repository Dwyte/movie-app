import { UseQueryOptions } from "@tanstack/react-query";

import { getTrendingMediaItems, getDiscoverMediaItems } from "./tmdbAPI";
import { MOVIE_GENRES, TV_SHOWS_GENRES } from "./constants";
import { Media, MediaType } from "./types";

export interface MediaSectionConfig {
  id: string;
  mediaType: MediaType;
  title: string;
  useQuery: UseQueryOptions<Media[]>;
}

export const trendingTVConfigs: MediaSectionConfig[] = [
  {
    id: "trending-tv-day",
    title: "Today's Must Watch Series",
    mediaType: "tv",
    useQuery: {
      queryKey: ["trending", "tv", "day"],
      queryFn: async () => {
        const { results: mediaItems } = await getTrendingMediaItems(
          "tv",
          "day"
        );
        return mediaItems;
      },
      staleTime: Infinity,
    },
  },
  {
    id: "trending-tv-week",
    title: "Can't Miss Series Of The Week",
    mediaType: "tv",
    useQuery: {
      queryKey: ["trending", "tv", "week"],
      queryFn: async () => {
        const { results: mediaItems } = await getTrendingMediaItems(
          "tv",
          "week"
        );
        return mediaItems;
      },
      staleTime: Infinity,
    },
  },
];

export const trendingMovieConfigs: MediaSectionConfig[] = [
  {
    id: "trending-movies-day",
    title: "Popular Movies Today",
    mediaType: "movie",
    useQuery: {
      queryKey: ["trending", "movie", "day"],
      queryFn: async () => {
        const { results: mediaItems } = await getTrendingMediaItems(
          "movie",
          "day"
        );
        return mediaItems;
      },
      staleTime: Infinity,
    },
  },
  {
    id: "trending-tv-movie",
    title: "Weekly Box Office Hits",
    mediaType: "movie",
    useQuery: {
      queryKey: ["trending", "tv", "movie"],
      queryFn: async () => {
        const { results: mediaItems } = await getTrendingMediaItems(
          "movie",
          "week"
        );
        return mediaItems;
      },
      staleTime: Infinity,
    },
  },
];

export const mediaSectionConfigs: MediaSectionConfig[] = [
  {
    id: "wholesome-comedy-tv",
    title: "Wholesome Comedy Series",
    mediaType: "tv",
    useQuery: {
      queryKey: ["discovery", "tv", "wholesome-comedy"],
      queryFn: async () => {
        const { results: mediaItems } = await getDiscoverMediaItems("tv", {
          with_genres: [MOVIE_GENRES[3], MOVIE_GENRES[2], MOVIE_GENRES[7]]
            .map((g) => g.id.toString())
            .join(","),
          include_null_first_air_dates: false,
          sort_by: "popularity.desc",
        });
        return mediaItems;
      },
      staleTime: Infinity,
    },
  },
  {
    id: "90s-horror-movies",
    title: "Classic '90s Horror Movies",
    mediaType: "movie",
    useQuery: {
      queryKey: ["discovery", "movie", "classic-horror"],
      queryFn: async () => {
        const { results: mediaItems } = await getDiscoverMediaItems("movie", {
          with_genres: MOVIE_GENRES[10].id.toString(),
          "release_date.lte": "2001-01-01",
          "release_date.gte": "1990-01-01",
          sort_by: "popularity.desc",
        });
        return mediaItems;
      },
      staleTime: Infinity,
    },
  },
  {
    id: "this_year-tv-documentaries",
    title: "Newly Released Documentaries",
    mediaType: "tv",
    useQuery: {
      queryKey: ["discovery", "tv", "this-year-documentaries"],
      queryFn: async () => {
        const { results: mediaItems } = await getDiscoverMediaItems("tv", {
          with_genres: TV_SHOWS_GENRES[4].id.toString(),
          "first_air_date.gte": "2025-01-01",
          "first_air_date.lte": "2025-08-01",
          sort_by: "popularity.desc",
        });
        return mediaItems;
      },
      staleTime: Infinity,
    },
  },
];
