import React, { useState } from "react";
import { BsPlusLg } from "react-icons/bs";
import Select, { Option } from "./Select";
import { Media } from "../misc/types";

const lists = [
  {
    id: 1,
    name: "Comfort Movies",
  },
  {
    id: 2,
    name: "My Top Recommended",
  },
  {
    id: 3,
    name: "Watch Later",
  },
];

const ListCreation = ({ onCancel }: { onCancel: () => void }) => {
  return (
    <>
      <h3 className="text-2xl text-white font-bold sm:text-xl">New List</h3>
      <form action="" className="flex flex-col gap-2 ">
        <input
          className="w-full text-white p-4 bg-stone-700 rounded-sm outline-0"
          type="text"
          placeholder="Choose a Title"
          autoFocus
        />

        <div className="rounded-sm overflow-hidden">
          <label htmlFor="1" className="block cursor-pointer">
            <input
              id="1"
              className="hidden peer"
              type="radio"
              name="visibility"
            />
            <div className="text-white flex flex-col bg-stone-700 px-4 py-2 peer-checked:bg-stone-500">
              <span className="">Public</span>
              <span className="text-xs">
                Anyone who has access to the URL can view your list.
              </span>
            </div>
          </label>
          <label htmlFor="2" className="block cursor-pointer">
            <input
              id="2"
              className="hidden peer"
              type="radio"
              name="visibility"
            />
            <div className="text-white flex flex-col bg-stone-700 px-4 py-2 peer-checked:bg-stone-500">
              <span className="">Private</span>
              <span className="text-xs">Only you can view the list.</span>
            </div>
          </label>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="secondary-btn flex-1 justify-center p-4"
          >
            <span>Cancel</span>
          </button>
          <input type="submit" className="primary-btn flex-1" value="Create" />
        </div>
      </form>
    </>
  );
};

const ListSelection = ({ onCreate }: { onCreate: () => void }) => {
  return (
    <>
      <h3 className="text-2xl text-white font-bold sm:text-xl">
        Add Media to...
      </h3>
      <div className="flex flex-col flex-1 gap-2 sm:overflow-y">
        {lists.map((item) => {
          return (
            <button
              key={item.id}
              className="secondary-btn font-normal rounded-sm text-white text-xl p-4 sm:text-base sm:p-3"
            >
              {item.name}
            </button>
          );
        })}
      </div>
      <button
        onClick={onCreate}
        className="primary-btn p-4 justify-center gap-1 text-lg text-center rounded-sm sm:text-base sm:p-3"
      >
        <BsPlusLg className="text-2xl sm:text-xl" />
        <span>Create New List</span>
      </button>
    </>
  );
};

enum AddListModalStates {
  LIST_SELECTION,
  LIST_CREATION,
}

interface Props {
  media: Object;
  onClose: () => void;
}

const AddListModal = ({ media, onClose }: Props) => {
  const [currentState, setCurrentState] = useState<AddListModalStates>(
    AddListModalStates.LIST_SELECTION
  );

  const handleCreateNewList = () => {
    setCurrentState(AddListModalStates.LIST_CREATION);
  };

  const handleCancel = () => {
    setCurrentState(AddListModalStates.LIST_SELECTION);
    onClose();
  };

  return (
    <div
      onClick={handleCancel}
      className="fixed flex items-center justify-center inset-0 bg-black/50 z-90009"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="fixed left-0 right-0 bottom-0 flex flex-col gap-4 bg-stone-900 rounded-t-xl p-6 sm:gap-2 sm:static sm: min-w-100 sm:rounded-lg"
      >
        {currentState === AddListModalStates.LIST_SELECTION && (
          <ListSelection onCreate={handleCreateNewList} />
        )}
        {currentState === AddListModalStates.LIST_CREATION && (
          <ListCreation onCancel={handleCancel} />
        )}
      </div>
    </div>
  );
};

export default AddListModal;
