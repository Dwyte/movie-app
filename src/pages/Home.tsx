import { useQueries } from "@tanstack/react-query";

import HeroSection from "../components/HeroSection";
import MediaItemsRow from "../components/MediaItemsRow";

import {
  MediaSectionConfig,
  discoveryMovieConfigs,
  discoveryTVConfigs,
  trendingTVConfigs,
  trendingMovieConfigs,
} from "../misc/mediaSectionConfigs";
import ScrollToTop from "../components/ScrollToTop";
import { useEffect, useState } from "react";
import { MediaType } from "../misc/types";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../components/ErrorFallback";

const discoveryMediaConfigs = [...discoveryMovieConfigs, ...discoveryTVConfigs];
const randomIndex = (length: number) => Math.ceil(Math.random() * length) - 1;

const discoveryConfigs = {
  tv: discoveryTVConfigs,
  movie: discoveryMovieConfigs,
};

const trendingConfigs = {
  tv: trendingTVConfigs,
  movie: trendingMovieConfigs,
};

const Home = ({ mediaType }: { mediaType?: MediaType }) => {
  const [configs, setConfigs] = useState<MediaSectionConfig[]>([]);

  const mediaSectionsQueries = useQueries({
    queries: configs.map((config) => config.useQuery),
    combine: (results) => {
      return results.map((result, index) => {
        return {
          mediaSection: configs[index],
          useQueryResult: result,
        };
      });
    },
  });

  const pickNewMediaSection = () => {
    setConfigs((p) => {
      const configsPool = !!mediaType
        ? discoveryConfigs[mediaType]
        : discoveryMediaConfigs;

      const unpickedConfigs = configsPool.filter(
        (mediaConfig) => !p.find((config) => config.id === mediaConfig.id)
      );

      if (unpickedConfigs.length) {
        const newConfig = unpickedConfigs[randomIndex(unpickedConfigs.length)];
        return [...p, newConfig];
      } else {
        console.log(
          "You've reached the end of the page. No More Media Section Configs Available."
        );
      }
      return p;
    });
  };

  useEffect(() => {
    let initialMediaSections: MediaSectionConfig[] = [];

    if (mediaType) {
      const discoveryConfigsPool = discoveryConfigs[mediaType];
      const trendingConfigsPool = trendingConfigs[mediaType];

      const firstIndex = randomIndex(discoveryConfigsPool.length);
      let secondIndex = randomIndex(discoveryConfigsPool.length);
      while (firstIndex === secondIndex) {
        secondIndex = randomIndex(discoveryConfigsPool.length);
      }

      initialMediaSections = [
        trendingConfigsPool[randomIndex(trendingConfigsPool.length)],
        discoveryConfigsPool[firstIndex],
        discoveryConfigsPool[secondIndex],
      ];
    } else {
      const trendingMovies =
        trendingMovieConfigs[randomIndex(trendingMovieConfigs.length)];
      const trendingTVShows =
        trendingTVConfigs[randomIndex(trendingTVConfigs.length)];

      initialMediaSections = [
        trendingMovies,
        trendingTVShows,
        discoveryMovieConfigs[randomIndex(discoveryMovieConfigs.length)],
        discoveryTVConfigs[randomIndex(discoveryTVConfigs.length)],
      ];
    }

    setConfigs(initialMediaSections);
  }, []);

  useEffect(() => {
    document.addEventListener("scroll", () => {
      const { scrollHeight, scrollTop, clientHeight } =
        document.documentElement;

      const tolerance = 2; // Pixels
      if (scrollTop + clientHeight >= scrollHeight - tolerance) {
        console.log(
          "React the bottom of the page, looking for more media lists to display."
        );
        pickNewMediaSection();
      }
    });
  }, []);

  return (
    <div>
      <ScrollToTop />
      {/* If there's no mediaType we randomly choose between movie or tv type to show in Hero */}
      <ErrorBoundary
        fallbackRender={(props) => (
          <ErrorFallback
            className="h-150 sm:h-[100vh]"
            {...props}
            displayMessage
          />
        )}
      >
        <HeroSection
          mediaType={
            mediaType ? mediaType : Math.random() >= 0.5 ? "movie" : "tv"
          }
        />
      </ErrorBoundary>

      <div className="relative z-20">
        <div className="max-w-[100%] flex flex-col py-6 sm:absolute sm:top-[-175px] sm:pt-6 sm:pb-6">
          {mediaSectionsQueries.map((query, index) => {
            const { mediaSection, useQueryResult } = query;
            const { data: mediaItems, isFetching } = useQueryResult;

            if (mediaItems?.length === 0 && !isFetching) return;
            return (
              <ErrorBoundary fallbackRender={(props) => null}>
                <MediaItemsRow
                  style={{ position: "relative", zIndex: 1000 - index }}
                  title={mediaSection.title}
                  key={mediaSection.id}
                  className="sm:mt-[-42px]"
                  mediaItems={mediaItems}
                />
              </ErrorBoundary>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
