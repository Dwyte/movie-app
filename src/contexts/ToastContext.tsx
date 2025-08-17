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
  const [currTimeoutId, setCurrTimeoutId] = useState<number>(0);

  const showToast = (
    message: ReactNode,
    status: ToastAccentColor = "success",
    position: ToastPosition = "top"
  ) => {
    clearTimeout(currTimeoutId);

    setAcitveToast(
      <Toast accentColor={status} position={position}>
        {message}
      </Toast>
    );

    const timeoutId = setTimeout(() => {
      setAcitveToast(null);
    }, 3000);

    setCurrTimeoutId(timeoutId);
  };

  const showConfirmation = (
    message: ReactNode,
    onConfirm: () => void,
    onCancel: () => void
  ) => {
    clearTimeout(currTimeoutId);

    const handleConfirm = () => {
      onConfirm();
      setAcitveToast(null);
    };

    const handleCancel = () => {
      onCancel();
      setAcitveToast(null);
    };

    setAcitveToast(
      <div
        className="fixed inset-0 bg-black/80 z-9999"
        onClick={() => {
          handleCancel();
        }}
      >
        <div onClick={(e) => e.stopPropagation()}>
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
                  onClick={handleConfirm}
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
