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
        isVisible ? "hidden group-hover/root:flex z-50" : "hidden"
      } absolute items-center text-white ${styles[direction]}`}
    >
      <button
        onClick={onClick}
        className="btn  p-2 cursor-pointer"
        data-variant="secondary"
      >
        <Icon className="text-xl" />
      </button>
    </div>
  );
};

export default ScrollButton;
