import { Media, MediaRef } from "../../misc/types";

import FiveStarRating from "../../components/FiveStarRating";

import {
  MEDIA_TYPE_NAME,
  NO_IMAGE_LANDSCAPE_PATH,
  NO_IMAGE_PORTRAIT_PATH,
} from "../../misc/constants";
import { getTMDBImageURL } from "../../misc/utils";
import {
  BsChatLeftDots,
  BsChatSquareDots,
  BsChatText,
  BsChevronRight,
  BsXLg,
} from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import useIsSmUp from "../../hooks/useIsSmUp";

interface Props {
  media: Media;
  comment: string | null;
  isDeleting: boolean;
  onDelete: ((ref: MediaRef) => void) | null;
  onComment: ((listItem: Media) => void) | null;
}

const MediaListItem = ({
  media,
  comment,
  isDeleting,
  onDelete,
  onComment,
}: Props) => {
  const isSmUp = useIsSmUp();

  const thumbnailPath = isSmUp ? media.backdrop_path : media.poster_path;
  const noImagePath = isSmUp ? NO_IMAGE_LANDSCAPE_PATH : NO_IMAGE_PORTRAIT_PATH;

  const thumbnail = thumbnailPath
    ? getTMDBImageURL(thumbnailPath)
    : noImagePath;

  const navigate = useNavigate();
  const location = useLocation();

  const handleOnClick = () => {
    navigate(`/${media.media_type}/${media.id}`, {
      state: { backgroundLocation: location },
    });
  };

  const mediaRef = { media_id: media.id, media_type: media.media_type };

  return (
    <div onClick={handleOnClick} className="flex items-center w-full gap-2">
      <img
        src={thumbnail}
        alt=""
        className="h-42 sm:h-24 rounded-sm sm:rounded-none"
      />

      <div className="flex flex-col gap-4 flex-1">
        <div className="flex gap-8 items-center justify-between">
          <div className="flex flex-col sm:w-50 sm:flex-col">
            <div className="text-base sm:text-base">{media.title}</div>
            <div className="text-stone-500 text-xs sm:text-sm">
              {MEDIA_TYPE_NAME[media.media_type]}
            </div>
          </div>

          <div className="hidden sm:flex justify-between flex-1">
            <div className="hidden lg:flex gap-4 items-center">
              <div className="text-white">
                {new Date(media.first_air_date || media.release_date || 0)
                  .getFullYear()
                  .toString()}
              </div>
              <FiveStarRating rating={media.vote_average} />
            </div>
            {comment && (
              <div className="text-right italic tracking-wide cursor-text">
                "{comment}"
              </div>
            )}
          </div>
          <div
            className="flex gap-2 sm:gap-4 ms-center justify-end"
            onClick={(e) => e.stopPropagation()}
          >
            {onComment && (
              <button
                onClick={() => onComment(media)}
                className="secondary-icon-btn p-2"
                disabled={isDeleting}
              >
                <BsChatSquareDots />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(mediaRef)}
                className="secondary-icon-btn p-2"
                disabled={isDeleting}
              >
                <BsXLg />
              </button>
            )}
            {!onComment && !onDelete && (
              <button
                onClick={handleOnClick}
                className="secondary-icon-btn p-2"
              >
                <BsChevronRight />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:hidden text-sm">
          <FiveStarRating rating={media.vote_average} />
          {comment && (
            <div className="flex-1 italic tracking-wide cursor-text">
              "{comment}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaListItem;
