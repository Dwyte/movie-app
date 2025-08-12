import React, { useState } from "react";
import ModalContainer from "../../components/ModalContainer";
import { ListDetails, Media } from "../../misc/types";
import { getTMDBImageURL } from "../../misc/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putUpdateList } from "../../misc/tmdbAPI";
import { useAuth } from "../../contexts/AuthContext";
import { EditListState } from "./ListPage";
import DisableBodyScroll from "../../components/DisableBodyScroll";

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

  const [selectedBackdrop, setSelectedBackdrop] = useState(
    listDetails.backdrop_path
  );

  const updateListBackdrop = useMutation({
    mutationFn: async () => {
      if (!authDetails) return;

      await putUpdateList(authDetails?.accessToken, listDetails.id, {
        backdrop_path: selectedBackdrop,
      });
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
        <h2 className="m-0">Choose Cover Photo:</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 max-w-200 gap-2 max-h-120 scrollable rounded-sm">
          {listResults.map((media) => {
            if (!media.backdrop_path) return;
            return (
              <div
                key={media.id}
                onClick={() => setSelectedBackdrop(media.backdrop_path)}
                className="relative flex items-center justify-center rounded-sm overflow-hidden cursor-pointer hover:brightness-75 transition duration-200"
              >
                <img
                  className="rounded-sm"
                  src={getTMDBImageURL(media.backdrop_path)}
                />

                {selectedBackdrop === media.backdrop_path && (
                  <div className="absolute bg-black font-bold text-white w-full p-1 text-center sm:p-2 sm:text-lg">
                    SELECTED
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => updateListBackdrop.mutate()}
            className="primary-btn"
          >
            Save
          </button>
          <button onClick={onClose} className="secondary-btn">
            Cancel
          </button>
        </div>
      </div>
    </ModalContainer>
  );
};

export default ListBackdropEdit;
