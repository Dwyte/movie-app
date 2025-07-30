import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import { getMediaItemImages } from "../../misc/tmdbAPI";
import { getTMDBImageURL } from "../../misc/utils";
import { Media } from "../../misc/types";

import useIsSmUp from "../../hooks/useIsSmUp";

interface Props {
  media: Media;
  imgClassNames?: string;
  sourcePathName?: string;
}
const MediaCard = ({ media, imgClassNames, sourcePathName }: Props) => {
  // Backdrop with Logo used for landscape versions
  const [backdropWithTitleFilePath, setBackdropWithTitleFilePath] = useState<
    string | null
  >(null);
  const isSmUp = useIsSmUp();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const findMediaBackdrop = async () => {
      try {
        const mediaImages = await getMediaItemImages(
          media.media_type,
          media.id
        );

        // We look for a backdrop that has "en" for language, meaning
        // that backdrop image has the title/logo and we use that as preview
        // for the media card so it's easier for the user to identify
        const mediaBackdropWithTitle = mediaImages.backdrops.find(
          (mediaImage) =>
            mediaImage.iso_639_1 === "en" && mediaImage.aspect_ratio > 1
        );

        if (mediaBackdropWithTitle) {
          setBackdropWithTitleFilePath(mediaBackdropWithTitle?.file_path);
        }
      } catch (error) {
        console.error(error);
      }
    };

    // Only need to find backdrop/landscape image in Desktop mode.
    // Portrait posters for mobile.
    if (isSmUp && backdropWithTitleFilePath === null) {
      findMediaBackdrop();
    }
  }, [isSmUp]);

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

  // On Desktop we use landscape/backdrop image, on mobile we use
  // portrait/poster image (this always has the title)
  const imgSource = useMemo(() => {
    if (isSmUp) {
      if (backdropWithTitleFilePath !== null) {
        return getTMDBImageURL(backdropWithTitleFilePath);
      }

      if (media.backdrop_path) {
        return getTMDBImageURL(media.backdrop_path);
      }

      return "/no-image-landscape.png";
    }

    if (media.poster_path) {
      return getTMDBImageURL(media.poster_path);
    }

    return "no-image-portrait.png";
  }, [backdropWithTitleFilePath, isSmUp]);

  return (
    <div onClick={handleMediaCardClick} className="shrink-0 cursor-pointer">
      <img
        className={`rounded-sm object-cover ${
          imgClassNames || "w-30 h-45 sm:w-66 sm:h-36"
        }`}
        src={imgSource}
        alt={media.title}
      />
    </div>
  );
};

export default MediaCard;
