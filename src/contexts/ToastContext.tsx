import React, {
  createContext,
  ReactNode,
  useContext,
  useRef,
  useState,
} from "react";
import Toast, {
  ToastAccentColor,
  ToastConfirmation,
  ToastPosition,
} from "../components/Toast";
import { useFocusTrap } from "../hooks/useFocusTrap";

interface ToastContextValue {
  showToast: (
    message: string,
    status?: ToastAccentColor,
    position?: ToastPosition
  ) => void;
  showConfirmation: (
    message: string,
    onConfirm: () => void,
    onCancel: () => void
  ) => void;
}

interface ToastObject {
  message: string;
  status?: ToastAccentColor;
  position?: ToastPosition;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [activeToast, setAcitveToast] = useState<ToastObject | null>(null);
  const refTimeoutId = useRef(0);

  const showToast = (
    message: string,
    status: ToastAccentColor = "success",
    position: ToastPosition = "top"
  ) => {
    clearTimeout(refTimeoutId.current);

    setAcitveToast({ message, status, position });

    const timeoutId = setTimeout(() => {
      setAcitveToast(null);
    }, 3000);

    refTimeoutId.current = timeoutId;
  };

  const showConfirmation = (
    message: string,
    onConfirm: () => void,
    onCancel: () => void
  ) => {
    clearTimeout(refTimeoutId.current);

    setAcitveToast({
      message,
      onConfirm: () => {
        onConfirm();
        setAcitveToast(null);
      },
      onCancel: () => {
        onCancel();
        setAcitveToast(null);
      },
    });
  };

  return (
    <ToastContext.Provider value={{ showToast, showConfirmation }}>
      {activeToast &&
        (activeToast.onCancel && activeToast.onConfirm ? (
          <ToastConfirmation
            message={activeToast.message}
            status="error"
            onCancel={activeToast.onCancel}
            onConfirm={activeToast.onConfirm}
          />
        ) : (
          <Toast accentColor={activeToast.status!} position="top">
            {activeToast.message}
          </Toast>
        ))}

      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw Error("Must useToast inside ToastProvider.");
  return ctx;
};
