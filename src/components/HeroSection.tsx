import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-use";
import { useMemo, useState } from "react";

import { BsPlusCircleFill } from "react-icons/bs";
import { FaInfoCircle } from "react-icons/fa";

import { getMediaItemImages, getTrendingMediaItems } from "../misc/tmdbAPI";
import { useAddListModal } from "../contexts/AddListModalContext";
import { shortenParagraph, getTMDBImageURL } from "../misc/utils";
import { MediaType, TimeWindow } from "../misc/types";

import GenreList from "./GenreList";
import Skeleton from "./Skeleton";

const HeroSection = ({ mediaType }: { mediaType: MediaType }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showAddListModal } = useAddListModal();

  const { data: trendingMediaItems } = useQuery({
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
  });

  // Selects a random trending movie to show.
  const mediaItem = useMemo(() => {
    if (!trendingMediaItems || trendingMediaItems.length === 0) return null;

    return trendingMediaItems[
      Math.floor(Math.random() * trendingMediaItems.length)
    ];
  }, [trendingMediaItems]);

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

    const logo = mediaItemImages.logos.find((logo) => logo.iso_639_1 === "en");

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
    <div className="relative min-h-150">
      <div
        className={`hidden sm:block absolute inset-0 bg-linear-to-r ${
          isBackdropLoaded ? "from-[var(--main-bg)]" : "from-[var(--main-bg)]/0"
        } to-black/0 to-60% z-1`}
      ></div>
      <div className="w-full h-150 sm:h-screen relative">
        {(!backdropImgSrc || !isBackdropLoaded) && (
          <Skeleton className="absolute inset-0 z-2" />
        )}
        {backdropImgSrc && (
          <img
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              isBackdropLoaded ? "opacity-100" : "opacity-0"
            }`}
            src={backdropImgSrc}
            onLoad={() => setIsBackdropLoaded(true)}
          />
        )}
      </div>
      <div
        className={`flex items-end sm:items-center sm:mt-[-100px] justify-center sm:justify-start absolute top-0 bottom-[-1px] right-0 left-0 bg-linear-to-t from-[var(--main-bg)] to-[var(--main-bg)]/0 to-50% sm:to-25% z-2`}
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

            <GenreList
              genreIds={mediaItem.genre_ids}
              className="text-center sm:text-left"
            />
            <div className="flex gap-4 justify-center sm:justify-start">
              <button
                onClick={() =>
                  showAddListModal({
                    media_id: mediaItem.id,
                    media_type: mediaItem.media_type,
                  })
                }
                className="primary-btn"
              >
                <BsPlusCircleFill className="text-md mr-2" />
                Add to my List
              </button>

              <button onClick={handleMoreInfoClick} className="secondary-btn">
                <FaInfoCircle className="text-md mr-2" />
                More Info
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
