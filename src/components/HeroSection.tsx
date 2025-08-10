import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-use";
import { useMemo } from "react";

import { BsPlusCircleFill } from "react-icons/bs";
import { FaInfoCircle } from "react-icons/fa";

import { getMediaItemImages, getTrendingMediaItems } from "../misc/tmdbAPI";
import { useAddListModal } from "../contexts/AddListModalContext";
import { shortenParagraph, getTMDBImageURL } from "../misc/utils";
import { MediaType, TimeWindow } from "../misc/types";

import GenreList from "./GenreList";

const HeroSection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showAddListModal } = useAddListModal();

  const { data: trendingMediaItems } = useQuery({
    queryKey: ["trending", "movie", "week"],
    queryFn: ({ queryKey }) => {
      const [_, mediaType, timeWindow] = queryKey as [
        string,
        MediaType,
        TimeWindow
      ];

      return getTrendingMediaItems(mediaType, timeWindow);
    },
  });

  // Selects a random trending movie to show.
  const mediaItem = useMemo(() => {
    if (!trendingMediaItems) return null;

    return trendingMediaItems.results[
      Math.floor(Math.random() * trendingMediaItems.results.length)
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
    if (!mediaItemImages || !mediaItem) return ["/hero-image.jpg", null];

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

  return (
    <div className="relative min-h-150">
      <div className="hidden sm:block absolute inset-0 bg-linear-to-r from-black to-black/0 to-60%"></div>{" "}
      <img
        className="w-full h-150 sm:h-screen object-cover sm:inset-shadow-lg"
        src={backdropImgSrc}
        alt="Media Backdrop Image"
      />
      {mediaItem && (
        <div className="flex items-end sm:items-center sm:mt-[-100px] justify-center sm:justify-start absolute top-0 bottom-[-1px] right-0 left-0 bg-linear-to-t from-[#000] to-black/0 to-50% sm:to-25%">
          <div className="flex flex-col gap-2 sm:gap-4 justify-center sm:ml-12">
            {logoImgSrc && (
              <div className="flex mb-2 px-10 justify-center sm:px-0 sm:justify-start">
                <img
                  className={`w-auto max-h-50 sm:w-auto sm:max-h-65`}
                  src={logoImgSrc}
                  alt=""
                />
              </div>
            )}

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
        </div>
      )}
    </div>
  );
};

export default HeroSection;
