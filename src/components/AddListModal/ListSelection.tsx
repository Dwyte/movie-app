import { useQuery } from "@tanstack/react-query";
import { BsPlusLg } from "react-icons/bs";
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
      <h3 className="text-2xl text-white font-bold sm:text-xl">
        Add Media to...
      </h3>
      <div className="flex flex-col flex-1 max-h-75 scrollable gap-2 sm:overflow-y">
        {userLists &&
          userLists.map((listItem) => {
            return (
              <button
                key={listItem.id}
                onClick={() => handleSelect(listItem.id)}
                className="secondary-btn font-normal rounded-sm text-white text-xl p-4 sm:text-base sm:p-3"
              >
                {listItem.name}
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
