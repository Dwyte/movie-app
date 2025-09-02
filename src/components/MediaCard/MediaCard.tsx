import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { Media } from "../../misc/types";

import { MEDIA_TYPE_NAME } from "../../misc/constants";
import { useAddListModal } from "../../contexts/AddListModalContext";
import { MediaCardThumbnail } from "./MediaCardThumbnail";
import { MediaCardDetails } from "./MediaCardDetails";

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
        <MediaCardThumbnail
          media={media}
          onLoad={onImageLoad}
          flexible={flexible}
        />

        {isCardActive && (
          <MediaCardDetails
            media={media}
            onPlay={handlePlay}
            onAddToList={handleAddToList}
          />
        )}
      </div>
    </Link>
  );
};

export default MediaCard;
