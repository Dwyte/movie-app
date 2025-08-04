import { getTrendingMediaItems, getDiscoverMediaItems } from "./tmdbAPI";
import { MediaSectionConfig } from "./types";
import { MOVIE_GENRES } from "./constants";

export const mediaSectionConfig: MediaSectionConfig[] = [
  {
    id: "trending-movies-today",
    title: "Popular Movies Today",
    fetchMedia: async () => {
      const mediaItems = await getTrendingMediaItems("movie", "day");
      return mediaItems.results;
    },
  },
  {
    id: "trending-tv-weekly",
    title: "Top Series of the Week",
    fetchMedia: async () => {
      return (await getTrendingMediaItems("tv", "week")).results;
    },
  },
  {
    id: "wholesome-comedy-tv",
    title: "Wholesome Comedy Series",
    fetchMedia: async () => {
      return (
        await getDiscoverMediaItems("tv", {
          with_genres: [MOVIE_GENRES[3], MOVIE_GENRES[2], MOVIE_GENRES[7]]
            .map((g) => g.id.toString())
            .join(","),
          include_null_first_air_dates: false,
          sort_by: "popularity.desc",
        })
      ).results;
    },
  },
  {
    id: "90s-horror-movies",
    title: "Classic '90s Horror Movies",
    fetchMedia: async () => {
      return (
        await getDiscoverMediaItems("movie", {
          with_genres: MOVIE_GENRES[10].id.toString(),
          "release_date.lte": "2001-01-01",
          "release_date.gte": "1990-01-01",
          sort_by: "popularity.desc",
        })
      ).results;
    },
  },
  {
    id: "this_year-tv-documentaries",
    title: "Newly Released Documentaries",
    fetchMedia: async () => {
      return (
        await getDiscoverMediaItems("tv", {
          with_genres: MOVIE_GENRES[5].id.toString(),
          "first_air_date.gte": "2025-01-01",
          "first_air_date.lte": "2025-08-01",
          sort_by: "popularity.desc",
        })
      ).results;
    },
  },
];