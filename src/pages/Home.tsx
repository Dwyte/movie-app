import HeroSection from "../components/HeroSection";
import MediaItemsRow from "../components/MediaItemsRow";
import { MediaItemsRowProps } from "../components/MediaItemsRow/MediaItemsRow";
import { MOVIE_GENRES, TV_SHOWS_GENRES } from "../misc/constants";
import { getDiscoverMediaItems, getTrendingMediaItems } from "../misc/tmdbAPI";

const mediaItemsRows: MediaItemsRowProps[] = [
  {
    title: "Popular Movies Today",
    fetchMedia: async () => {
      const mediaItems = await getTrendingMediaItems("movie", "day");
      return mediaItems.results;
    },
  },
  {
    title: "Top Series of the Week",
    fetchMedia: async () => {
      return (await getTrendingMediaItems("tv", "week")).results;
    },
  },
  {
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
  return (
    <div>
      <HeroSection />
      <div className="relative">
        <div className="max-w-[100%] flex flex-col py-6 sm:absolute sm:top-[-200px] sm:pt-6 sm:pb-6">
          {mediaItemsRows.map((mediaItemRowProps) => (
            <div className="mt-[-50px]">
              <MediaItemsRow
                key={mediaItemRowProps.title}
                {...mediaItemRowProps}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
