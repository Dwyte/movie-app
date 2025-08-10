import { useEffect, useState } from "react";
import { MediaRef } from "../../misc/types";
import ListSelection from "./ListSelection";
import ListCreation from "./ListCreation";

enum AddListModalStates {
  LIST_SELECTION,
  LIST_CREATION,
}

interface Props {
  mediaRef: MediaRef;
  onClose: () => void;
}

const AddListModal = ({ mediaRef, onClose }: Props) => {
  const [currentState, setCurrentState] = useState<AddListModalStates>(
    AddListModalStates.LIST_SELECTION
  );

  const handleCreateNewList = () => {
    setCurrentState(AddListModalStates.LIST_CREATION);
  };

  const handleClose = () => {
    setCurrentState(AddListModalStates.LIST_SELECTION);
    onClose();
  };

  // Disable main body scrolling
  useEffect(() => {
    document.body.style.overflowY = "hidden";
    return () => {
      document.body.style.overflowY = "scroll";
    };
  }, []);

  return (
    <div
      onClick={handleClose}
      className="fixed flex items-center justify-center inset-0 bg-black/50 z-90009"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="fixed left-0 right-0 bottom-0 flex flex-col bg-stone-900 rounded-t-xl p-6 sm:gap-2 sm:static sm: min-w-100 sm:rounded-lg"
      >
        {currentState === AddListModalStates.LIST_SELECTION && (
          <ListSelection
            mediaRef={mediaRef}
            onCreate={handleCreateNewList}
            onClose={handleClose}
          />
        )}
        {currentState === AddListModalStates.LIST_CREATION && (
          <ListCreation mediaRef={mediaRef} onClose={handleClose} />
        )}
      </div>
    </div>
  );
};

export default AddListModal;
