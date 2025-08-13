import { useQueries, useQuery } from "@tanstack/react-query";

import HeroSection from "../components/HeroSection";
import MediaItemsRow from "../components/MediaItemsRow";

import { mediaSectionConfigs } from "../misc/mediaSectionConfigs";
import ScrollToTop from "../components/ScrollToTop";

const Home = () => {
  const mediaSectionsQueries = useQueries({
    queries: mediaSectionConfigs.map((config) => config.useQuery),
    combine: (results) => {
      return results.map((result, index) => {
        return {
          mediaSection: mediaSectionConfigs[index],
          useQueryResult: result,
        };
      });
    },
  });

  return (
    <div>
      <ScrollToTop />
      <HeroSection />
      <div className="relative">
        <div className="max-w-[100%] flex flex-col py-6 sm:absolute sm:top-[-200px] sm:pt-6 sm:pb-6">
          {mediaSectionsQueries.map((query) => {
            const { mediaSection, useQueryResult } = query;
            const { data: mediaItems } = useQueryResult;

            if (!mediaItems) return;
            if (mediaItems.length === 0) return;
            return (
              <div key={mediaSection.id} className="sm:mt-[-50px]">
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
