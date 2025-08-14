import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

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

  const isLoading = !mediaItemDetails || isFetching;

  return (
    <div className="grid grid-cols-3 gap-3">
      {isLoading &&
        Array.from({ length: 9 }, (_, k) => (
          <Skeleton key={k} className="aspect-[9/16] sm:aspect-[16/9] w-full" />
        ))}
      {!isLoading &&
        filteredRelatedMediaItems.map((mediaItem) => {
          return (
            <div key={mediaItem.id}>
              <MediaCard
                media={mediaItem}
                sourcePathName={backgroundLocation}
                flexible={true}
              />
            </div>
          );
        })}
    </div>
  );
};

export default RelatedMediaSection;
