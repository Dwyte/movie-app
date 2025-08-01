import React from "react";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";

interface Props {
  direction: "left" | "right";
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  isVisible: boolean;
}

const icons = {
  left: BsChevronCompactLeft,
  right: BsChevronCompactRight,
};

const styles = {
  left: "justify-start left-0 bg-linear-to-r from-black to-black/0",
  right: "justify-end right-0 bg-linear-to-l from-black to-black/0",
};

const ScrollButton = ({ direction, onClick, isVisible = true }: Props) => {
  const Icon = icons[direction];
  return (
    <div
      className={`${
        isVisible ? "hidden group-hover/root:flex z-5000" : "hidden"
      } absolute items-center text-white w-16 h-36 ${styles[direction]}`}
    >
      <button onClick={onClick} className="px-2 h-full cursor-pointer">
        <Icon className="text-2xl" />
      </button>
    </div>
  );
};

export default ScrollButton;
