import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { MediaDetails, MediaType } from "../../misc/types";
import { getMediaItemImages } from "../../misc/tmdbAPI";
import { getTMDBImageURL } from "../../misc/utils";

import { BsPlayFill, BsPlusLg, BsStar, BsXLg } from "react-icons/bs";
import { RiDownloadLine } from "react-icons/ri";
import { NO_IMAGE_LANDSCAPE_PATH } from "../../misc/constants";

interface Props {
  mediaItemDetails: MediaDetails | null;
  onClose: () => void;
}

const MediaPageHeroSection = ({ mediaItemDetails, onClose }: Props) => {
  const { data: mediaItemImages } = useQuery({
    enabled: !!mediaItemDetails,
    queryKey: [mediaItemDetails?.media_type, mediaItemDetails?.id, "images"],
    queryFn: ({ queryKey }) => {
      const [mediaType, mediaId, _] = queryKey as [MediaType, number, string];
      return getMediaItemImages(mediaType, mediaId);
    },
  });

  const logoImgSrc = useMemo(() => {
    if (!mediaItemImages) return null;
    const logo = mediaItemImages.logos.find((logo) => logo.iso_639_1 === "en");
    return logo ? getTMDBImageURL(logo.file_path) : null;
  }, [mediaItemImages]);

  const backdropImgSrc = useMemo(() => {
    if (mediaItemDetails) {
      return mediaItemDetails.backdrop_path
        ? getTMDBImageURL(mediaItemDetails.backdrop_path, "1920")
        : NO_IMAGE_LANDSCAPE_PATH;
    }

    return NO_IMAGE_LANDSCAPE_PATH;
  }, [mediaItemDetails]);

  return (
    <div className="relative">
      <button
        onClick={onClose}
        className="secondary-icon-btn absolute right-3 top-3 border-0 z-100"
      >
        <BsXLg />
      </button>
      <div className="hidden sm:block absolute inset-0 bottom-[-1px] bg-linear-to-t from-black to-black/0 via-black/75 via-25% to-100%"></div>
      <img
        className="w-full sm:h-110 sm:object-cover"
        src={backdropImgSrc}
        alt=""
      />

      <div className="hidden sm:flex flex-col items-start px-10 gap-8 absolute left-0 right-0 bottom-0">
        {logoImgSrc ? (
          <img className="w-auto max-h-30" src={logoImgSrc} alt="" />
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
  );
};

export default MediaPageHeroSection;
