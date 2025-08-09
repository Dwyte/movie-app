import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { postCreateList, postListAddItems } from "../../misc/tmdbAPI";
import { MediaRef } from "../../misc/types";

interface Props {
  mediaRef: MediaRef;
  onClose: () => void;
}

const ListCreation = ({ mediaRef, onClose }: Props) => {
  const [listName, setListName] = useState("");
  const [isListPublic, setIsListPublic] = useState(true);

  const auth = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (listName === "") {
      console.error("ListTitle can't be empty.");
      return;
    }

    if (auth.accessToken === null) {
      console.error("Unauthorized - No AccessToken");
      return;
    }

    const newList = await postCreateList(auth.accessToken, {
      name: listName,
      iso_639_1: "US",
      public: isListPublic,
    });

    if (!newList.success || !newList.id) {
      console.error("Something went wrong.", newList);
      return;
    }

    const addedItem = await postListAddItems(auth.accessToken, newList.id, [
      mediaRef,
    ]);

    if (addedItem.success) {
      alert("Added to the list.");
      onClose();
      return;
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
          <label htmlFor="1" className="block cursor-pointer">
            <input
              id="1"
              className="hidden peer"
              type="radio"
              name="visibility"
              checked={isListPublic}
              onChange={() => setIsListPublic(true)}
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
              checked={!isListPublic}
              onChange={() => setIsListPublic(false)}
            />
            <div className="text-white flex flex-col bg-stone-700 px-4 py-2 peer-checked:bg-stone-500">
              <span className="">Private</span>
              <span className="text-xs">Only you can view the list.</span>
            </div>
          </label>
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
