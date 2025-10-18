import { Media, MediaRef } from "../../misc/types";

import FiveStarRating from "../../components/FiveStarRating";

import {
  MEDIA_TYPE_NAME,
  NO_IMAGE_LANDSCAPE_PATH,
  NO_IMAGE_PORTRAIT_PATH,
} from "../../misc/constants";
import { getTMDBImageURL } from "../../misc/utils";
import {
  BsChatSquareDots,
  BsChevronRight,
  BsTrash,
  BsXLg,
} from "react-icons/bs";
import Skeleton from "../../components/Skeleton";
import { useMediaQueries } from "../../contexts/MediaQueriesContext";

interface Props {
  media: Media;
  comment: string | null;
  isDeleting: boolean;
  onDelete: ((ref: MediaRef) => void) | null;
  onComment: ((listItem: Media) => void) | null;
  onLoad?: () => void;
}

export const MediaListItemSkeleton = () => {
  return (
    <div className="flex items-center gap-5 py-[1px] sm:px-4 sm:border-b sm:border-b-stone-800">
      <div className="hidden sm:block w-4"></div>
      <Skeleton rounded="" className="hidden sm:block h-6 w-6" />

      <div className="flex items-center w-full gap-2">
        <Skeleton
          className="h-42 sm:h-24 aspect-[1/1.5] sm:aspect-[16/9]"
        />

        <div className="flex flex-col gap-4 flex-1">
          <div className="flex gap-8 items-center justify-between">
            <div className="flex gap-1 flex-col sm:w-50 sm:flex-col">
              <Skeleton className="h-4 w-28 sm:h-5 sm:w-28" />
              <Skeleton className="h-3 w-9 sm:h-4 sm:w-10" />
            </div>

            <div className="hidden sm:flex justify-between flex-1">
              <div className="hidden lg:flex gap-4 items-center">
                <Skeleton className="h-5 w-10" />
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="flex gap-2 sm:gap-4 ms-center justify-end">
              <Skeleton className="w-8 h-8" rounded="" />
              <Skeleton className="w-8 h-8" rounded="" />
            </div>
          </div>

          <div className="flex flex-col gap-1 sm:gap-2 sm:hidden text-sm">
            <Skeleton className="h-4 w-22 sm:h-6" />
            <Skeleton className="h-4 w-30 sm:h-6" />
          </div>
        </div>
      </div>
      <div className="hidden sm:block"></div>
    </div>
  );
};

const MediaListItem = ({
  media,
  comment,
  isDeleting,
  onDelete,
  onComment,
  onLoad,
}: Props) => {
  const { isSmUp } = useMediaQueries();

  const thumbnailPath = isSmUp ? media.backdrop_path : media.poster_path;
  const noImagePath = isSmUp ? NO_IMAGE_LANDSCAPE_PATH : NO_IMAGE_PORTRAIT_PATH;

  const thumbnail = thumbnailPath
    ? getTMDBImageURL(thumbnailPath)
    : noImagePath;

  const mediaRef = { media_id: media.id, media_type: media.media_type };

  const isAuthorized = onDelete && onComment;

  return (
    <div className="flex items-center w-full gap-2">
      <img
        src={thumbnail}
        alt=""
        className="h-42 sm:h-24"
        onLoad={onLoad}
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

          {isAuthorized && (
            <div
              className="flex gap-2 sm:gap-2 ms-center justify-end"
              // Prevents Link/a defaults behavior to follow href.
              onClick={(e) => e.preventDefault()}
            >
              <button
                onClick={() => onComment(media)}
                className="btn  p-2"
                disabled={isDeleting}
                data-variant="secondary-icon"
              >
                <BsChatSquareDots />
              </button>
              <button
                onClick={() => onDelete(mediaRef)}
                className="btn  p-2"
                disabled={isDeleting}
                data-variant="secondary-icon"
              >
                <BsXLg />
              </button>
            </div>
          )}

          {!isAuthorized && (
            <button
              className="btn  p-3"
              aria-label={`Open ${media.title} media page.`}
              data-variant="secondary-icon"
            >
              <BsChevronRight />
            </button>
          )}
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
