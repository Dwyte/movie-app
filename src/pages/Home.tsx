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

const discoveryMediaConfigs = [...discoveryMovieConfigs, ...discoveryTVConfigs];
const randomIndex = (length: number) => Math.ceil(Math.random() * length) - 1;

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

  const pickNewMediaSection = () => {
    setConfigs((p) => {
      const unpickedConfigs = discoveryMediaConfigs.filter(
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
    const trendingMovies =
      trendingMovieConfigs[randomIndex(trendingMovieConfigs.length)];
    const trendingTVShows =
      trendingTVConfigs[randomIndex(trendingTVConfigs.length)];

    setConfigs([
      trendingMovies,
      trendingTVShows,
      discoveryMovieConfigs[randomIndex(discoveryMovieConfigs.length)],
      discoveryTVConfigs[randomIndex(discoveryTVConfigs.length)],
    ]);
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
      <HeroSection />

      <div className="relative">
        <div className="max-w-[100%] flex flex-col py-6 sm:absolute sm:top-[-175px] sm:pt-6 sm:pb-6 z-2">
          {mediaSectionsQueries.map((query) => {
            const { mediaSection, useQueryResult } = query;
            const { data: mediaItems, isFetching } = useQueryResult;

            if (mediaItems?.length === 0 && !isFetching) return;
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
