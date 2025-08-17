import React, { ReactNode } from "react";

const positionStyles = {
  top: "top-20 left-[50%]",
  center: "left-[50%] top-[50%]",
};

const accentColorStyles = {
  success: "from-green-900 via-stone-900",
  warning: "from-amber-900 via-stone-900",
  error: "from-red-900 via-stone-900",
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
      className={`fade-in fixed bg-linear-to-t via-40% to-100% to-stone-900 ${accentColorStyles[accentColor]} ${positionStyles[position]} w-max shadow-xl shadow-black/75 font-bold rounded-sm overflow-hidden transform translate-[-50%] p-6 text-white z-9999999`}
    >
      <div>{children}</div>
    </div>
  );
};

export default Toast;
