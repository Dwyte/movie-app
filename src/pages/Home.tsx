import HeroSection from "../components/HeroSection";
import MediaItemsRow from "../components/MediaItemsRow";
import { MOVIE_GENRES } from "../misc/constants";
import { getDiscoverMediaItems, getTrendingMediaItems } from "../misc/tmdbAPI";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <div className="relative">
        <div className="flex flex-col gap-2 py-6 sm:absolute sm:top-[-200px] sm:pt-6 sm:pb-16">
          <MediaItemsRow
            title="Popular Today"
            fetchMedia={async () => {
              const mediaItems = await getTrendingMediaItems("movie", "day");
              return mediaItems.results;
            }}
          />
          <MediaItemsRow
            title="Animation"
            fetchMedia={async () => {
              const mediaItems = await getDiscoverMediaItems("movie", [
                MOVIE_GENRES[2],
              ]);
              return mediaItems.results;
            }}
          />

          <MediaItemsRow
            title="Comedy"
            fetchMedia={async () => {
              const mediaItems = await getDiscoverMediaItems("movie", [
                MOVIE_GENRES[3],
              ]);
              return mediaItems.results;
            }}
          />
          <MediaItemsRow
            title="Horror"
            fetchMedia={async () => {
              const mediaItems = await getDiscoverMediaItems("movie", [
                MOVIE_GENRES[10],
              ]);
              return mediaItems.results;
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
