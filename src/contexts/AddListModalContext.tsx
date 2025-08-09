import { createContext, ReactNode, useContext, useState } from "react";
import { MediaRef } from "../misc/types";
import AddListModal from "../components/AddListModal";

interface AddListModalContextValue {
  showAddListModal: (media: MediaRef) => void;
}

const AddListModalContext = createContext<AddListModalContextValue | undefined>(
  undefined
);

const AddListModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mediaToAdd, setMediaToAdd] = useState<MediaRef | null>();

  const showAddListModal = (media: MediaRef) => {
    setIsOpen(true);
    setMediaToAdd(media);
  };

  const handleCloseListModal = () => {
    setIsOpen(false);
    setMediaToAdd(null);
  };

  return (
    <AddListModalContext.Provider value={{ showAddListModal }}>
      {children}
      {isOpen && mediaToAdd && (
        <AddListModal mediaRef={mediaToAdd} onClose={handleCloseListModal} />
      )}
    </AddListModalContext.Provider>
  );
};

export const useAddListModal = () => {
  const ctx = useContext(AddListModalContext);
  if (!ctx) throw Error("useAddListModal must be used within AddListProvider");
  return ctx;
};

export default AddListModalProvider;
