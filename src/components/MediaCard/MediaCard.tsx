import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { Media } from "../../misc/types";

import { MEDIA_TYPE_NAME } from "../../misc/constants";
import { useAddListModal } from "../../contexts/AddListModalContext";
import { MediaCardThumbnail } from "./MediaCardThumbnail";
import { MediaCardDetails } from "./MediaCardDetails";
import { useMediaQueries } from "../../contexts/MediaQueriesContext";

export const MEDIA_CARD_DIMENSIONS = "w-30 h-45 sm:w-66 sm:h-36";
const hoverWidth = "group-hover/mcard:w-72";
const hoverHeight = "group-hover/mcard:h-40";

interface Props {
  media: Media;
  onImageLoad: () => void;
  sourcePathName?: string;
  flexible?: boolean;
}

const MediaCard = ({
  media,
  sourcePathName,
  onImageLoad,
  flexible = false,
}: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { showAddListModal } = useAddListModal();
  const mediaUrl = `/${media.media_type}/${media.id}`;
  const mediaLabel = `${media.title} (${MEDIA_TYPE_NAME[media.media_type]})`;
  const { isSmUp } = useMediaQueries();

  /* Current location as default origin before viewing the modal,
   sourcePathName for recursive MediaPage viewing e.g. Viewing another
   Media inside recommendations in MediaPage, the original backgroundLocation
   is passed as sourcePathName from the first MediaPage's MediaCards.
   */
  const backgroundLocation = sourcePathName || location;

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

  const handleMouseEnter = () => {
    setIsCardActive(true);
  };

  const handleMouseLeave = () => {
    setIsCardActive(false);
  };

  const handleFocus = () => {
    setIsCardActive(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setIsCardActive(false);
  };

  const [isCardActive, setIsCardActive] = useState(false);

  return (
    <div
      className={`group/mcard relative flex items-center justify-center shrink-0 ${isCardActive && "z-50"} ${
        flexible
          ? "w-full h-full aspect-[1/1.5] sm:aspect-[16/9]"
          : MEDIA_CARD_DIMENSIONS
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {/** If flexible we have a static div container that will take the full space available.
       * This is for grids where dimensions depends on defined cols and not exactly from width
       * and height from our constant MEDIA_CARD_DIMENSIONS.
       * While the actual content is Absolute, it like floats on top of the
       * static div and scale up on hover etc. */}

      <div
        className={` overflow-hidden focus-within:outline absolute group transition-transform 
          ${isCardActive && isSmUp && "scale-115 drop-shadow-md drop-shadow-black"}`}
      >
        <Link
          // Goto MediaPage and set backgroundLocation to tell what page to render
          // at the background when rendering the Modal MediaPage in desktop.
          className="group/link outline-0"
          to={mediaUrl}
          state={{
            backgroundLocation,
            showTrailerOnLoad: false,
          }}
          aria-label={mediaLabel}
        >
          <MediaCardThumbnail
            media={media}
            onLoad={onImageLoad}
            flexible={flexible}
          />
        </Link>

        {isCardActive && isSmUp && (
          <MediaCardDetails
            media={media}
            onPlay={handlePlay}
            onAddToList={handleAddToList}
          />
        )}
      </div>
    </div>
  );
};

export default MediaCard;
