import { ReactNode } from "react";
import ListItemHoverIndicator from "./ListItemHoverIndicator";

interface Props {
  children: ReactNode;
  index: number;
}

const ListItemDiv = ({ children, index }: Props) => {
  return (
    <div className="text-white py-1 cursor-pointer sm:flex sm:items-center sm:gap-4 sm:border-b-[var(--list-border-color)] sm:border-b-1 sm:py-[2px] group-hover:bg-(image:--list-item-hover-bg) group-focus:bg-(image:--list-item-hover-bg) group-focus-within:bg-(image:--list-item-hover-bg)">
      <ListItemHoverIndicator />
      {index && (
        <div className="hidden sm:flex items-center justify-center text-stone-500 font-bold w-12">
          {index}
        </div>
      )}
      {children}
      <ListItemHoverIndicator />
    </div>
  );
};

export default ListItemDiv;
