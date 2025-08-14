import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BsPlusLg, BsXLg } from "react-icons/bs";
import { useAuth } from "../../contexts/AuthContext";
import { getAccountLists, postListAddItems } from "../../misc/tmdbAPI";
import { List, MediaRef } from "../../misc/types";
import { MEDIA_TYPE_NAME } from "../../misc/constants";
import VisibilityIcon from "../VisibilityIcon";
import ListSkeleton from "../../pages/ListPage/ListSkeleton";
import EmptyListPlaceholder from "../../pages/ListPage/EmptyListPlaceholder";

interface Props {
  mediaRef: MediaRef;
  onCreate: () => void;
  onClose: () => void;
}

const ListSelection = ({ mediaRef, onCreate, onClose }: Props) => {
  const { authDetails, isLoggedIn } = useAuth();
  const queryClient = useQueryClient();

  const { data: userLists, isLoading } = useQuery<List[]>({
    enabled: isLoggedIn,
    queryKey: ["lists", authDetails?.accountId],
    queryFn: async () => {
      if (!authDetails) throw Error();

      const paginatedUserLists: List[][] = [];
      let totalPages = 1;
      for (let page = 1; page <= totalPages; page++) {
        const response = await getAccountLists(
          authDetails.accessToken,
          authDetails.accountId,
          page
        );

        totalPages = response.total_pages;
        queryClient.setQueryData(
          ["lists", authDetails.accountId, page],
          response
        );
        paginatedUserLists.push(response.results);
      }

      return paginatedUserLists.flat();
    },
  });

  const listAddItemsMutation = useMutation({
    mutationFn: (listId: number) => {
      if (!authDetails) throw Error("Unauthorized");
      return postListAddItems(authDetails.accessToken, listId, [mediaRef]);
    },
    onMutate: (listId: number) => {
      queryClient.invalidateQueries({ queryKey: ["listDetails", listId] });
      queryClient.invalidateQueries({ queryKey: ["listResults", listId] });
    },
    onSuccess: (response) => {
      alert(response.status_message);
      onClose();
    },
  });

  const handleSelect = (listId: number) => listAddItemsMutation.mutate(listId);

  const renderList = () => {
    if (isLoading) {
      return <ListSkeleton className="h-12" count={10} />;
    }

    if (userLists && userLists.length > 0) {
      return userLists.map((listItem) => (
        <button
          key={listItem.id}
          onClick={() => handleSelect(listItem.id)}
          className="secondary-btn rounded-sm text-white font-normal text-lg p-4 sm:text-base sm:p-3"
        >
          <span className="flex-1 text-left">{listItem.name}</span>
          <VisibilityIcon isPublic={listItem.public === 1} />
        </button>
      ));
    }

    return <EmptyListPlaceholder />;
  };

  return (
    <>
      <div className="text-white flex items-start">
        <h3 className="text-2xl flex-1 font-bold sm:text-xl">
          Add {MEDIA_TYPE_NAME[mediaRef.media_type]} to...
        </h3>
        <button className="cursor-pointer" onClick={onClose}>
          <BsXLg className="text-xl" />
        </button>
      </div>
      <div className="flex flex-col flex-1 max-h-75 scrollable gap-2 sm:overflow-y">
        {renderList()}
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
