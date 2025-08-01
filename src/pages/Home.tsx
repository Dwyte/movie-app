import { useEffect, useState } from "react";
import HeroSection from "../components/HeroSection";
import MediaItemsRow from "../components/MediaItemsRow";
import { MediaItemsRowProps } from "../components/MediaItemsRow/MediaItemsRow";
import { MOVIE_GENRES, TV_SHOWS_GENRES } from "../misc/constants";
import { getDiscoverMediaItems, getTrendingMediaItems } from "../misc/tmdbAPI";
import { MediaSectionConfig, MediaSection } from "../misc/types";

const mediaSectionConfig: MediaSectionConfig[] = [
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

const Home = () => {
  const [mediaSections, setMediaSections] = useState<MediaSection[]>([]);

  useEffect(() => {
    const fetchMediaSections = async () => {
      const results = await Promise.all(
        mediaSectionConfig.map(async (config) => {
          return {
            id: config.id,
            title: config.title,
            mediaItems: await config.fetchMedia(),
          };
        })
      );

      setMediaSections(results);
    };

    fetchMediaSections();
  }, []);

  return (
    <div>
      <HeroSection />
      <div className="relative">
        <div className="max-w-[100%] flex flex-col py-6 sm:absolute sm:top-[-200px] sm:pt-6 sm:pb-6">
          {mediaSections.map((section) => (
            <div className="mt-[-50px]">
              <MediaItemsRow
                key={section.id}
                title={section.title}
                mediaItems={section.mediaItems}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
