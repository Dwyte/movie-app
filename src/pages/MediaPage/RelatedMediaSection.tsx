import React, { useEffect, useState } from "react";
import { Media, MediaDetails } from "../../misc/types";
import { getDiscoverMediaItems } from "../../misc/tmdbAPI";
import MediaCard from "../../components/MediaCard";
import { useLocation } from "react-router-dom";

interface Props {
  mediaItemDetails: MediaDetails;
}

const RelatedMediaSection = ({ mediaItemDetails }: Props) => {
  const [similarMedia, setSimilarMedia] = useState<Media[]>([]);
  const location = useLocation();
  const backgroundLocation = location.state
    ? location.state.backgroundLocation
    : "/";

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!mediaItemDetails) return;

      const newSimilarMediaItems = await getDiscoverMediaItems(
        mediaItemDetails.media_type,
        {
          with_genres: mediaItemDetails.genres
            .map((g) => g.id.toString())
            .join(","),
        }
      );

      // Remove current MediaItem
      const filteredSimilarMediaItems = newSimilarMediaItems.results.filter(
        (mediaItem) => mediaItem.id !== mediaItemDetails.id
      );

      setSimilarMedia(filteredSimilarMediaItems);
    };

    fetchRecommendations();
  }, [mediaItemDetails]);

  return (
    <div className="grid grid-cols-3 gap-3">
      {similarMedia.map((mediaItem) => {
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
