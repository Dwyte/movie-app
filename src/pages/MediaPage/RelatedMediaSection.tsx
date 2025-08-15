import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { MediaDetails } from "../../misc/types";
import { getDiscoverMediaItems } from "../../misc/tmdbAPI";

import MediaCard from "../../components/MediaCard";
import Skeleton from "../../components/Skeleton";

interface Props {
  mediaItemDetails: MediaDetails | null;
}

const RelatedMediaSection = ({ mediaItemDetails }: Props) => {
  const { data: relatedMediaItems, isFetching } = useQuery({
    enabled: !!mediaItemDetails,
    queryKey: ["related", mediaItemDetails?.media_type, mediaItemDetails?.id],
    initialData: [],
    queryFn: async () => {
      if (!mediaItemDetails) throw Error();

      return (
        await getDiscoverMediaItems(mediaItemDetails.media_type, {
          with_genres: mediaItemDetails.genres
            .map((g) => g.id.toString())
            .join(","),
        })
      ).results;
    },
  });

  const location = useLocation();
  const backgroundLocation = location.state
    ? location.state.backgroundLocation
    : "/";

  // Remove duplicates.
  const filteredRelatedMediaItems = useMemo(() => {
    return relatedMediaItems
      ? relatedMediaItems.filter(
          (mediaItem) => mediaItem.id !== mediaItemDetails?.id
        )
      : [];
  }, [relatedMediaItems]);

  const [doneLoadingCount, setDoneLoadingCount] = useState(0);
  const isLoadingData = !mediaItemDetails || isFetching;
  const isLoadingImages =
    isLoadingData || filteredRelatedMediaItems.length > doneLoadingCount;

  return (
    <div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {isLoadingData &&
          Array.from({ length: 9 }, (_, k) => (
            <Skeleton
              key={k}
              className="aspect-[1/1.5] sm:aspect-[16/9] w-full"
            />
          ))}
        {!isLoadingData &&
          filteredRelatedMediaItems.map((mediaItem) => {
            return (
              <div className="relative" key={mediaItem.id}>
                {isLoadingImages && (
                  <Skeleton className="absolute inset-0 w-full h-full aspect-[16/9] z-1" />
                )}
                <div
                  className={`w-full h-full transition-opacity ${
                    isLoadingImages ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <MediaCard
                    media={mediaItem}
                    sourcePathName={backgroundLocation}
                    onImageLoad={() => setDoneLoadingCount((p) => p + 1)}
                    flexible={true}
                  />
                </div>
              </div>
            );
          })}
      </div>
      {!isLoadingImages && filteredRelatedMediaItems.length === 0 && (
        <div className="text-lg font-bold text-stone-400 text-center w-full py-8">
          No Related Media was found.
        </div>
      )}
    </div>
  );
};

export default RelatedMediaSection;
