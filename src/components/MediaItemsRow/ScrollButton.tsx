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
  left: "justify-start left-0 bg-linear-to-r pl-2",
  right: "justify-end right-0 bg-linear-to-l pr-2",
};

const ScrollButton = ({ direction, onClick, isVisible = true }: Props) => {
  const Icon = icons[direction];
  return (
    <div
      className={`${
        isVisible ? "hidden group-hover/root:flex z-100" : "hidden"
      } absolute items-center text-white ${styles[direction]}`}
    >
      <button
        onClick={onClick}
        className="btn rounded-full p-2 cursor-pointer"
        data-variant="secondary-icon"
      >
        <Icon className="text-xl" />
      </button>
    </div>
  );
};

export default ScrollButton;
