import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { RiDownloadLine } from "react-icons/ri";
import {
  BsBadgeCcFill,
  BsBadgeHdFill,
  BsPlayFill,
  BsPlusLg,
  BsSend,
  BsStar,
} from "react-icons/bs";

import {
  MediaImage,
  MediaDetails,
  MediaType,
  MediaCreditsAPIResult,
  Crew,
} from "../../misc/types";

import { getDurationString, shortenParagraph } from "../../misc/utils";

import { getMediaItemCredits, getMediaItemDetails } from "../../misc/tmdbAPI";

import useIsSmUp from "../../hooks/useIsSmUp";
import RelatedMediaSection from "./RelatedMediaSection";
import MediaPageHeroSection from "./MediaPageHeroSection";

interface Props {
  mediaType: MediaType;
}

const MediaPage = ({ mediaType }: Props) => {
  const [mediaItemDetails, setMediaItemDetails] = useState<MediaDetails | null>(
    null
  );
  const [mediaCredits, setMediaCredits] =
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
      setMediaCredits(_mediaCasts);
    };

    fetchMediaDetails();
  }, [mediaId]);

  const closeModal = () => {
    navigate(backgroundLocation);
  };

  const director = useMemo<Crew | null>(() => {
    if (!mediaCredits) return null;

    const directorDetails = mediaCredits.crew.filter(
      (crew) => crew.job === "Director"
    );

    if (directorDetails.length > 0) return directorDetails[0];

    return null;
  }, [mediaCredits]);

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
          <div className="flex flex-col gap-2 sm:flex sm:flex-row sm:gap-12">
            <div className="flex flex-col gap-2 sm:flex-3">
              <div className="flex items-center gap-2 text-stone-400">
                <div>
                  {mediaItemDetails?.release_date ||
                    mediaItemDetails?.first_air_date}
                </div>
                <div>
                  {mediaItemDetails?.runtime &&
                    getDurationString(mediaItemDetails.runtime)}

                  {mediaItemDetails?.number_of_seasons &&
                    `${mediaItemDetails.number_of_seasons} season${
                      mediaItemDetails.number_of_seasons > 1 ? "s" : ""
                    }`}
                </div>
                <BsBadgeHdFill className="text-xl" />
                <BsBadgeCcFill className="text-xl" />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex flex-col items-center leading-none text-[8px] font-bold bg-red-600 p-[3px] rounded-[2px]">
                  <span>TOP</span> <span className="text-[11px]">10</span>
                </div>
                <h3 className="font-bold text-lg">#1 in TV Shows Today</h3>
              </div>

              <button className="primary-btn justify-center sm:hidden">
                <BsPlayFill className="text-2xl mr-1" />
                Play
              </button>
              <button className="secondary-btn justify-center sm:hidden">
                <RiDownloadLine className="text-2xl mr-1" />
                Download
              </button>

              <p className="text-stone-300 text-sm">
                {mediaItemDetails &&
                  shortenParagraph(mediaItemDetails.overview, 200)}
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-2">
              {mediaCredits && mediaCredits?.cast.length > 0 && (
                <div className="text-sm text-stone-400">
                  Casts: &#32;
                  <span className="text-white">
                    {mediaCredits.cast
                      .slice(0, 3)
                      .map((cast) => cast.name)
                      .join(", ")}
                  </span>
                </div>
              )}
              {director && (
                <div className="text-sm text-stone-400">
                  Director: &#32;
                  <span className="text-white">{director.name}</span>
                </div>
              )}
              <div className="text-sm text-stone-400">
                Genres: &#32;
                <span className="text-white">
                  {mediaItemDetails &&
                    mediaItemDetails.genres
                      .map((genre) => genre.name)
                      .join(", ")}
                </span>
              </div>
            </div>
          </div>

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
