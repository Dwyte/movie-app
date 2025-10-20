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
        TimeWindow,
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
      (backdrop) => backdrop.iso_639_1 === null,
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
    <div
      className={clsx(
        "relative min-h-150 border-b-1 border-[var(--list-border-color)]",
      )}
    >
      {/* <div
        className={`hidden sm:block absolute inset-0 bg-linear-to-r ${
          isBackdropLoaded ? "from-[var(--main-bg)]" : "from-[var(--main-bg)]/0"
        } to-black/0 to-60% z-10`}
      ></div> */}
      <div
        className={clsx(
          "h-150 sm:h-175 relative z-0 mx-4 sm:mx-20 border-x-1 p-1 border-[var(--list-border-color)] flex justify-end",
        )}
      >
        {(!backdropImgSrc || !isBackdropLoaded) && (
          <Skeleton className={clsx("absolute inset-0 m-1")} />
        )}

        {backdropImgSrc && isBackdropLoaded && (
          <div className="bg-gradient-to-t sm:bg-gradient-to-r pointer-events-none  from-0% from-[var(--main-bg)] via-[var(--main-bg)]/90 via-15% to-70% to-[var(--main-bg)]/0 absolute inset-0 z-10"></div>
        )}

        {backdropImgSrc && (
          <img
            className={clsx(
              "h-full w-full object-cover transition-opacity duration-500",
              isBackdropLoaded ? "opacity-100" : "opacity-0",
            )}
            src={backdropImgSrc}
            onLoad={() => setIsBackdropLoaded(true)}
          />
        )}

        <div
          className={clsx(
            "flex items-end -mb-3 sm:-mb-3 sm: sm:items-end justify-center sm:justify-start",
            "absolute top-0 bottom-[-1px] right-0 left-0 z-10",
          )}
        >
          {mediaItem && logoImgSrc && isBackdropLoaded && (
            <div
              className={clsx(
                "flex flex-col gap-4 sm:gap-4 justify-center sm:ml-12 transition-opacity duration-500",
                isLogoLoaded ? "opactiy-100" : "opacity-0",
              )}
            >
              <div
                className={clsx(
                  "flex mb-2 px-10 justify-center sm:px-0 sm:justify-start",
                )}
              >
                <img
                  className={clsx("w-auto max-h-50 sm:w-auto sm:max-h-100")}
                  src={logoImgSrc}
                  alt=""
                  onLoad={() => setTimeout(() => setIsLogoLoaded(true), 500)}
                />
              </div>

              <div
                className={clsx(
                  "hidden text-white sm:block sm:w-150 sm:text-sm",
                )}
              >
                {shortenParagraph(mediaItem.overview, 100)}
              </div>

              <div className={clsx("text-stone-300 text-center sm:text-left")}>
                {getGenreNamesFromIds(mediaItem.genre_ids)}
              </div>

              <div
                className={clsx("flex gap-4 justify-center sm:justify-start")}
              >
                <button
                  onClick={() =>
                    showAddListModal({
                      media_id: mediaItem.id,
                      media_type: mediaItem.media_type,
                    })
                  }
                  className={clsx("btn")}
                  data-variant="primary"
                >
                  <BsPlusCircleFill className={clsx("text-md mr-2")} />
                  Add to my List
                </button>

                <button
                  onClick={handleMoreInfoClick}
                  className={clsx("btn")}
                  data-variant="secondary"
                >
                  <FaInfoCircle className={clsx("text-md mr-2")} />
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
