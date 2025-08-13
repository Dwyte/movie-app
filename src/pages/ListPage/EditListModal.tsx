import React, { useEffect, useState } from "react";
import ModalContainer from "../../components/ModalContainer";
import { ListDetails, ListOptions, Media, MediaRef } from "../../misc/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putUpdateList, putUpdateListItem } from "../../misc/tmdbAPI";
import { useAuth } from "../../contexts/AuthContext";
import { EditListState } from "./ListPage";
import DisableBodyScroll from "../../components/DisableBodyScroll";
import EditListBackdrop from "./EditListBackdrop";
import EditListDetails from "./EditListDetails";
import EditListItemComment from "./EditListItemComment";

interface Props {
  listDetails: ListDetails;
  listResults: Media[];
  currentState: EditListState;
  onClose: () => void;
  listItem: Media | null;
}

const EditListModal = ({
  listDetails,
  listResults,
  currentState,
  onClose,
  listItem,
}: Props) => {
  const queryClient = useQueryClient();
  const { authDetails } = useAuth();

  const [listOptions, setListOptions] = useState<Partial<ListOptions>>({});
  const [comment, setComment] = useState<string>("");

  useEffect(() => {
    // Set default comment
    const defaultCommentKey = `${listItem?.media_type}:${listItem?.id}`;
    setComment(listDetails.comments[defaultCommentKey] || "");

    // Empty ListOptions
    setListOptions({});
  }, []);

  const updateListDetails = useMutation({
    mutationFn: async () => {
      if (!authDetails) return;

      await putUpdateList(
        authDetails?.accessToken,
        listDetails.id,
        listOptions
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["listDetails", listDetails.id],
      });

      onClose();
    },
  });

  const updateListItem = useMutation({
    mutationFn: async () => {
      if (!authDetails) return;
      if (!listItem) return;

      const mediaRef = {
        media_id: listItem.id,
        media_type: listItem.media_type,
      };

      await putUpdateListItem(
        authDetails?.accessToken,
        listDetails.id,
        mediaRef,
        comment
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["listDetails", listDetails.id],
      });

      onClose();
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (currentState === EditListState.COMMENTS) {
      await updateListItem.mutate();
    } else {
      await updateListDetails.mutate();
    }
  };

  return (
    <ModalContainer onClose={onClose}>
      <DisableBodyScroll />
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {currentState === EditListState.BACKDROP && (
          <EditListBackdrop
            setListOptions={setListOptions}
            currentListBackdrop={listDetails.backdrop_path}
            listResults={listResults}
          />
        )}
        {currentState === EditListState.DETAILS && (
          <EditListDetails
            listDetails={listDetails}
            setListOptions={setListOptions}
          />
        )}
        {currentState === EditListState.COMMENTS && listItem && (
          <EditListItemComment
            listItem={listItem}
            comment={comment}
            setComment={setComment}
          />
        )}

        <div className="flex h-12 text-lg flex-row-reverse [&>*]:flex-1 gap-2">
          <input
            type="submit"
            className="primary-btn justify-center"
            value="Save"
          />
          <button onClick={onClose} className="secondary-btn justify-center">
            Cancel
          </button>
        </div>
      </form>
    </ModalContainer>
  );
};

export default EditListModal;
