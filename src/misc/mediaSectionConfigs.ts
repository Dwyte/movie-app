import { UseQueryOptions } from "@tanstack/react-query";

import { getTrendingMediaItems, getDiscoverMediaItems } from "./tmdbAPI";
import { MOVIE_GENRES } from "./constants";
import { Media, MediaType } from "./types";

interface MediaSectionConfig {
  id: string;
  mediaType: MediaType;
  title: string;
  useQuery: UseQueryOptions<Media[]>;
}

export const mediaSectionConfigs: MediaSectionConfig[] = [
  {
    id: "trending-movies-today",
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
    id: "trending-tv-weekly",
    title: "Top Series of the Week",
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
          with_genres: MOVIE_GENRES[5].id.toString(),
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
