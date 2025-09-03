import React, { useCallback } from "react";
import { useFocusTrap } from "../hooks/useFocusTrap";

type Props = React.ComponentProps<"div"> & { onClose: () => void };

const ModalContainer = ({ children, onClose, ...rest }: Props) => {
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
        className="fixed left-0 right-0 bottom-0 flex flex-col bg-stone-900 rounded-t-xl p-6 sm:gap-2 sm:static sm: min-w-100 sm:rounded-lg"
      >
        {children}
      </div>
    </div>
  );
};

export default ModalContainer;
