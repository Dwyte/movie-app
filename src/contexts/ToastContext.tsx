import React, { createContext, ReactNode, useContext, useState } from "react";
import Toast, { ToastAccentColor, ToastPosition } from "../components/Toast";

interface ToastContextValue {
  showToast: (
    message: ReactNode,
    status?: ToastAccentColor,
    position?: ToastPosition
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

  return (
    <ToastContext.Provider value={{ showToast: showToast }}>
      {activeToast} {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  console.log(ctx);
  if (!ctx) throw Error("Must useToast inside ToastProvider.");
  return ctx;
};
