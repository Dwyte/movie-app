import { useQuery } from "@tanstack/react-query";
import {
  NO_IMAGE_LANDSCAPE_PATH,
  NO_IMAGE_PORTRAIT_PATH,
} from "../../misc/constants";
import { getMediaItemImages } from "../../misc/tmdbAPI";
import { Media, MediaImagesResult } from "../../misc/types";
import { getTMDBImageURL } from "../../misc/utils";
import Img from "../Img";
import { MEDIA_CARD_DIMENSIONS } from "./MediaCard";
import { useMediaQueries } from "../../contexts/MediaQueriesContext";

interface Props {
  media: Media;
  onLoad: () => void;
  flexible: boolean;
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

export const MediaCardThumbnail = ({ media, onLoad, flexible }: Props) => {
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

  return (
    <div className="relative">
      {previewImageSource && (
        <Img
          className={`group-focus/link:border-2 border-blue-300 rounded-t-sm ${
            flexible
              ? "w-full h-full aspect-[1/1.5] sm:aspect-[16/9]"
              : MEDIA_CARD_DIMENSIONS
          }  object-cover`}
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
  );
};
