import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BsPlusLg, BsXLg } from "react-icons/bs";
import { useAuth } from "../../contexts/AuthContext";
import { getAccountLists, postListAddItems } from "../../misc/tmdbAPI";
import { List, MediaRef } from "../../misc/types";
import { MEDIA_TYPE_NAME } from "../../misc/constants";
import VisibilityIcon from "../VisibilityIcon";
import ListSkeleton from "../../pages/ListPage/ListSkeleton";
import EmptyListPlaceholder from "../../pages/ListPage/EmptyListPlaceholder";
import { useToast } from "../../contexts/ToastContext";

interface Props {
  mediaRef: MediaRef;
  onCreate: () => void;
  onClose: () => void;
}

const ListSelection = ({ mediaRef, onCreate, onClose }: Props) => {
  const { authDetails, isLoggedIn } = useAuth();
  const queryClient = useQueryClient();

  const { showToast } = useToast();

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
      const mediaTypeTitle =
        mediaRef.media_type.charAt(0).toUpperCase() +
        mediaRef.media_type.slice(1).toLowerCase();

      if (response.results[0].success) {
        showToast(`${mediaTypeTitle} has been added to the list.`, "success");
      } else {
        showToast(`${mediaTypeTitle} is already on the list.`, "warning");
      }
      onClose();
    },
  });

  const handleSelect = (listId: number) => listAddItemsMutation.mutate(listId);

  const renderList = () => {
    if (isLoading) {
      return <ListSkeleton className="h-15" count={10} />;
    }

    if (userLists && userLists.length > 0) {
      return userLists.map((listItem) => (
        <button
          key={listItem.id}
          onClick={() => handleSelect(listItem.id)}
          className="btn  text-white font-normal text-lg p-4 sm:text-base sm:p-4"
          data-variant="secondary"
        >
          <span className="flex-1 text-left">{listItem.name}</span>
          <VisibilityIcon isPublic={listItem.public === 1} />
        </button>
      ));
    }

    return <EmptyListPlaceholder />;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-[#101010] ">
        <div className="flex flex-col flex-1 max-h-75 p-2 gap-2 sm:overflow-y scrollable">
          {renderList()}
        </div>
      </div>
      <button
        onClick={onCreate}
        className="btn p-4 justify-center gap-1 text-lg text-center  sm:text-base sm:p-4"
        data-variant="primary"
      >
        <BsPlusLg className="text-2xl sm:text-xl" />
        <span>Create New List</span>
      </button>
    </div>
  );
};

export default ListSelection;
