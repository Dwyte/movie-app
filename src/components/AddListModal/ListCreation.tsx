import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { postCreateList, postListAddItems } from "../../misc/tmdbAPI";
import { MediaRef } from "../../misc/types";
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
  mediaRef: MediaRef;
  onClose: () => void;
}

const ListCreation = ({ mediaRef, onClose }: Props) => {
  const [listName, setListName] = useState("");
  const [isListPublic, setIsListPublic] = useState(true);

  const { authDetails } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (listName === "") {
      console.error("ListTitle can't be empty.");
      return;
    }

    if (!authDetails) {
      console.error("Unauthorized - No User Logged In");
      return;
    }

    const newList = await postCreateList(authDetails.accessToken, {
      name: listName,
      iso_639_1: "US",
      public: isListPublic ? 1 : 0,
    });

    if (!newList.success || !newList.id) {
      console.error("Something went wrong.", newList);
      return;
    }

    const addedItem = await postListAddItems(
      authDetails.accessToken,
      newList.id,
      [mediaRef]
    );

    if (addedItem.success) {
      alert("Added to the list.");
      onClose();
    }
  };

  return (
    <>
      <h3 className="text-2xl text-white font-bold sm:text-xl">New List</h3>
      <form action="" className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <input
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          className="w-full text-white p-4 bg-stone-700 rounded-sm outline-0"
          type="text"
          placeholder="Choose a Title"
          autoFocus
        />

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
                  checked={isListPublic === option.isPublic}
                  onChange={() => setIsListPublic(option.isPublic)}
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
                      isListPublic !== option.isPublic && "invisible"
                    }`}
                  />
                </div>
              </label>
            );
          })}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
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

export default ListCreation;
