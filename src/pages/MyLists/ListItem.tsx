import { ReactNode } from "react";
import ListItemHoverIndicator from "./ListItemHoverIndicator";

interface Props {
  children: ReactNode;
}

const ListItem = ({ children }: Props) => {
  return (
    <div className="group sm:flex sm:items-center sm:gap-4 text-white py-1 cursor-pointer sm:border-b-stone-800 sm:border-b-1 sm:py-[2px] hover:bg-stone-700/50">
      <ListItemHoverIndicator />
      {children}
      <ListItemHoverIndicator />
    </div>
  );
};

export default ListItem;
