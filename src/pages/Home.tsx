import { useQuery } from "@tanstack/react-query";

import HeroSection from "../components/HeroSection";
import MediaItemsRow from "../components/MediaItemsRow";

import { mediaSectionConfig } from "../misc/mediaSectionConfig";
import { MediaSection } from "../misc/types";

const queryFn = async () => {
  const results = await Promise.all(
    mediaSectionConfig.map(async (config) => {
      return {
        id: config.id,
        title: config.title,
        mediaItems: await config.fetchMedia(),
      };
    })
  );

  return results;
};

const Home = () => {
  const { data: mediaSections } = useQuery<MediaSection[]>({
    queryKey: ["home"],
    queryFn,
  });

  if (!mediaSections) return;

  return (
    <div>
      <HeroSection />
      <div className="relative">
        <div className="max-w-[100%] flex flex-col py-6 sm:absolute sm:top-[-200px] sm:pt-6 sm:pb-6">
          {mediaSections.map((section) => (
            <div key={section.id} className="sm:mt-[-50px]">
              <MediaItemsRow
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
