import React, { useState } from "react";
import { getTMDBImageURL } from "../../misc/utils";
import { ListDetails, ListOptions, Media } from "../../misc/types";

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
      <div
        className={`grid grid-cols-1 max-w-200 gap-2 max-h-120 scrollable rounded-sm ${
          listResults.length === 2 && "grid-cols-2"
        } ${listResults.length > 3 && "grid-cols-2 sm:grid-cols-3"}
        `}
      >
        {listResults.map((media) => {
          if (!media.backdrop_path) return;

          const handleClick = () => {
            setSelectedBackdrop(media.backdrop_path);
            setListOptions({ backdrop_path: media.backdrop_path });
          };

          return (
            <div
              key={media.id}
              onClick={handleClick}
              className="relative flex items-center justify-center rounded-sm overflow-hidden cursor-pointer hover:brightness-75 transition duration-200"
            >
              <img
                className="rounded-sm"
                src={getTMDBImageURL(media.backdrop_path)}
              />

              {selectedBackdrop === media.backdrop_path && (
                <div className="absolute bg-black font-bold text-white w-full p-1 text-center sm:p-2 sm:text-lg">
                  SELECTED
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EditListBackdrop;
