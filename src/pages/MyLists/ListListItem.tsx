import { List } from "../../misc/types";

import FiveStarRating from "../../components/FiveStarRating";

import { NO_IMAGE_LANDSCAPE_PATH } from "../../misc/constants";
import { getTMDBImageURL } from "../../misc/utils";

import { BsGlobeAmericas, BsLockFill } from "react-icons/bs";

interface Props {
  listItem: List;
}

const ListListItem = ({ listItem }: Props) => {
  const thumbnail = listItem.backdrop_path
    ? getTMDBImageURL(listItem.backdrop_path)
    : NO_IMAGE_LANDSCAPE_PATH;

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex w-100 items-center gap-2">
        <img src={thumbnail} alt="" className="w-36" />
        <div className="flex flex-col sm:flex-col">
          <div>{listItem.name}</div>
          <div className="text-stone-500 text-sm">
            {listItem.number_of_items} item
            {listItem.number_of_items > 1 && "s"}
          </div>
        </div>
      </div>

      <FiveStarRating
        className="hidden sm:block"
        rating={listItem.average_rating}
      />
      <div className="text-sm">
        {listItem.public ? <BsGlobeAmericas /> : <BsLockFill />}
      </div>
    </div>
  );
};

export default ListListItem;
