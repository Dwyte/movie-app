import React, { useState } from "react";
import { getTMDBImageURL } from "../../misc/utils";
import { ListDetails, ListOptions, Media } from "../../misc/types";
import EmptyListPlaceholder from "./EmptyListPlaceholder";

interface Props {
  currentListBackdrop: string;
  listResults: Media[];
  setListOptions: (listOptions: Partial<ListOptions>) => void;
}

const EditListBackdrop = ({
  currentListBackdrop,
  listResults,
  setListOptions,
}: Props) => {
  const [selectedBackdrop, setSelectedBackdrop] = useState(currentListBackdrop);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="m-0">Choose Cover Photo:</h2>
      <fieldset
        className={`grid grid-cols-1 max-w-200 gap-2 max-h-120 scrollable p-1 rounded-sm focus-within:outline-2 outline-blue-200 ${
          listResults.length === 2 && "grid-cols-2"
        } ${listResults.length > 3 && "grid-cols-2 sm:grid-cols-3"}
        `}
      >
        {listResults.length === 0 && <EmptyListPlaceholder />}
        {listResults.map((media) => {
          if (!media.backdrop_path) return;

          const handleClick = () => {
            setSelectedBackdrop(media.backdrop_path);
            setListOptions({ backdrop_path: media.backdrop_path });
          };

          return (
            <label
              key={media.id}
              htmlFor={media.id.toString()}
              className="relative flex items-center justify-center cursor-pointer hover:brightness-75 transition duration-200"
            >
              <input
                id={media.id.toString()}
                type="radio"
                name="listBackdrop"
                className="sr-only peer"
                checked={selectedBackdrop === media.backdrop_path}
                onChange={handleClick}
              />
              <img
                className="rounded-sm"
                src={getTMDBImageURL(media.backdrop_path)}
              />

              <div className="hidden peer-checked:block absolute bg-black font-bold text-white w-full p-1 text-center sm:p-2 sm:text-lg">
                SELECTED
              </div>
            </label>
          );
        })}
      </fieldset>
    </div>
  );
};

export default EditListBackdrop;
