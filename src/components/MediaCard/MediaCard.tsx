import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getMediaItemImages } from "../../misc/tmdbAPI";
import { getTMDBImageURL } from "../../misc/utils";
import { Media, MediaImagesResult } from "../../misc/types";

import useIsSmUp from "../../hooks/useIsSmUp";
import GenreList from "../GenreList";

import { BsChevronDown, BsPlayFill, BsPlusLg, BsStar } from "react-icons/bs";
import {
  NO_IMAGE_LANDSCAPE_PATH,
  NO_IMAGE_PORTRAIT_PATH,
} from "../../misc/constants";
import { useAddListModal } from "../../contexts/AddListModalContext";

export const MEDIA_CARD_DIMENSIONS = "w-30 h-45 sm:w-66 sm:h-36";
const hoverWidth = "group-hover/mcard:w-72";
const hoverHeight = "group-hover/mcard:h-40";

interface Props {
  media: Media;
  onImageLoad?: () => void;
  sourcePathName?: string;
  flexible?: boolean;
}

/**
 * @returns the file path of the backdrop image with title
 */
const findBackdropWithTitle = (mediaImages: MediaImagesResult) => {
  if (!mediaImages) return null;

  // We look for a backdrop that has "en" for language, meaning
  // that backdrop image has the title/logo and we use that as preview
  // for the media card so it's easier for the user to identify
  const mediaBackdropWithTitle = mediaImages.backdrops.find(
    (mediaImage) => mediaImage.iso_639_1 === "en" && mediaImage.aspect_ratio > 1
  );

  if (mediaBackdropWithTitle) return mediaBackdropWithTitle.file_path;
  return null;
};

const MediaCard = ({
  media,
  sourcePathName,
  onImageLoad,
  flexible = false,
}: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSmUp = useIsSmUp();

  const { showAddListModal } = useAddListModal();

  const { data: mediaImages } = useQuery({
    // Only need to find backdrop/landscape image in Desktop mode.
    // Portrait posters for mobile.
    enabled: isSmUp,
    queryKey: [media.media_type, media.id, "images"],
    queryFn: async () => {
      return await getMediaItemImages(media.media_type, media.id);
    },
  });

  const handleMediaCardClick = () => {
    // Goto MediaPage and set backgroundLocation to tell what page to render
    // at the background when rendering the Modal MediaPage in desktop.
    navigate(`/${media.media_type}/${media.id}`, {
      // Current location as default origin before viewing the modal,
      // sourcePathName for recursive MediaPage viewing e.g. Viewing another
      // Media inside recommendations in MediaPage, the original backgroundLocation
      // is passed as sourcePathName from the first MediaPage's MediaCards.
      state: { backgroundLocation: sourcePathName || location },
    });
  };

  const backdropWithTitleFilePath: string | null = mediaImages
    ? findBackdropWithTitle(mediaImages)
    : null;

  /**
   * On Desktop we use landscape/backdrop image, on mobile we use
   * portrait/poster image (this always has the title)
   * @returns source url for img attribute src
   */
  const decideImagePreviewSource = () => {
    if (isSmUp) {
      if (!mediaImages) return null;

      const imagePath = backdropWithTitleFilePath ?? media.backdrop_path;
      return imagePath ? getTMDBImageURL(imagePath) : NO_IMAGE_LANDSCAPE_PATH;
    }

    return media.poster_path
      ? getTMDBImageURL(media.poster_path)
      : NO_IMAGE_PORTRAIT_PATH;
  };

  const previewImageSource = decideImagePreviewSource();

  return (
    <div
      onClick={handleMediaCardClick}
      className={`group/mcard relative flex items-center justify-center shrink-0 cursor-pointer ${
        flexible
          ? "w-full h-full aspect-[1/1.5] sm:aspect-[16/9]"
          : MEDIA_CARD_DIMENSIONS
      }`}
    >
      {/** If flexible we have a static div container that will take the full space available. This is for grids where dimensions depends on defined cols
       * and not exactly from width and height from our constant MEDIA_CARD_DIMENSIONS. While the actual content is Absolute, it like floats on top of the
       * static div and scale up on hover etc. */}

      <div
        className={`absolute group rounded-sm overflow-hidden group-hover/mcard:scale-115 transition-transform group-hover/mcard:z-1000`}
      >
        <div className="relative">
          {previewImageSource && (
            <img
              className={`${
                flexible
                  ? "w-full h-full aspect-[1/1.5] sm:aspect-[16/9]"
                  : MEDIA_CARD_DIMENSIONS
              }  object-cover`}
              onLoad={onImageLoad}
              src={previewImageSource}
              alt={media.title}
            />
          )}

          {/** We Display a Title Text if there's no available Image that contains the title for the Thumbnail */}
          {!backdropWithTitleFilePath && isSmUp && (
            <h3 className="absolute text-sm text-white text-center font-bold left-0 bottom-0 right-0 bg-black/70">
              {media.title}
            </h3>
          )}
        </div>

        <div
          onClick={(e) => e.stopPropagation()}
          className="hidden p-2 group-hover/mcard:flex flex-col gap-2 bg-stone-900 text-white shadow-2xl"
        >
          <div className="flex gap-1 text-sm">
            <button className="primary-icon-btn">
              <BsPlayFill />
            </button>
            <button
              onClick={() => {
                showAddListModal({
                  media_id: media.id,
                  media_type: media.media_type,
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
            <button className="secondary-icon-btn">
              <BsChevronDown />
            </button>
          </div>

          <div className="text-xs">
            <GenreList genreIds={media.genre_ids} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaCard;
