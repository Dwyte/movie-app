import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-use";
import { useMemo, useState } from "react";

import { BsPlusCircleFill } from "react-icons/bs";
import { FaInfoCircle } from "react-icons/fa";

import { getMediaItemImages, getTrendingMediaItems } from "../misc/tmdbAPI";
import { useAddListModal } from "../contexts/AddListModalContext";
import {
  shortenParagraph,
  getTMDBImageURL,
  getGenreNamesFromIds,
} from "../misc/utils";
import { MediaType, TimeWindow, LanguageCode } from "../misc/types";

import Skeleton from "./Skeleton";
import clsx from "clsx";

const HeroSection = ({ mediaType }: { mediaType: MediaType }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showAddListModal } = useAddListModal();

  const { data: trendingMediaItems, isSuccess } = useQuery({
    queryKey: ["trending", mediaType, "week"],
    queryFn: async ({ queryKey }) => {
      const [_, mediaType, timeWindow] = queryKey as [
        string,
        MediaType,
        TimeWindow
      ];

      const { results } = await getTrendingMediaItems(mediaType, timeWindow);

      return results;
    },
    staleTime: Infinity,
  });

  // Selects a random trending movie to show.
  const mediaItem = useMemo(() => {
    if (!trendingMediaItems || trendingMediaItems.length === 0) return null;

    return trendingMediaItems[
      Math.floor(Math.random() * trendingMediaItems.length)
    ];
  }, [isSuccess]);

  const { data: mediaItemImages } = useQuery({
    enabled: !!mediaItem,
    queryKey: [mediaItem?.media_type, mediaItem?.id, "images"],
    queryFn: ({ queryKey }) => {
      const [mediaType, mediaId, _] = queryKey as [MediaType, number, string];
      return getMediaItemImages(mediaType, mediaId);
    },
  });

  const [backdropImgSrc, logoImgSrc] = useMemo(() => {
    if (!mediaItemImages || !mediaItem) return [null, null];

    const backdrop = mediaItemImages.backdrops.filter(
      (backdrop) => backdrop.iso_639_1 === null
    )[Math.floor(Math.random() * mediaItemImages.backdrops.length)];

    let logo = mediaItemImages.logos.find((logo) => logo.iso_639_1 === "en");
    if (!logo) {
      logo =
        mediaItemImages.logos[
          Math.floor(Math.random() * mediaItemImages.logos.length)
        ];
    }

    return [
      getTMDBImageURL(backdrop?.file_path || mediaItem.backdrop_path, "1920"),
      logo ? getTMDBImageURL(logo.file_path, "500") : null,
    ];
  }, [mediaItem, mediaItemImages]);

  const handleMoreInfoClick = () => {
    if (!mediaItem) return;
    navigate(`/${mediaItem.media_type}/${mediaItem.id}`, {
      state: { backgroundLocation: location },
    });
  };

  const [isBackdropLoaded, setIsBackdropLoaded] = useState(false);
  const [isLogoLoaded, setIsLogoLoaded] = useState(false);

  return (
    <div className="relative min-h-150 border-b-1  border-[var(--list-border-color)]">
      {/* <div
        className={`hidden sm:block absolute inset-0 bg-linear-to-r ${
          isBackdropLoaded ? "from-[var(--main-bg)]" : "from-[var(--main-bg)]/0"
        } to-black/0 to-60% z-10`}
      ></div> */}
      <div className="h-150 sm:h-200 relative z-0 mx-4 sm:mx-20 border-x-1 p-1 border-[var(--list-border-color)]">
        {(!backdropImgSrc || !isBackdropLoaded) && (
          <Skeleton className="absolute inset-0 m-1" />
        )}
        {backdropImgSrc && (
          <img
            className={clsx(
              "w-full h-full object-cover transition-opacity duration-500",
              isBackdropLoaded ? "opacity-100" : "opacity-0",
              "brightness-75"
            )}
            src={backdropImgSrc}
            onLoad={() => setIsBackdropLoaded(true)}
          />
        )}

        <div
          className={`flex items-end sm:items-center justify-center sm:justify-start absolute top-0 bottom-[-1px] right-0 left-0 z-10`}
        >
          {mediaItem && logoImgSrc && isBackdropLoaded && (
            <div
              className={`flex flex-col gap-2 sm:gap-4 justify-center sm:ml-12 transition-opacity duration-500 ${
                isLogoLoaded ? "opactiy-100" : "opacity-0"
              }`}
            >
              <div className="flex mb-2 px-10 justify-center sm:px-0 sm:justify-start">
                <img
                  className={`w-auto max-h-50 sm:w-auto sm:max-h-65`}
                  src={logoImgSrc}
                  alt=""
                  onLoad={() => setTimeout(() => setIsLogoLoaded(true), 500)}
                />
              </div>

              <div className="hidden text-white sm:block sm:w-150 sm:text-sm">
                {shortenParagraph(mediaItem.overview, 100)}
              </div>

              <div className="text-stone-300 text-center sm:text-left">
                {getGenreNamesFromIds(mediaItem.genre_ids)}
              </div>

              <div className="flex gap-4 justify-center sm:justify-start">
                <button
                  onClick={() =>
                    showAddListModal({
                      media_id: mediaItem.id,
                      media_type: mediaItem.media_type,
                    })
                  }
                  className="btn"
                  data-variant="primary"
                >
                  <BsPlusCircleFill className="text-md mr-2" />
                  Add to my List
                </button>

                <button
                  onClick={handleMoreInfoClick}
                  className="btn"
                  data-variant="secondary"
                >
                  <FaInfoCircle className="text-md mr-2" />
                  More Info
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
