import { Routes, Route } from "react-router-dom";
import { MediaCreditsAPIResult, MediaDetails } from "../../misc/types";
import MediaPageEpisodesSection from "./MediaPageEpisodesSection";
import MediaPageRecommendations from "./MediaPageRecommendations";
import MediaPageCasts from "./MediaPageCasts";
import RouteErrorBoundary from "../../components/RouteErrorBoundary";

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
          <RouteErrorBoundary key="recommendations">
            <MediaPageRecommendations mediaItemDetails={mediaItemDetails} />
          </RouteErrorBoundary>
        }
      />
      <Route
        path="/casts"
        element={
          <RouteErrorBoundary key="casts">
            <MediaPageCasts mediaItemCredits={mediaItemCredits} />
          </RouteErrorBoundary>
        }
      />
      <Route
        path="/episodes"
        element={
          <RouteErrorBoundary key="episodes">
            <MediaPageEpisodesSection
              mediaId={mediaItemDetails?.id ? mediaItemDetails.id : null}
              seasons={mediaItemDetails?.seasons}
            />
          </RouteErrorBoundary>
        }
      />
    </Routes>
  );
};

export default MediaPageExtras;
