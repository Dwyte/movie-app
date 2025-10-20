import React, { useCallback } from "react";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { BsXLg } from "react-icons/bs";

type Props = React.ComponentProps<"div"> & {
  modalTitle: string;
  onClose: () => void;
};

const ModalContainer = ({ modalTitle, children, onClose, ...rest }: Props) => {
  const { focusFirstElement, initializeFocusTrap } = useFocusTrap();

  const refCallback = useCallback((node: HTMLDivElement) => {
    if (node) {
      initializeFocusTrap(node, onClose);
      focusFirstElement(node);
    }
  }, []);

  return (
    <div
      ref={refCallback}
      onMouseDown={onClose}
      className="flex items-center justify-center z-50 modal-backdrop fade-in"
      {...rest}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className="fixed left-0 right-0 bottom-0 flex flex-col bg-[var(--main-bg)] sm:static sm:min-w-150 overflow-hidden"
      >
        <div className="flex items-center justify-between px-8 py-6 bg-[#101010]">
          <h2 className="m-0">{modalTitle}</h2>
          <button onClick={onClose} className="btn " data-variant="secondary">
            <BsXLg />
          </button>
        </div>
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
};

export default ModalContainer;
