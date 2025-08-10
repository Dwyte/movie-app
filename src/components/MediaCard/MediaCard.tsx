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

const defaultDimensions = "w-30 h-45 sm:w-66 sm:h-36";
const hoverWidth = "group-hover/mcard:w-72";
const hoverHeight = "group-hover/mcard:h-40";

interface Props {
  media: Media;
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

const MediaCard = ({ media, sourcePathName, flexible = false }: Props) => {
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
      // onClick={handleMediaCardClick}
      className={`group/mcard relative flex items-center justify-center shrink-0 ${
        flexible ? "w-full h-full" : defaultDimensions
      } cursor-pointer`}
    >
      {flexible && (
        <div className="relative rounded-sm overflow-hidden">
          <img
            className={`w-full h-full object-cover`}
            src={previewImageSource}
            alt={media.title}
          />

          {!backdropWithTitleFilePath && isSmUp && (
            <h3 className="absolute text-sm text-white text-center font-bold left-0 bottom-0 right-0 bg-black/70">
              {media.title}
            </h3>
          )}
        </div>
      )}

      <div
        onClick={(e) => e.stopPropagation()}
        className={`${
          flexible && "hidden group-hover/mcard:block"
        } absolute group rounded-sm overflow-hidden ${hoverWidth} group-hover/mcard:z-1000`}
      >
        <div className=" relative">
          <img
            className={`${`${
              flexible ? "w-full h-full" : defaultDimensions
            } ${hoverWidth} ${hoverHeight}`}  object-cover`}
            src={previewImageSource}
            alt={media.title}
          />

          {!backdropWithTitleFilePath && isSmUp && (
            <h3 className="absolute text-sm text-white text-center font-bold left-0 bottom-0 right-0 bg-black/70">
              {media.title}
            </h3>
          )}
        </div>

        <div className="hidden p-2 group-hover/mcard:flex flex-col gap-2 bg-stone-900 text-white shadow-2xl">
          <div className="flex gap-1">
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

          <div className="text-sm">
            <GenreList genreIds={media.genre_ids} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaCard;
