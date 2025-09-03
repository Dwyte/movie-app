import { Routes, Route } from "react-router-dom";
import { MediaCreditsAPIResult, MediaDetails } from "../../misc/types";
import MediaPageEpisodesSection from "./MediaPageEpisodesSection";
import MediaPageRecommendations from "./MediaPageRecommendations";
import MediaPageCasts from "./MediaPageCasts";

interface Props {
  mediaItemDetails: MediaDetails | null;
  mediaItemCredits: MediaCreditsAPIResult | null;
}

const MediaPageExtras = ({ mediaItemDetails, mediaItemCredits }: Props) => {
  return (
    <Routes>
      <Route
        path=""
        element={
          <MediaPageRecommendations mediaItemDetails={mediaItemDetails} />
        }
      />
      <Route
        path="/casts"
        element={<MediaPageCasts mediaItemCredits={mediaItemCredits} />}
      />
      <Route
        path="/episodes"
        element={
          <MediaPageEpisodesSection
            mediaId={mediaItemDetails?.id ? mediaItemDetails.id : null}
            seasons={mediaItemDetails?.seasons}
          />
        }
      />
    </Routes>
  );
};

export default MediaPageExtras;
