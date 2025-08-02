import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { BsPlusLg, BsSend, BsStar } from "react-icons/bs";

import {
  MediaDetails,
  MediaType,
  MediaCreditsAPIResult,
} from "../../misc/types";

import { getMediaItemCredits, getMediaItemDetails } from "../../misc/tmdbAPI";

import useIsSmUp from "../../hooks/useIsSmUp";
import RelatedMediaSection from "./RelatedMediaSection";
import MediaPageHeroSection from "./MediaPageHeroSection";
import MediaPageDetailsSection from "./MediaPageDetailsSection";

interface Props {
  mediaType: MediaType;
}

const MediaPage = ({ mediaType }: Props) => {
  const [mediaItemDetails, setMediaItemDetails] = useState<MediaDetails | null>(
    null
  );
  const [mediaItemCredits, setMediaItemCredits] =
    useState<MediaCreditsAPIResult | null>(null);

  const modalRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isSmUp = useIsSmUp();
  const params = useParams();
  const mediaId = params.mediaId ? parseInt(params.mediaId) : null;
  const backgroundLocation = location.state
    ? location.state.backgroundLocation
    : "/";

  useEffect(() => {
    // Disable main body scrolling
    document.body.style.overflowY = "hidden";

    return () => {
      document.body.style.overflowY = "scroll";
    };
  }, []);

  useEffect(() => {
    const fetchMediaDetails = async () => {
      if (!mediaId) return;
      const _mediaItemDetails = await getMediaItemDetails(mediaType, mediaId);
      setMediaItemDetails(_mediaItemDetails);

      const _mediaCasts = await getMediaItemCredits(mediaType, mediaId);
      setMediaItemCredits(_mediaCasts);
    };

    fetchMediaDetails();
  }, [mediaId]);

  const closeModal = () => {
    navigate(backgroundLocation);
  };

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
        <div className="flex flex-col gap-2 p-4 bg-black sm:px-10 sm:py-8 sm:gap-4">
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
              <h2 className="text-lg font-bold p-2 inline-block border-t-2 border-red-600 ">
                More Like This
              </h2>
              <RelatedMediaSection mediaItemDetails={mediaItemDetails} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaPage;
