import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import {
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { BsPlusLg, BsSend, BsStar } from "react-icons/bs";

import { getMediaItemCredits, getMediaItemDetails } from "../../misc/tmdbAPI";
import { MEDIA_PAGE_NAV_LINKS } from "../../misc/constants";
import { MediaType } from "../../misc/types";

import RelatedMediaSection from "./RelatedMediaSection";
import MediaPageHeroSection from "./MediaPageHeroSection";
import MediaPageDetailsSection from "./MediaPageDetailsSection";
import MediaPageCastsSection from "./MediaPageCastsSection";
import MediaPageEpisodesSection from "./MediaPageEpisodesSection";
import { useAddListModal } from "../../contexts/AddListModalContext";
import DisableBodyScroll from "../../components/DisableBodyScroll";
import Skeleton from "../../components/Skeleton";
import { useMediaQueries } from "../../contexts/MediaQueriesContext";

interface Props {
  mediaType: MediaType;
}

const MediaExtrasNavSkeleton = () => {
  return (
    <div className="flex gap-2 mb-4">
      <Skeleton className="h-10 w-34" />
      <Skeleton className="h-10 w-34" />
    </div>
  );
};

const MobileButtonsSkeleton = () => {
  return (
    <div className="flex gap-2 h-14 sm:hidden">
      <Skeleton className="aspect-[1.4/1] h-full" />
      <Skeleton className="aspect-[1.4/1] h-full" />
      <Skeleton className="aspect-[1.4/1] h-full" />
    </div>
  );
};

const MediaPage = ({ mediaType }: Props) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isSmUp } = useMediaQueries();
  const params = useParams();
  const mediaId = params.mediaId ? parseInt(params.mediaId) : null;
  const backgroundLocation = location.state
    ? location.state.backgroundLocation
    : "/";

  const { showAddListModal } = useAddListModal();

  const { data: mediaItemDetails } = useQuery({
    queryKey: [mediaType, mediaId, "details"],
    initialData: null,
    queryFn: ({ queryKey }) => {
      const [mediaType, mediaId, _] = queryKey as [MediaType, number, string];
      return getMediaItemDetails(mediaType, mediaId);
    },
  });

  const { data: mediaItemCredits } = useQuery({
    queryKey: [mediaType, mediaId, "credits"],
    initialData: null,
    queryFn: ({ queryKey }) => {
      const [mediaType, mediaId, _] = queryKey as [MediaType, number, string];
      return getMediaItemCredits(mediaType, mediaId);
    },
  });

  // Scroll to the Top when selecting a new Media to view from related media section.
  useEffect(() => {
    const resetScroll = () => {
      if (!modalRef) return;

      modalRef.current?.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    };

    resetScroll();
  }, [mediaItemDetails?.id]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const closeModal = () => {
    navigate(backgroundLocation);
  };

  /** On desktop, h1 Title is at MediaPageHeroSection. */
  const renderH1MediaTitle = () => {
    if (isSmUp) return;

    return mediaItemDetails ? (
      <h1 className="font-bold text-2xl sm:hidden">{mediaItemDetails.title}</h1>
    ) : (
      <Skeleton className="h-8 w-[75%]" />
    );
  };

  return (
    <div
      onMouseDown={closeModal}
      className="flex flex-col items-center text-white z-10000 modal-backdrop fade-in"
    >
      <DisableBodyScroll />
      <div
        ref={modalRef}
        onMouseDown={(e) => e.stopPropagation()}
        className="flex-1 w-full sm:w-220 sm:mt-8 sm:rounded-sm scrollable bg-[var(--media-page-bg)]"
      >
        <MediaPageHeroSection
          mediaItemDetails={mediaItemDetails}
          onClose={closeModal}
        />
        <div className="flex flex-col gap-2 p-4 sm:px-10 sm:py-8 sm:gap-8">
          {renderH1MediaTitle()}

          <MediaPageDetailsSection
            mediaItemDetails={mediaItemDetails}
            mediaItemCredits={mediaItemCredits}
          />

          {/* In Mobile */}
          {!mediaItemDetails && !isSmUp && <MobileButtonsSkeleton />}
          {mediaItemDetails && !isSmUp && (
            <div className="flex gap-2 sm:hidden">
              <button
                onClick={() => {
                  if (mediaItemDetails)
                    showAddListModal({
                      media_id: mediaItemDetails.id,
                      media_type: mediaItemDetails.media_type,
                    });
                }}
                className="flex flex-col justify-between items-center gap-1 px-3 py-2 min-w-16"
              >
                <BsPlusLg className="text-2xl p-[3px]" />
                <span className="text-sm">My Lists</span>
              </button>
              <button className="flex flex-col justify-between items-center px-3 py-2 min-w-16">
                <BsSend className="text-2xl p-[3px]" />
                <span className="text-sm">Share</span>
              </button>
              <button className="flex flex-col justify-between items-center px-3 py-2 min-w-16">
                <BsStar className="text-2xl p-[3px]" />
                <span className="text-sm">Rate</span>
              </button>
            </div>
          )}
          <div>
            {!mediaItemDetails && <MediaExtrasNavSkeleton />}
            {mediaItemDetails && (
              <nav className="flex gap-4 scrollable">
                {MEDIA_PAGE_NAV_LINKS.map((navLink, index) => {
                  if (navLink.path === "/episodes" && mediaType === "movie")
                    return;

                  return (
                    <NavLink
                      key={navLink.path}
                      className={({ isActive }) =>
                        `media-page-nav${isActive ? "-active" : ""}`
                      }
                      state={{ backgroundLocation }}
                      to={`/${mediaType}/${mediaId}${navLink.path}`}
                      end
                    >
                      {navLink.name}
                    </NavLink>
                  );
                })}
              </nav>
            )}
            <Routes>
              <Route
                path=""
                element={
                  <RelatedMediaSection mediaItemDetails={mediaItemDetails} />
                }
              />
              <Route
                path="/casts"
                element={
                  <MediaPageCastsSection mediaItemCredits={mediaItemCredits} />
                }
              />
              <Route
                path="/episodes"
                element={
                  <MediaPageEpisodesSection
                    mediaId={mediaId}
                    seasons={mediaItemDetails?.seasons}
                  />
                }
              />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaPage;
