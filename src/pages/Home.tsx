import HeroSection from "../components/HeroSection";
import MediaItemsRow from "../components/MediaItemsRow";
import { MOVIE_GENRES, TV_SHOWS_GENRES } from "../misc/constants";
import { getDiscoverMediaItems, getTrendingMediaItems } from "../misc/tmdbAPI";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <div className="relative">
        <div className="flex flex-col gap-2 py-6 sm:absolute sm:top-[-200px] sm:pt-6 sm:pb-16">
          <MediaItemsRow
            title="Popular Movies Today"
            fetchMedia={async () => {
              const mediaItems = await getTrendingMediaItems("movie", "day");
              return mediaItems.results;
            }}
          />
          <MediaItemsRow
            title="Series"
            fetchMedia={async () => {
              const mediaItems = await getDiscoverMediaItems("tv", {
                with_genres: TV_SHOWS_GENRES[0].id.toString(),
                sort_by: "popularity.desc",
              });

              return mediaItems.results;
            }}
          />

          <MediaItemsRow
            title="Comedy"
            fetchMedia={async () => {
              const mediaItems = await getDiscoverMediaItems("movie", {
                with_genres: MOVIE_GENRES[3].id.toString(),
                sort_by: "popularity.desc",
              });
              return mediaItems.results;
            }}
          />
          <MediaItemsRow
            title="Horror"
            fetchMedia={async () => {
              const mediaItems = await getDiscoverMediaItems("movie", {
                with_genres: MOVIE_GENRES[3].id.toString(),
                sort_by: "popularity.desc",
              });
              return mediaItems.results;
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
