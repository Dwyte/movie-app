import { UseQueryOptions } from "@tanstack/react-query";

import { getTrendingMediaItems, getDiscoverMediaItems } from "./tmdbAPI";
import { MOVIE_GENRES, TV_SHOWS_GENRES } from "./constants";
import { Media, MediaType } from "./types";
import { formatDateString } from "./utils";

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
      queryKey: ["trendingg", "tv", "week"],
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

export const discoveryMovieConfigs: MediaSectionConfig[] = [
  {
    id: "90s-horror-movies",
    title: "Classic '90s Horror Movies",
    mediaType: "movie",
    useQuery: {
      queryKey: ["discovery", "movie", "90s-horror"],
      queryFn: async () => {
        const { results: mediaItems } = await getDiscoverMediaItems("movie", {
          with_genres: MOVIE_GENRES[10].id.toString(),
          "primary_release_date.lte": "2001-01-01",
          with_original_language: "en",
          "primary_release_date.gte": "1990-01-01",
          sort_by: "popularity.desc",
        });
        return mediaItems;
      },
      staleTime: Infinity,
    },
  },
  {
    id: "y2k-action-movies",
    title: "Y2K Action Adventure Movies",
    mediaType: "movie",
    useQuery: {
      queryKey: ["discovery", "movie", "y2k-action-adventure"],
      queryFn: async () => {
        const { results: mediaItems } = await getDiscoverMediaItems("movie", {
          with_genres: [MOVIE_GENRES[0].id, MOVIE_GENRES[1].id].join(","),
          with_original_language: "en",
          "primary_release_date.lte": "2005-12-31",
          "primary_release_date.gte": "1995-01-01",
          sort_by: "popularity.desc",
        });
        return mediaItems;
      },
      staleTime: Infinity,
    },
  },
  {
    id: "2020s-top-scifi-movies",
    title: "Top Sci-fi Movies of the 2020s",
    mediaType: "movie",
    useQuery: {
      queryKey: ["discovery", "movie", "2020s-top-scifi"],
      queryFn: async () => {
        const { results: mediaItems } = await getDiscoverMediaItems("movie", {
          with_original_language: "en",
          with_genres: [MOVIE_GENRES[14].id].join(","),
          sort_by: "vote_count.desc",
          "primary_release_date.lte": "2030-01-01",
          "primary_release_date.gte": "2020-01-01",
        });

        return mediaItems;
      },
      staleTime: Infinity,
    },
  },
  {
    id: "fan-fav-crime-flicks",
    title: "Fan-Favorite Crime Flicks",
    mediaType: "movie",
    useQuery: {
      queryKey: ["discovery", "movie", "fan-fav-crime-flicks"],
      queryFn: async () => {
        const { results: mediaItems } = await getDiscoverMediaItems("movie", {
          with_original_language: "en",
          with_genres: [MOVIE_GENRES[4].id].join(","),
          sort_by: "vote_count.desc",
          "primary_release_date.lte": "2030-01-01",
          "primary_release_date.gte": "2010-01-01",
        });

        return mediaItems;
      },
      staleTime: Infinity,
    },
  },
  {
    id: "family-fav-movies",
    title: "Family Movie Favorites",
    mediaType: "movie",
    useQuery: {
      queryKey: ["discovery", "movie", "family-fav-moves"],
      queryFn: async () => {
        const { results: mediaItems } = await getDiscoverMediaItems("movie", {
          with_original_language: "en",
          with_genres: [MOVIE_GENRES[3].id, MOVIE_GENRES[7].id].join(","),
          sort_by: "vote_count.desc",
          "primary_release_date.lte": "2030-01-01",
          "primary_release_date.gte": "2015-01-01",
        });

        return mediaItems;
      },
      staleTime: Infinity,
    },
  },
  {
    id: "2000s-laughs-love-movies",
    title: "Laughs & Love of 2000s",
    mediaType: "movie",
    useQuery: {
      queryKey: ["discovery", "movie", "2000s-laughs-love"],
      queryFn: async () => {
        const { results: mediaItems } = await getDiscoverMediaItems("movie", {
          with_original_language: "en",
          with_genres: [MOVIE_GENRES[3].id, MOVIE_GENRES[13].id].join(","),
          sort_by: "vote_count.desc",
          "primary_release_date.lte": "2010-01-01",
          "primary_release_date.gte": "2001-01-01",
        });

        return mediaItems;
      },
      staleTime: Infinity,
    },
  },
  {
    id: "pinoy-rom-coms",
    title: "Top Pinoy RomComs",
    mediaType: "movie",
    useQuery: {
      queryKey: ["discovery", "movie", "pinoy-rom-coms"],
      queryFn: async () => {
        const { results: mediaItems } = await getDiscoverMediaItems("movie", {
          with_original_language: "tl",
          with_genres: [MOVIE_GENRES[3].id, MOVIE_GENRES[13].id].join(","),
          sort_by: "vote_count.desc",
        });

        return mediaItems;
      },
      staleTime: Infinity,
    },
  },
  {
    id: "mystery-thriller-movie",
    title: "Suspense & Mystery",
    mediaType: "movie",
    useQuery: {
      queryKey: ["discovery", "movie", "mystery-thriller"],
      queryFn: async () => {
        const { results: mediaItems } = await getDiscoverMediaItems("movie", {
          with_original_language: "en",
          with_genres: [MOVIE_GENRES[12].id, MOVIE_GENRES[16].id].join(","),
          sort_by: "vote_count.desc",
        });

        return mediaItems;
      },
      staleTime: Infinity,
    },
  },
  {
    id: "musical-movie",
    title: "Screen Musicals",
    mediaType: "movie",
    useQuery: {
      queryKey: ["discovery", "movie", "music"],
      queryFn: async () => {
        const { results: mediaItems } = await getDiscoverMediaItems("movie", {
          with_original_language: "en",
          with_genres: [MOVIE_GENRES[11].id].join(","),
          sort_by: "vote_count.desc",
        });

        return mediaItems;
      },
      staleTime: Infinity,
    },
  },
];

export const discoveryTVConfigs: MediaSectionConfig[] = [
  {
    id: "wholesome-comedy-tv",
    title: "Wholesome Comedy Series",
    mediaType: "tv",
    useQuery: {
      queryKey: ["discovery", "tv", "wholesome-comedy"],
      queryFn: async () => {
        const { results: mediaItems } = await getDiscoverMediaItems("tv", {
          with_genres: [
            MOVIE_GENRES[3].id,
            MOVIE_GENRES[2].id,
            MOVIE_GENRES[7].id,
          ].join(","),
          include_null_first_air_dates: false,
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
        const today = new Date();
        const thisYear = new Date();
        thisYear.setFullYear(today.getFullYear(), 0, 1);

        const { results: mediaItems } = await getDiscoverMediaItems("tv", {
          with_genres: TV_SHOWS_GENRES[4].id.toString(),
          "first_air_date.gte": formatDateString(thisYear),
          "first_air_date.lte": formatDateString(today),
          sort_by: "popularity.desc",
        });
        return mediaItems;
      },
      staleTime: Infinity,
    },
  },
  {
    id: "2000s-comedy-tv",
    title: "Retro Comedy Hits",
    mediaType: "tv",
    useQuery: {
      queryKey: ["discovery", "tv", "2000s-laughs-love"],
      queryFn: async () => {
        const { results: mediaItems } = await getDiscoverMediaItems("tv", {
          with_original_language: "en",
          with_genres: [TV_SHOWS_GENRES[2].id].join(","),
          sort_by: "vote_count.desc",
          "first_air_date.lte": "2010-01-01",
          "first_air_date.gte": "2001-01-01",
        });

        return mediaItems;
      },
      staleTime: Infinity,
    },
  },
  {
    id: "top-reality-tv",
    title: "Top Reality TV",
    mediaType: "tv",
    useQuery: {
      queryKey: ["discovery", "tv", "reality"],
      queryFn: async () => {
        const { results: mediaItems } = await getDiscoverMediaItems("tv", {
          with_original_language: "en",
          with_genres: [TV_SHOWS_GENRES[10].id].join(","),
          sort_by: "vote_count.desc",
        });

        return mediaItems;
      },
      staleTime: Infinity,
    },
  },
  {
    id: "animation-kids-tv",
    title: "Kids' Favorites",
    mediaType: "tv",
    useQuery: {
      queryKey: ["discovery", "tv", "animation-kids"],
      queryFn: async () => {
        const { results: mediaItems } = await getDiscoverMediaItems("tv", {
          with_original_language: "en",
          with_genres: [TV_SHOWS_GENRES[1].id, TV_SHOWS_GENRES[7].id].join(","),
          sort_by: "vote_count.desc",
        });

        return mediaItems;
      },
      staleTime: Infinity,
    },
  },
  {
    id: "top-tv-crime",
    title: "Crime on Screen",
    mediaType: "tv",
    useQuery: {
      queryKey: ["discovery", "tv", "crime"],
      queryFn: async () => {
        const { results: mediaItems } = await getDiscoverMediaItems("tv", {
          with_original_language: "en",
          with_genres: [TV_SHOWS_GENRES[3].id].join(","),
          sort_by: "vote_count.desc",
        });

        return mediaItems;
      },
      staleTime: Infinity,
    },
  },
  {
    id: "top-tv-action",
    title: "Epic Adventures Await",
    mediaType: "tv",
    useQuery: {
      queryKey: ["discovery", "tv", "action"],
      queryFn: async () => {
        const { results: mediaItems } = await getDiscoverMediaItems("tv", {
          with_original_language: "en",
          with_genres: [TV_SHOWS_GENRES[0].id].join(","),
          sort_by: "vote_count.desc",
        });

        return mediaItems;
      },
      staleTime: Infinity,
    },
  },
  {
    id: "tv-top-talk-shows",
    title: "Top Talk Shows",
    mediaType: "tv",
    useQuery: {
      queryKey: ["discovery", "tv", "talk"],
      queryFn: async () => {
        const { results: mediaItems } = await getDiscoverMediaItems("tv", {
          with_original_language: "en",
          with_genres: [TV_SHOWS_GENRES[13].id].join(","),
          sort_by: "vote_count.desc",
        });

        return mediaItems;
      },
      staleTime: Infinity,
    },
  },
  {
    id: "tv-western",
    title: "Epic Western Stories",
    mediaType: "tv",
    useQuery: {
      queryKey: ["discovery", "tv", "western"],
      queryFn: async () => {
        const { results: mediaItems } = await getDiscoverMediaItems("tv", {
          with_original_language: "en",
          with_genres: [TV_SHOWS_GENRES[15].id].join(","),
          sort_by: "vote_count.desc",
        });

        return mediaItems;
      },
      staleTime: Infinity,
    },
  },
];
