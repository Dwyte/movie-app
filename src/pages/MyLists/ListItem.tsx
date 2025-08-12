import { ReactNode } from "react";
import ListItemHoverIndicator from "./ListItemHoverIndicator";

interface Props {
  children: ReactNode;
  index: number;
}

const ListItem = ({ children, index }: Props) => {
  return (
    <div className="group sm:flex sm:items-center sm:gap-4 text-white py-1 cursor-pointer sm:border-b-stone-800 sm:border-b-1 sm:py-[2px] hover:bg-stone-700/50">
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

export default ListItem;
