import { useQueries } from "@tanstack/react-query";

import HeroSection from "../components/HeroSection";
import MediaItemsRow from "../components/MediaItemsRow";

import {
  MediaSectionConfig,
  createMediaSectionConfigs,
} from "../misc/mediaSectionConfigs";
import ScrollToTop from "../components/ScrollToTop";
import { useEffect, useState } from "react";
import { MediaType } from "../misc/types";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../components/ErrorFallback";

const Home = ({ mediaType }: { mediaType?: MediaType }) => {
  const [configs, setConfigs] = useState<MediaSectionConfig[]>(() =>
    createMediaSectionConfigs(mediaType)
  );

  const [activeMediaRowCount, setActiveMediaRowCount] = useState(1);

  const activeConfigs = configs.slice(0, activeMediaRowCount);

  const mediaSectionsQueries = useQueries({
    queries: activeConfigs.map((config) => config.useQuery),
    combine: (results) => {
      return results.map((result, index) => {
        return {
          mediaSection: activeConfigs[index],
          useQueryResult: result,
        };
      });
    },
  });

  useEffect(() => {
    document.addEventListener("scroll", () => {
      const { scrollHeight, scrollTop, clientHeight } =
        document.documentElement;

      const tolerance = 2; // Pixels
      if (scrollTop + clientHeight >= scrollHeight - tolerance) {
        console.log(
          "React the bottom of the page, looking for more media lists to display."
        );

        setActiveMediaRowCount((p) => p + 1);
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

      <div className="relative z-20 mx-4 sm:mx-20">
        <div className="max-w-[100%] flex flex-col gap-4 py-6 border-x-1  border-[var(--list-border-color)]">
          {mediaSectionsQueries.map((query, index) => {
            const { mediaSection, useQueryResult } = query;
            const { data: mediaItems, isFetching } = useQueryResult;

            if (mediaItems?.length === 0 && !isFetching) return;
            return (
              <ErrorBoundary
                key={mediaSection.id}
                fallbackRender={(props) => null}
              >
                <MediaItemsRow
                  title={mediaSection.title}
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
