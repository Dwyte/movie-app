import { ReactNode } from "react";
import { useSelectContext } from "./Select";

type Props<T> = {
  value: T;
  children: ReactNode;
};

export const Option = <T,>({ value, children }: Props<T>) => {
  const { selected, onSelect } = useSelectContext<T>();
  const isSelected = selected === value;

  return (
    <div
      onClick={() => onSelect(value)}
      className={`p-2 cursor-pointer hover:bg-stone-900 ${isSelected ? "font-semibold bg-stone-900" : ""}`}
    >
      {children}
    </div>
  );
};
