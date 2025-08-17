import React, { ReactNode } from "react";

const positionStyles = {
  top: "top-20 left-[50%]",
  center: "left-[50%] right-[50%]",
};

const accentColorStyles = {
  success: "from-green-400/30 to-green-400/0",
  warning: "from-amber-400/30 to-amber-400/0",
  error: "from-red-500/30 to-red-500/0",
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
      className={`fade-in fixed ${positionStyles[position]} w-max shadow-xl shadow-black/75 font-bold rounded-sm overflow-hidden transform translate-[-50%] py-4 px-8 bg-stone-950 text-white z-9999999`}
    >
      <div
        className={`absolute inset-0 bg-linear-to-r to-20% ${accentColorStyles[accentColor]}`}
      ></div>
      {children}
    </div>
  );
};

export default Toast;
