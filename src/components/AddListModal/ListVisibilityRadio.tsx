import React from "react";
import { BsCheckLg } from "react-icons/bs";

const visibilityOptions = [
  {
    id: 14089520934,
    name: "Public",
    description: "Anyone who has access to the URL can view your list.",
    isPublic: true,
  },
  {
    id: 22914512502,
    name: "Private",
    description: "Only you can view this list.",
    isPublic: false,
  },
];

interface Props {
  value: boolean;
  onChange: (isPublic: boolean) => void;
}

const ListVisibilityRadio = ({ value, onChange }: Props) => {
  return (
    <div className="rounded-sm overflow-hidden">
      {visibilityOptions.map((option) => {
        return (
          <label
            key={option.id}
            htmlFor={option.id.toString()}
            className="block cursor-pointer"
          >
            <input
              id={option.id.toString()}
              className="hidden peer"
              type="radio"
              name="visibility"
              checked={value === option.isPublic}
              onChange={() => onChange(option.isPublic)}
            />
            <div className="text-white flex gap-2 items-center bg-stone-700 px-4 py-2 peer-checked:bg-stone-800">
              <div className="flex flex-col flex-1">
                <span className="">{option.name}</span>
                <span className="text-xs text-stone-300">
                  {option.description}
                </span>
              </div>
              <BsCheckLg
                className={`text-xl ${
                  value !== option.isPublic && "invisible"
                }`}
              />
            </div>
          </label>
        );
      })}
    </div>
  );
};

export default ListVisibilityRadio;
