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
    <HoverCard openDelay={400} closeDelay={0}>
      <HoverCardTrigger asChild>
        <div
          className={clsx(
            flexible
              ? "w-full h-full aspect-[1/1.5] sm:aspect-[16/9]"
              : MEDIA_CARD_DIMENSIONS,
            "brightness-90"
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
      <HoverCardContent side="top" sideOffset={-250} className="z-50">
        <div className="shadow-2xl shadow-black w-100">
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
    </HoverCard>
  );
};

export default MediaCard;
