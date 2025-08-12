import React from "react";

type Props = React.ComponentProps<"div"> & { onClose: () => void };

const ModalContainer = ({ children, onClose, ...rest }: Props) => {
  return (
    <div
      onClick={onClose}
      className="fixed flex items-center justify-center inset-0 bg-black/50 z-90009"
      {...rest}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="fixed left-0 right-0 bottom-0 flex flex-col bg-stone-900 rounded-t-xl p-6 sm:gap-2 sm:static sm: min-w-100 sm:rounded-lg"
      >
        {children}
      </div>
    </div>
  );
};

export default ModalContainer;
