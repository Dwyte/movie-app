import React, { createContext, ReactNode, useContext, useState } from "react";
import Toast, { ToastAccentColor, ToastPosition } from "../components/Toast";

interface ToastContextValue {
  showToast: (
    message: ReactNode,
    status?: ToastAccentColor,
    position?: ToastPosition
  ) => void;
  showConfirmation: (
    message: ReactNode,
    onConfirm: () => void,
    onCancel: () => void
  ) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [activeToast, setAcitveToast] = useState<ReactNode | null>(null);

  const showToast = (
    message: ReactNode,
    status: ToastAccentColor = "success",
    position: ToastPosition = "top"
  ) => {
    setAcitveToast(
      <Toast accentColor={status} position={position}>
        {message}
      </Toast>
    );

    setTimeout(() => {
      setAcitveToast(null);
    }, 3000);
  };

  const showConfirmation = (
    message: ReactNode,
    onConfirm: () => void,
    onCancel: () => void
  ) => {
    const handleCancel = () => {
      onCancel();
      setAcitveToast(null);
    };

    setAcitveToast(
      <div
        className="fixed inset-0 bg-black/80 z-9999"
        onClick={(e) => {
          handleCancel();
          e.stopPropagation();
        }}
      >
        <Toast accentColor="error" position="center">
          <div className="flex flex-col gap-4 min-w-75">
            <div className="text-xl">{message}</div>
            <div className="flex gap-2">
              <button
                className="secondary-btn flex-1 justify-center"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="primary-btn flex-1 justify-center"
                onClick={onConfirm}
              >
                Yes
              </button>
            </div>
          </div>
        </Toast>
      </div>
    );
  };

  return (
    <ToastContext.Provider value={{ showToast, showConfirmation }}>
      {activeToast} {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw Error("Must useToast inside ToastProvider.");
  return ctx;
};
