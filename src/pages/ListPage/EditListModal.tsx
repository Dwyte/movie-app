import React, { useState } from "react";
import ModalContainer from "../../components/ModalContainer";
import { ListDetails, ListOptions, Media } from "../../misc/types";
import { getTMDBImageURL } from "../../misc/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putUpdateList } from "../../misc/tmdbAPI";
import { useAuth } from "../../contexts/AuthContext";
import { EditListState } from "./ListPage";
import DisableBodyScroll from "../../components/DisableBodyScroll";
import EditListBackdrop from "./EditListBackdrop";

interface Props {
  listDetails: ListDetails;
  listResults: Media[];
  currentState: EditListState | null;
  onClose: () => void;
}

const ListBackdropEdit = ({
  listDetails,
  listResults,
  currentState,
  onClose,
}: Props) => {
  const queryClient = useQueryClient();
  const { authDetails } = useAuth();

  const [listOptions, setListOptions] = useState<Partial<ListOptions>>({});

  const updateListBackdrop = useMutation({
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

  if (currentState === null) return null;
  if (!authDetails) return null;

  return (
    <ModalContainer onClose={onClose}>
      <DisableBodyScroll />
      <div className="flex flex-col gap-4">
        {currentState === EditListState.BACKDROP && (
          <EditListBackdrop
            setListOptions={setListOptions}
            currentListBackdrop={listDetails.backdrop_path}
            listResults={listResults}
          />
        )}

        <div className="flex h-12 text-lg flex-row-reverse [&>*]:flex-1 gap-2">
          <button
            onClick={() => updateListBackdrop.mutate()}
            className="primary-btn justify-center"
          >
            Save
          </button>
          <button onClick={onClose} className="secondary-btn justify-center">
            Cancel
          </button>
        </div>
      </div>
    </ModalContainer>
  );
};

export default ListBackdropEdit;
