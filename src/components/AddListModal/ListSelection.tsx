import { useQuery } from "@tanstack/react-query";
import { BsGlobeAmericas, BsLockFill, BsPlusLg, BsXLg } from "react-icons/bs";
import { useAuth } from "../../contexts/AuthContext";
import { getAccountLists, postListAddItems } from "../../misc/tmdbAPI";
import { MediaRef } from "../../misc/types";

interface Props {
  mediaRef: MediaRef;
  onCreate: () => void;
  onClose: () => void;
}

const ListSelection = ({ mediaRef, onCreate, onClose }: Props) => {
  const { authDetails, isLoggedIn } = useAuth();

  const { data: userLists } = useQuery({
    enabled: isLoggedIn,
    initialData: null,
    queryKey: ["lists", authDetails?.accountId],
    queryFn: async () => {
      if (!authDetails) return null;

      const response = await getAccountLists(
        authDetails.accessToken,
        authDetails.accountId
      );

      return response.results;
    },
  });

  const handleSelect = async (listId: number) => {
    if (!authDetails) return;

    const response = await postListAddItems(authDetails?.accessToken, listId, [
      mediaRef,
    ]);

    if (response.success) {
      alert(response.status_message);
    } else {
      console.error(response);
    }

    onClose();
  };

  return (
    <>
      <div className="text-white flex items-start">
        <h3 className="text-2xl flex-1 font-bold sm:text-xl">
          Add Media to...
        </h3>
        <button className="cursor-pointer" onClick={onClose}>
          <BsXLg className="text-xl" />
        </button>
      </div>
      <div className="flex flex-col flex-1 max-h-75 scrollable gap-2 sm:overflow-y">
        {userLists &&
          userLists.map((listItem) => {
            return (
              <button
                key={listItem.id}
                onClick={() => handleSelect(listItem.id)}
                className="secondary-btn rounded-sm text-white font-normal text-lg p-4 sm:text-base sm:p-3"
              >
                <span className="flex-1 text-left">{listItem.name}</span>
                {listItem.public ? <BsGlobeAmericas /> : <BsLockFill />}
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

export default ListSelection;
