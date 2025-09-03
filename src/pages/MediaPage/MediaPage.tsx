import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getMediaItemCredits,
  getMediaItemDetails,
  getMediaVideos,
} from "../../misc/tmdbAPI";
import { MediaType, TrailerState } from "../../misc/types";

import { useMediaQueries } from "../../contexts/MediaQueriesContext";
import DisableBodyScroll from "../../components/DisableBodyScroll";
import Skeleton from "../../components/Skeleton";

import { useFocusTrap } from "../../hooks/useFocusTrap";

import MediaPageMobileButtons from "./MediaPageMobileButtons";
import MediaPageExtrasNav from "./MediaPageExtrasNav";
import MediaPageDetails from "./MediaPageDetails";
import MediaPageExtras from "./MediaPageExtras";
import MediaPageHero from "./MediaPageHero";

interface Props {
  mediaType: MediaType;
}

const MediaPage = ({ mediaType }: Props) => {
  const contentDivRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isSmUp } = useMediaQueries();
  const params = useParams();
  const mediaId = params.mediaId ? parseInt(params.mediaId) : null;
  const backgroundLocation = location.state
    ? location.state.backgroundLocation
    : "/";

  const showTrailerOnLoad = location.state
    ? location.state.showTrailerOnLoad
    : false;

  const [trailerState, setTrailerState] = useState<TrailerState>("AVAILABLE");

  // Focus trap for the modal
  const { focusFirstElement, initializeFocusTrap } = useFocusTrap();

  const { data: mediaItemDetails } = useQuery({
    enabled: mediaId !== null,
    queryKey: [mediaType, mediaId, "details"],
    initialData: null,
    queryFn: ({ queryKey }) => {
      const [mediaType, mediaId, _] = queryKey as [MediaType, number, string];
      return getMediaItemDetails(mediaType, mediaId);
    },
  });

  const { data: mediaItemCredits } = useQuery({
    enabled: mediaId !== null,
    queryKey: [mediaType, mediaId, "credits"],
    initialData: null,
    queryFn: ({ queryKey }) => {
      const [mediaType, mediaId, _] = queryKey as [MediaType, number, string];
      return getMediaItemCredits(mediaType, mediaId);
    },
  });

  const { data: mediaItemTrailer } = useQuery({
    queryKey: [mediaType, mediaId, "trailer"],
    queryFn: async ({ queryKey }) => {
      const [mediaType, mediaId, _] = queryKey as [MediaType, number, string];
      const response = await getMediaVideos(mediaType, mediaId);

      const trailer = response.results.find((v) => {
        const isYoutube = v.site === "YouTube";
        const isTrailer = v.type === "Trailer";

        return isYoutube && isTrailer && v.official;
      });

      return trailer ? trailer : null;
    },
    staleTime: Infinity,
  });

  useEffect(() => {
    if (mediaItemTrailer === undefined) {
      setTrailerState("FETCHING");
    } else if (mediaItemTrailer === null) {
      setTrailerState("UNAVAILABLE");
    } else {
      setTrailerState(showTrailerOnLoad ? "PLAYING" : "AVAILABLE");
    }
  }, [mediaItemTrailer]);

  // Scroll to the Top when selecting a new Media to view from related media section.
  useEffect(() => {
    const resetScroll = () => {
      if (!contentDivRef) return;

      contentDivRef.current?.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    };

    resetScroll();
  }, [mediaItemDetails?.id]);

  function closeModal() {
    navigate(backgroundLocation);
  }

  /** On desktop, h1 Title is at MediaPageHeroSection. */
  const h1MediaTitleMobile = useMemo(() => {
    if (isSmUp) return;

    return mediaItemDetails ? (
      <h1 className="font-bold text-2xl sm:hidden">{mediaItemDetails.title}</h1>
    ) : (
      <Skeleton className="h-8 w-[75%]" />
    );
  }, [isSmUp, mediaItemDetails]);

  const refCallback = useCallback((node: HTMLDivElement | null) => {
    contentDivRef.current = node;

    if (node instanceof HTMLDivElement) {
      initializeFocusTrap(node, closeModal);
      focusFirstElement(node);
    }
  }, []);

  return (
    <div
      onMouseDown={closeModal}
      className="flex flex-col items-center text-white z-50 modal-backdrop fade-in"
    >
      <DisableBodyScroll />
      <div
        ref={refCallback}
        onMouseDown={(e) => e.stopPropagation()}
        className="flex-1 w-full pb-10 sm:w-220 sm:mt-8 sm:rounded-t-sm scrollable bg-[var(--media-page-bg)]"
      >
        <MediaPageHero
          mediaItemDetails={mediaItemDetails}
          mediaItemTrailer={mediaItemTrailer}
          trailerState={trailerState}
          onPlayTrailer={() => setTrailerState("PLAYING")}
          onExitTrailer={() => setTrailerState("AVAILABLE")}
          onClose={closeModal}
        />
        <div className="flex flex-col gap-2 p-4 sm:px-10 sm:py-8 sm:gap-8">
          {h1MediaTitleMobile}

          <MediaPageDetails
            mediaItemDetails={mediaItemDetails}
            mediaItemCredits={mediaItemCredits}
            trailerState={trailerState}
            onPlayTrailer={() => setTrailerState("PLAYING")}
            onExitTrailer={() => setTrailerState("AVAILABLE")}
          />

          {/* For Mobile */}
          {!isSmUp && (
            <MediaPageMobileButtons mediaItemDetails={mediaItemDetails} />
          )}

          <div>
            <MediaPageExtrasNav
              mediaItemDetails={mediaItemDetails}
              backgroundLocation={backgroundLocation}
            />
            <MediaPageExtras
              mediaItemCredits={mediaItemCredits}
              mediaItemDetails={mediaItemDetails}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaPage;
