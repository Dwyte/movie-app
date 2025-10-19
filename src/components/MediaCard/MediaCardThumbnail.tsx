import { useQuery } from "@tanstack/react-query";
import {
  MEDIA_TYPE_NAME,
  NO_IMAGE_LANDSCAPE_PATH,
  NO_IMAGE_PORTRAIT_PATH,
} from "../../misc/constants";
import { getMediaItemImages } from "../../misc/tmdbAPI";
import { Media, MediaImagesResult } from "../../misc/types";
import { getTMDBImageURL } from "../../misc/utils";
import Img from "../Img";

import { useMediaQueries } from "../../contexts/MediaQueriesContext";
import clsx from "clsx";
import { Link, LinkProps } from "react-router-dom";
import { MEDIA_CARD_DIMENSIONS } from "./MediaCard";

interface Props {
  media: Media;
  mediaUrl: string;
  backgroundLocation: string;
  onLoad: () => void;
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

export const MediaCardThumbnail = ({
  media,
  mediaUrl,
  backgroundLocation,
  onLoad,
}: Props) => {
  const { isSmUp } = useMediaQueries();

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

  const mediaLabel = `${media.title} (${MEDIA_TYPE_NAME[media.media_type]})`;

  return (
    <Link
      // Goto MediaPage and set backgroundLocation to tell what page to render
      // at the background when rendering the Modal MediaPage in desktop.
      to={mediaUrl}
      state={{
        backgroundLocation,
        showTrailerOnLoad: false,
      }}
      aria-label={mediaLabel}
    >
      <div className="relative w-full h-full">
        {previewImageSource && (
          <Img
            className={clsx("w-full h-full object-cover")}
            onLoad={onLoad}
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
    </Link>
  );
};
