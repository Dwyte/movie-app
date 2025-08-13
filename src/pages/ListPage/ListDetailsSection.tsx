import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { ListDetails, Media } from "../../misc/types";
import {
  BsBoxArrowUpRight,
  BsImages,
  BsPencilSquare,
  BsTrash,
} from "react-icons/bs";
import FiveStarRating from "../../components/FiveStarRating";
import StyledKeyValue from "../../components/StyledKeyValue";
import VisibilityIcon from "../../components/VisibilityIcon";
import { NO_IMAGE_LANDSCAPE_PATH } from "../../misc/constants";
import { getTMDBImageURL, getDurationString } from "../../misc/utils";

interface Props {
  listDetails: ListDetails;
  isUserOwner: boolean;
  onDeleteList: () => void;
  onEditBackdrop: () => void;
  onEditDetails: () => void;
}

const ListDetailsSection = ({
  listDetails,
  isUserOwner,
  onEditBackdrop,
  onEditDetails,
  onDeleteList,
}: Props) => {
  const thumbnail = listDetails.backdrop_path
    ? getTMDBImageURL(listDetails.backdrop_path, "1920")
    : NO_IMAGE_LANDSCAPE_PATH;

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
  };

  return (
    <div className="relative mb-4 rounded-sm overflow-hidden">
      <img className="h-80 sm:h-80 sm:w-full object-cover" src={thumbnail} />
      <div className="bg-black/33 w-full h-full absolute top-0"></div>

      {isUserOwner && (
        <div className="absolute top-0 right-0 p-4 flex flex-col gap-2 z-5">
          <button onClick={handleShare} className="secondary-icon-btn p-3">
            <BsBoxArrowUpRight />
          </button>
          <button onClick={onEditBackdrop} className="secondary-icon-btn p-3">
            <BsImages />
          </button>
          <button onClick={onEditDetails} className="secondary-icon-btn p-3">
            <BsPencilSquare />
          </button>
          <button onClick={onDeleteList} className="secondary-icon-btn p-3">
            <BsTrash />
          </button>
        </div>
      )}

      <div className="flex flex-col absolute bottom-0 text-white w-full">
        <div className="p-2 sm:p-4">
          <h1 className="text-4xl font-bold flex gap-2 items-center">
            {listDetails.name}
          </h1>
          <p className="text-base">
            {listDetails.description || "No description."}
          </p>
        </div>

        <div className="flex bg-gradient-to-t from-black via-60% via-black/50 to-black/0 text-sm lg:text-base flex-col md:flex-row md:gap-4 lg:gap-8 md:items-center md:bg-none md:bg-black/75 p-2 md:p-4">
          <VisibilityIcon isPublic={listDetails.public} showLabel />
          <StyledKeyValue
            label={"Created by:"}
            value={listDetails.created_by.username}
          />
          <StyledKeyValue
            label={"Shows Count:"}
            value={listDetails.item_count}
          />
          <StyledKeyValue
            label={"Total Runtime:"}
            value={getDurationString(listDetails.runtime)}
          />
          <StyledKeyValue
            className="items-center"
            label={"Average Rating:"}
            value={<FiveStarRating rating={listDetails.average_rating} />}
          />
        </div>
      </div>
    </div>
  );
};

export default ListDetailsSection;
