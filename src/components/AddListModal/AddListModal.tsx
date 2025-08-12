import { useEffect, useState } from "react";
import { MediaRef } from "../../misc/types";
import ListSelection from "./ListSelection";
import ListCreation from "./ListCreation";
import ModalContainer from "../ModalContainer";

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
    <ModalContainer onClose={handleClose}>
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
    </ModalContainer>
  );
};

export default AddListModal;
