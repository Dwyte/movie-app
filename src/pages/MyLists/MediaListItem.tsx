import { Media, MediaRef } from "../../misc/types";

import FiveStarRating from "../../components/FiveStarRating";

import { MEDIA_TYPE_NAME, NO_IMAGE_LANDSCAPE_PATH } from "../../misc/constants";
import { getTMDBImageURL } from "../../misc/utils";
import { BsChatLeftDots, BsXLg } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
  media: Media;
  isDeleting: boolean;
  onDelete: ((ref: MediaRef) => void) | null;
  onComment: ((listItem: Media) => void) | null;
}

const MediaListItem = ({ media, isDeleting, onDelete, onComment }: Props) => {
  const thumbnail = media.backdrop_path
    ? getTMDBImageURL(media.backdrop_path)
    : NO_IMAGE_LANDSCAPE_PATH;

  const navigate = useNavigate();
  const location = useLocation();

  const handleOnClick = () => {
    navigate(`/${media.media_type}/${media.id}`, {
      state: { backgroundLocation: location },
    });
  };

  const mediaRef = { media_id: media.id, media_type: media.media_type };

  return (
    <div
      onClick={handleOnClick}
      className="flex items-center justify-between w-full"
    >
      <div className="flex w-100 items-center gap-2">
        <img src={thumbnail} alt="" className="w-36" />
        <div className="flex flex-col sm:flex-col">
          <div>{media.title}</div>
          <div className="text-stone-500 text-sm">
            {MEDIA_TYPE_NAME[media.media_type]}
          </div>
        </div>
      </div>

      <div className="hidden sm:flex gap-4 items-center">
        <div className="text-white">
          {new Date(media.first_air_date || media.release_date || 0)
            .getFullYear()
            .toString()}
        </div>
        <FiveStarRating rating={media.vote_average} />
      </div>
      <div className="flex gap-4" onClick={(e) => e.stopPropagation()}>
        {onComment && (
          <button
            onClick={() => onComment(media)}
            className="cursor-pointer flex items-center justify-center hover:text-red-600 text-lg"
            disabled={isDeleting}
          >
            <BsChatLeftDots />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(mediaRef)}
            className="cursor-pointer flex items-center justify-center hover:text-red-600 text-lg"
            disabled={isDeleting}
          >
            <BsXLg />
          </button>
        )}
      </div>
    </div>
  );
};

export default MediaListItem;
