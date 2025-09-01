import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getMediaItemImages } from "../../misc/tmdbAPI";
import { getGenreNamesFromIds, getTMDBImageURL } from "../../misc/utils";
import { Media, MediaImagesResult } from "../../misc/types";

import { BsChevronDown, BsPlayFill, BsPlusLg, BsStar } from "react-icons/bs";
import {
  MEDIA_TYPE_NAME,
  NO_IMAGE_LANDSCAPE_PATH,
  NO_IMAGE_PORTRAIT_PATH,
} from "../../misc/constants";
import { useAddListModal } from "../../contexts/AddListModalContext";
import Img from "../Img";
import { useMediaQueries } from "../../contexts/MediaQueriesContext";
import { useState } from "react";

export const MEDIA_CARD_DIMENSIONS = "w-30 h-45 sm:w-66 sm:h-36";
const hoverWidth = "group-hover/mcard:w-72";
const hoverHeight = "group-hover/mcard:h-40";

interface Props {
  media: Media;
  onImageLoad: () => void;
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
  const { isSmUp } = useMediaQueries();

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

  const backdropWithTitleFilePath: string | null = mediaImages
    ? findBackdropWithTitle(mediaImages)
    : null;

  const previewImageSource = decideImagePreviewSource();
  const mediaUrl = `/${media.media_type}/${media.id}`;
  const mediaLabel = `${media.title} (${MEDIA_TYPE_NAME[media.media_type]})`;

  /* Current location as default origin before viewing the modal,
   sourcePathName for recursive MediaPage viewing e.g. Viewing another
   Media inside recommendations in MediaPage, the original backgroundLocation
   is passed as sourcePathName from the first MediaPage's MediaCards.
   */
  const backgroundLocation = sourcePathName || location;

  /**
   * On Desktop we use landscape/backdrop image, on mobile we use
   * portrait/poster image (this always has the title)
   * @returns source url for img attribute src
   */
  function decideImagePreviewSource() {
    if (isSmUp) {
      if (!mediaImages) return null;

      const imagePath = backdropWithTitleFilePath ?? media.backdrop_path;
      return imagePath ? getTMDBImageURL(imagePath) : NO_IMAGE_LANDSCAPE_PATH;
    }

    return media.poster_path
      ? getTMDBImageURL(media.poster_path)
      : NO_IMAGE_PORTRAIT_PATH;
  }

  const handlePlay = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    navigate(mediaUrl, {
      state: {
        backgroundLocation,
        showTrailerOnLoad: true,
      },
    });
  };

  const handleAddToList = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    showAddListModal({
      media_id: media.id,
      media_type: media.media_type,
    });
  };

  const [isCardActive, setIsCardActive] = useState(false);

  return (
    <Link
      aria-label={mediaLabel}
      // Goto MediaPage and set backgroundLocation to tell what page to render
      // at the background when rendering the Modal MediaPage in desktop.
      to={mediaUrl}
      state={{
        backgroundLocation,
        showTrailerOnLoad: false,
      }}
      className={`group/mcard hover:z-50 focus:z-50 focus-within:z-50 relative flex items-center justify-center shrink-0 cursor-pointer ${
        flexible
          ? "w-full h-full aspect-[1/1.5] sm:aspect-[16/9]"
          : MEDIA_CARD_DIMENSIONS
      }`}
      onMouseEnter={() => setIsCardActive(true)}
      onMouseLeave={() => setIsCardActive(false)}
      onFocus={() => setIsCardActive(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setIsCardActive(false);
      }}
    >
      {/** If flexible we have a static div container that will take the full space available.
       * This is for grids where dimensions depends on defined cols and not exactly from width
       * and height from our constant MEDIA_CARD_DIMENSIONS.
       * While the actual content is Absolute, it like floats on top of the
       * static div and scale up on hover etc. */}

      <div
        className={`absolute group rounded-sm overflow-hidden transition-transform group-hover/mcard:scale-115  group-hover/mcard:drop-shadow-md/100 group-hover/mcard:drop-shadow-black group-focus/mcard:scale-115 group-focus/mcard:drop-shadow-md/100 group-focus/mcard:drop-shadow-black group-focus-within/mcard:scale-115 group-focus-within:/mcard:drop-shadow-md/100 group-focus-within:/mcard:drop-shadow-black`}
      >
        <div className="relative">
          {previewImageSource && (
            <Img
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

        {isCardActive && (
          <div className="hidden p-2 group-hover/mcard:flex group-focus/mcard:flex group-focus-within/mcard:flex flex-col gap-2 bg-[var(--media-card-bg)] text-white shadow-2xl">
            <div className="flex gap-1 text-sm">
              <button
                aria-label="Open Media Page and Play Trailer"
                onClick={handlePlay}
                className="primary-icon-btn"
              >
                <BsPlayFill />
              </button>
              <button
                aria-label={`Add ${media.title} to a List`}
                onClick={handleAddToList}
                className="secondary-icon-btn"
              >
                <BsPlusLg />
              </button>
              <button className="secondary-icon-btn">
                <BsStar />
              </button>
              <div className="flex-1"></div>
              <button
                aria-label="Open Media Page"
                className="secondary-icon-btn"
              >
                <BsChevronDown />
              </button>
            </div>

            <div className="text-xs text-stone-300">
              {getGenreNamesFromIds(media.genre_ids, 3)}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default MediaCard;
