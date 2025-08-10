import { Media } from "../../misc/types";

import FiveStarRating from "../../components/FiveStarRating";

import { MEDIA_TYPE_NAME, NO_IMAGE_LANDSCAPE_PATH } from "../../misc/constants";
import { getTMDBImageURL } from "../../misc/utils";
import { BsXLg } from "react-icons/bs";

interface Props {
  media: Media;
}

const MediaListItem = ({ media }: Props) => {
  const thumbnail = media.backdrop_path
    ? getTMDBImageURL(media.backdrop_path)
    : NO_IMAGE_LANDSCAPE_PATH;

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex w-100 items-center gap-2">
        <img src={thumbnail} alt="" className="w-36" />
        <div className="flex flex-col sm:flex-col">
          <div>{media.title}</div>
          <div className="text-stone-500 text-sm">
            {MEDIA_TYPE_NAME[media.media_type]}
          </div>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <div className="text-stone-400">
          {media.first_air_date || media.release_date}
        </div>
        <FiveStarRating rating={media.vote_average} />
      </div>

      <div>
        <button className="cursor-pointer hover:text-red-600 text-lg">
          <BsXLg />
        </button>
      </div>
    </div>
  );
};

export default MediaListItem;
