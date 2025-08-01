import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import {
  Cast,
  MediaImage,
  MediaDetails,
  Media,
  MediaType,
  MediaCreditsAPIResult,
  Crew,
} from "../misc/types";
import {
  getDurationString,
  shortenParagraph,
  getTMDBImageURL,
} from "../misc/utils";
import { RiDownloadLine } from "react-icons/ri";
import {
  getMediaItemCredits,
  getMediaItemDetails,
  getMediaItemImages,
  getDiscoverMediaItems,
} from "../misc/tmdbAPI";
import {
  BsBadgeCcFill,
  BsBadgeHdFill,
  BsPlayFill,
  BsPlusLg,
  BsSend,
  BsStar,
  BsXLg,
} from "react-icons/bs";

import MediaCard from "../components/MediaCard";
import useIsSmUp from "../hooks/useIsSmUp";

interface Props {
  mediaType: MediaType;
}

const MediaPage = ({ mediaType }: Props) => {
  const [mediaItemDetails, setMediaItemDetails] = useState<MediaDetails | null>(
    null
  );
  const [similarMedia, setSimilarMedia] = useState<Media[]>([]);
  const [mediaCredits, setMediaCredits] =
    useState<MediaCreditsAPIResult | null>(null);
  const [logo, setLogo] = useState<MediaImage | null>(null);

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

  useEffect(() => {
    const fetchMediaImages = async () => {
      if (!mediaId) return;
      const images = await getMediaItemImages(mediaType, mediaId);

      const logo = images.logos.find((logo) => logo.iso_639_1 === "en");
      if (logo) {
        setLogo(logo);
      } else {
        setLogo(null);
      }
    };

    fetchMediaImages();
  }, [mediaId]);

  useEffect(() => {
    const initializeRecommendations = async () => {
      if (!mediaItemDetails) return;

      const newSimilarMediaItems = await getDiscoverMediaItems(mediaType, {
        with_genres: mediaItemDetails.genres
          .map((g) => g.id.toString())
          .join(","),
      });

      // Remove current MediaItem
      const filteredSimilarMediaItems = newSimilarMediaItems.results.filter(
        (mediaItem) => mediaItem.id !== mediaItemDetails.id
      );

      setSimilarMedia(filteredSimilarMediaItems);
    };

    initializeRecommendations();
  }, [mediaItemDetails]);

  const closeModal = () => {
    navigate(backgroundLocation);
  };

  const imgSource = useMemo(() => {
    try {
      if (mediaItemDetails) {
        return getTMDBImageURL(mediaItemDetails.backdrop_path, "1920");
      }
    } catch (error) {
      return "/no-image-landscape.png";
    }
  }, [mediaItemDetails]);

  const resetScroll = () => {
    if (!modalRef) return;
    modalRef.current?.scrollBy({
      top: -modalRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  const director = useMemo<Crew | null>(() => {
    if (!mediaCredits) return null;

    const directorDetails = mediaCredits.crew.filter(
      (crew) => crew.job === "Director"
    );

    if (directorDetails.length > 0) return directorDetails[0];

    return null;
  }, [mediaCredits]);

  return (
    <div
      onClick={closeModal}
      className="flex justify-center fixed inset-0 text-white z-10000 bg-black/60"
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="sm:max-w-200 sm:mt-8 sm:rounded-sm scrollable"
      >
        <div className="relative">
          <button
            onClick={closeModal}
            className="secondary-icon-btn absolute right-3 top-3 border-0 z-100"
          >
            <BsXLg />
          </button>
          <div className="hidden sm:block absolute inset-0 bottom-[-1px] bg-linear-to-t from-black to-black/0 via-black/75 via-25% to-100%"></div>
          <img
            className="w-full sm:h-110 sm:object-cover"
            src={imgSource}
            alt=""
          />

          <div className="hidden sm:flex flex-col items-start px-10 gap-8 absolute left-0 right-0 bottom-0">
            {logo ? (
              <img
                className="w-auto max-h-30"
                src={getTMDBImageURL(logo.file_path)}
                alt=""
              />
            ) : (
              <h1 className="text-2xl font-bold">{mediaItemDetails?.title}</h1>
            )}
            <div className="flex items-center gap-4 w-full">
              <button className="primary-btn justify-center min-w-30">
                <BsPlayFill className="text-2xl mr-1" />
                <span>Play</span>
              </button>

              <button className="secondary-icon-btn">
                <BsPlusLg />
              </button>
              <button className="secondary-icon-btn">
                <BsStar />
              </button>
              <div className="flex-1"></div>
              <button className="secondary-icon-btn opacity-65">
                <RiDownloadLine />
              </button>
            </div>
          </div>
        </div>

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
            <button className="flex flex-col justify-between items-center gap-1 px-3 py-2 min-w-16 border-b-2 border-b-red-600">
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

          <div>
            <h2 className="text-lg font-bold my-2">More Like This</h2>
            <div className="grid grid-cols-3 gap-2">
              {similarMedia.map((mediaItem) => {
                return (
                  <div key={mediaItem.id} onClick={() => resetScroll()}>
                    <MediaCard
                      media={mediaItem}
                      sourcePathName={backgroundLocation}
                      flexible={true}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaPage;
