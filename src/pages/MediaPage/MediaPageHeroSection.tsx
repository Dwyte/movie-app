import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { useAddListModal } from "../../contexts/AddListModalContext";

import { NO_IMAGE_LANDSCAPE_PATH } from "../../misc/constants";
import { MediaDetails, MediaType } from "../../misc/types";
import { getMediaItemImages } from "../../misc/tmdbAPI";
import { getTMDBImageURL } from "../../misc/utils";

import { BsPlayFill, BsPlusLg, BsStar, BsXLg } from "react-icons/bs";
import { RiDownloadLine } from "react-icons/ri";
import Skeleton from "../../components/Skeleton";

interface Props {
  mediaItemDetails: MediaDetails | null;
  onClose: () => void;
}

const ButtonsSkeleton = () => {
  return (
    <div className="flex items-center gap-4 w-full h-9">
      <Skeleton className="h-full min-w-30" />
      <Skeleton className="h-full aspect-square" rounded="rounded-full" />
      <Skeleton className="h-full aspect-square" rounded="rounded-full" />
      <div className="flex-1"></div>
      <Skeleton className="h-full aspect-square" rounded="rounded-full" />
    </div>
  );
};

const MediaPageHeroSection = ({ mediaItemDetails, onClose }: Props) => {
  const { data: mediaItemImages } = useQuery({
    enabled: !!mediaItemDetails,
    queryKey: [mediaItemDetails?.media_type, mediaItemDetails?.id, "images"],
    queryFn: ({ queryKey }) => {
      const [mediaType, mediaId, _] = queryKey as [MediaType, number, string];
      return getMediaItemImages(mediaType, mediaId);
    },
  });

  const { showAddListModal } = useAddListModal();
  const [isBackdropLoaded, setIsBackdropLoaded] = useState<boolean>(false);
  const [isLogoLoaded, setIsLogoLoaded] = useState<boolean>(false);

  const logoImgSrc = useMemo(() => {
    if (!mediaItemImages) return null;

    const logo = mediaItemImages.logos.find((logo) => logo.iso_639_1 === "en");
    return logo ? getTMDBImageURL(logo.file_path) : null;
  }, [mediaItemImages]);

  const backdropImgSrc = useMemo(() => {
    if (!mediaItemDetails) return null;

    return mediaItemDetails.backdrop_path
      ? getTMDBImageURL(mediaItemDetails.backdrop_path, "1920")
      : NO_IMAGE_LANDSCAPE_PATH;
  }, [mediaItemDetails]);

  const renderLogo = () => {
    if (logoImgSrc) {
      return (
        <img
          className={`w-auto max-h-30 transition-opacity ${
            isLogoLoaded && isBackdropLoaded ? "opacity-100" : "opacity-0"
          }`}
          src={logoImgSrc}
          onLoad={() => setIsLogoLoaded(true)}
        />
      );
    }

    if (isBackdropLoaded) {
      return <h1 className="text-2xl font-bold">{mediaItemDetails?.title}</h1>;
    }

    return null;
  };

  return (
    <div className="relative bg-black w-full">
      <button
        onClick={onClose}
        className="secondary-icon-btn absolute right-3 top-3 border-0 z-100"
      >
        <BsXLg />
      </button>

      <div className="relative w-full aspect-[16/9]">
        <div className="hidden sm:block absolute inset-0 bottom-[-1px] bg-linear-to-t from-black to-black/0 via-black/75 via-25% to-100% z-1"></div>
        {!isBackdropLoaded && (
          <Skeleton
            className="absolute inset-0"
            rounded="rounded-none sm:rounded-t-sm"
          />
        )}

        {backdropImgSrc && (
          <img
            className={`w-full object-cover transition-opacity ${
              isBackdropLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setIsBackdropLoaded(true)}
            src={backdropImgSrc}
          />
        )}
      </div>

      <div className="hidden sm:flex flex-col items-start px-10 gap-8 absolute left-0 right-0 bottom-0 z-2">
        {renderLogo()}

        {!isBackdropLoaded && <ButtonsSkeleton />}
        {isBackdropLoaded && (
          <div className="flex items-center gap-4 w-full">
            <button className="primary-btn justify-center min-w-30">
              <BsPlayFill className="text-2xl mr-1" />
              <span>Play</span>
            </button>

            <button
              onClick={() => {
                if (!mediaItemDetails) return;

                showAddListModal({
                  media_id: mediaItemDetails.id,
                  media_type: mediaItemDetails.media_type,
                });
              }}
              className="secondary-icon-btn"
            >
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
        )}
      </div>
    </div>
  );
};

export default MediaPageHeroSection;
