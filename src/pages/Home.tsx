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
import Skeleton from "../components/Skeleton";

const MediaItemsRowSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 pl-4 pb-2 sm:gap-4 sm:pl-12 sm:pb-16 pt-[6px] sm:mt-[-42px]">
      <Skeleton className="h-8 sm:h-9 w-70" />
      <div className="flex gap-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="shrink-0 w-30 h-45 sm:w-66 sm:h-36" />
        ))}
      </div>
    </div>
  );
};

const Home = () => {
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

  useEffect(() => {
    const randomIndex = (length: number) =>
      Math.ceil(Math.random() * length) - 1;

    const trendingMovies =
      trendingMovieConfigs[randomIndex(trendingMovieConfigs.length)];
    const trendingTVShows =
      trendingTVConfigs[randomIndex(trendingTVConfigs.length)];

    setConfigs([
      trendingMovies,
      trendingTVShows,
      ...discoveryMovieConfigs,
      ...discoveryTVConfigs,
    ]);
  }, []);

  useEffect(() => {
    document.addEventListener("scroll", () => {
      const { scrollHeight, scrollTop, clientHeight } =
        document.documentElement;

      const tolerance = 2; // Pixels
      if (scrollTop + clientHeight >= scrollHeight - tolerance) {
        console.log("React the bottom of the page.");
      }
    });
  }, []);

  return (
    <div>
      <ScrollToTop />
      <HeroSection />

      <div className="relative">
        <div className="max-w-[100%] flex flex-col py-6 sm:absolute sm:top-[-175px] sm:pt-6 sm:pb-6 z-2">
          {mediaSectionsQueries.map((query) => {
            const { mediaSection, useQueryResult } = query;
            const { data: mediaItems, isFetching } = useQueryResult;

            if (!mediaItems)
              return <MediaItemsRowSkeleton key={mediaSection.id} />;
            if (mediaItems.length === 0) return;
            return (
              <div key={mediaSection.id} className="sm:mt-[-42px]">
                <MediaItemsRow
                  title={mediaSection.title}
                  mediaItems={mediaItems}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
