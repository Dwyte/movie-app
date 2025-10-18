import React, { ReactNode, useCallback } from "react";
import { useFocusTrap } from "../hooks/useFocusTrap";

const positionStyles = {
  top: "top-20 left-[50%]",
  center: "left-[50%] top-[50%]",
};

const accentColorStyles = {
  success: "from-green-900 via-green-900/50 to-stone-900",
  warning: "from-amber-900 via-amber-900/50 to-stone-900",
  error: "from-red-900 via-red-900/50 to-stone-900",
};

export type ToastAccentColor = keyof typeof accentColorStyles;

export type ToastPosition = keyof typeof positionStyles;

interface Props {
  children: ReactNode;
  position: ToastPosition;
  accentColor: ToastAccentColor;
}

const Toast = ({ children, position, accentColor }: Props) => {
  return (
    <div
      className={`fade-in fixed bg-linear-to-r via-10% to-30% bg-stone-900 ${accentColorStyles[accentColor]} ${positionStyles[position]} w-max shadow-xl shadow-black/75 font-bold  overflow-hidden transform translate-[-50%] p-6 text-white z-100`}
    >
      <div>{children}</div>
    </div>
  );
};

export const ToastConfirmation = ({
  message,
  status,
  onCancel,
  onConfirm,
}: {
  message: string;
  status: ToastAccentColor;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  const { initializeFocusTrap, focusFirstElement } = useFocusTrap();

  const refCallback = useCallback((node: HTMLDivElement) => {
    if (node) {
      initializeFocusTrap(node, onCancel);
      focusFirstElement(node);
    }
  }, []);

  return (
    <div
      ref={refCallback}
      className="modal-backdrop z-50 fade-in"
      onMouseDown={() => {
        onCancel();
      }}
    >
      <div onMouseDown={(e) => e.stopPropagation()}>
        <Toast accentColor={status} position="center">
          <div className="flex flex-col gap-4 min-w-75">
            <div className="text-xl">{message}</div>
            <div className="flex gap-2">
              <button
                className="btn flex-1 justify-center"
                onClick={onCancel}
                data-variant="secondary"
              >
                Cancel
              </button>
              <button
                className="btn flex-1 justify-center"
                onClick={onConfirm}
                data-variant="primary"
              >
                Yes
              </button>
            </div>
          </div>
        </Toast>
      </div>
    </div>
  );
};

export default Toast;
