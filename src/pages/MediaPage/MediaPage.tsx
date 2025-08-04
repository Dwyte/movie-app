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

import useIsSmUp from "../../hooks/useIsSmUp";

import { getMediaItemCredits, getMediaItemDetails } from "../../misc/tmdbAPI";
import { MEDIA_PAGE_NAV_LINKS } from "../../misc/constants";
import { MediaType } from "../../misc/types";

import RelatedMediaSection from "./RelatedMediaSection";
import MediaPageHeroSection from "./MediaPageHeroSection";
import MediaPageDetailsSection from "./MediaPageDetailsSection";
import MediaPageCastsSection from "./MediaPageCastsSection";
import MediaPageEpisodesSection from "./MediaPageEpisodesSection";

interface Props {
  mediaType: MediaType;
}

const MediaPage = ({ mediaType }: Props) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isSmUp = useIsSmUp();
  const params = useParams();
  const mediaId = params.mediaId ? parseInt(params.mediaId) : null;
  const backgroundLocation = location.state
    ? location.state.backgroundLocation
    : "/";

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

  // Disable main body scrolling
  useEffect(() => {
    document.body.style.overflowY = "hidden";
    return () => {
      document.body.style.overflowY = "scroll";
    };
  }, []);

  // Scroll to the Top when selecting a new Media to view from related media section.
  useEffect(() => {
    const resetScroll = () => {
      if (!modalRef) return;
      modalRef.current?.scrollBy({
        top: -modalRef.current.scrollHeight,
        behavior: "smooth",
      });
    };

    resetScroll();
  }, [location.pathname]);

  const closeModal = () => {
    navigate(backgroundLocation);
  };

  return (
    <div
      onClick={closeModal}
      className="flex justify-center fixed inset-0 text-white z-10000 bg-black/60"
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="sm:max-w-220 sm:mt-8 sm:rounded-sm scrollable"
      >
        <MediaPageHeroSection
          mediaItemDetails={mediaItemDetails}
          onClose={closeModal}
        />
        <div className="flex flex-col gap-2 p-4 bg-black sm:px-10 sm:py-8 sm:gap-8">
          {/** On desktop, h1 Title is at MediaPageHeroSection. */}
          {!isSmUp && (
            <h1 className="font-bold text-2xl sm:hidden">
              {mediaItemDetails && mediaItemDetails.title}
            </h1>
          )}

          <MediaPageDetailsSection
            mediaItemDetails={mediaItemDetails}
            mediaItemCredits={mediaItemCredits}
          />

          <div className="flex gap-2 sm:hidden">
            <button className="flex flex-col justify-between items-center gap-1 px-3 py-2 min-w-16">
              <BsPlusLg className="text-2xl p-[3px]" />
              <span className="text-sm">My List</span>
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

          {mediaItemDetails && (
            <div>
              <nav className="flex gap-4 mb-4 scrollable">
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
                    <MediaPageCastsSection
                      mediaItemCredits={mediaItemCredits}
                    />
                  }
                />
                <Route
                  path="/episodes"
                  element={
                    <MediaPageEpisodesSection
                      mediaId={mediaId}
                      seasons={mediaItemDetails.seasons}
                    />
                  }
                />
              </Routes>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaPage;
