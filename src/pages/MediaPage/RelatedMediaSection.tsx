import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { MediaDetails } from "../../misc/types";
import { getDiscoverMediaItems } from "../../misc/tmdbAPI";

import MediaCard from "../../components/MediaCard";

interface Props {
  mediaItemDetails: MediaDetails;
}

const RelatedMediaSection = ({ mediaItemDetails }: Props) => {
  const { data: relatedMediaItems } = useQuery({
    queryKey: ["related", mediaItemDetails.media_type, mediaItemDetails.id],
    initialData: [],
    queryFn: async () => {
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
          (mediaItem) => mediaItem.id !== mediaItemDetails.id
        )
      : [];
  }, [relatedMediaItems]);

  return (
    <div className="grid grid-cols-3 gap-3">
      {filteredRelatedMediaItems.map((mediaItem) => {
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
