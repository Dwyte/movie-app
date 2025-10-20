import { useLocation } from "react-router-dom";

import { Media } from "../../misc/types";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@radix-ui/react-hover-card";

import { MediaCardThumbnail } from "./MediaCardThumbnail";
import { MediaCardDetails } from "./MediaCardDetails";
import clsx from "clsx";
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
  const { isSmUp } = useMediaQueries();
  const location = useLocation();

  /* Current location as default origin before viewing the modal,
   sourcePathName for recursive MediaPage viewing e.g. Viewing another
   Media inside recommendations in MediaPage, the original backgroundLocation
   is passed as sourcePathName from the first MediaPage's MediaCards.
   "scale-115 drop-shadow-md drop-shadow-black"
   */
  const backgroundLocation = (sourcePathName || location) as string;
  const mediaUrl = `/${media.media_type}/${media.id}`;

  return (
    <HoverCard openDelay={400} closeDelay={400}>
      <HoverCardTrigger asChild>
        <div
          className={clsx(
            flexible ? "w-full h-full" : MEDIA_CARD_DIMENSIONS,
            "border-[1px] border-[var(--light-border-color)] p-[1px]",
            "focus-within:outline",
          )}
        >
          <MediaCardThumbnail
            media={media}
            mediaUrl={mediaUrl}
            backgroundLocation={backgroundLocation}
            onLoad={onImageLoad}
          />
        </div>
      </HoverCardTrigger>
      {isSmUp && (
        <HoverCardContent
          side="top"
          sideOffset={-250}
          className="z-50 popover-content"
          collisionPadding={50}
        >
          <div className="relative bg-[var(--media-card-bg)] shadow-2xl p-1 shadow-black w-100 border-1 border-[var(--light-border-color)]">
            <div className="w-5 h-5 border-t-1 border-white border-l-1 absolute -top-[1px] -left-[1px]"></div>
            <div className="w-5 h-5 border-t-1 border-white border-r-1 absolute -top-[1px] -right-[1px]"></div>
            <div className="w-5 h-5 border-b-1 border-white border-l-1 absolute -bottom-[1px] -left-[1px]"></div>
            <div className="w-5 h-5 border-b-1 border-white border-r-1 absolute -bottom-[1px] -right-[1px]"></div>

            <MediaCardThumbnail
              media={media}
              mediaUrl={mediaUrl}
              backgroundLocation={backgroundLocation}
              onLoad={onImageLoad}
            />
            <MediaCardDetails
              media={media}
              mediaUrl={mediaUrl}
              backgroundLocation={backgroundLocation}
            />
          </div>
        </HoverCardContent>
      )}
    </HoverCard>
  );
};

export default MediaCard;
