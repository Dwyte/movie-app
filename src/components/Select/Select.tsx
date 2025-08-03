import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { BsChevronDown } from "react-icons/bs";

type SelectContextType<SelectValueType> = {
  selected: SelectValueType | null;
  onSelect: (value: SelectValueType) => void;
};

const SelectContext = createContext<SelectContextType<any> | null>(null);

type Props<SelectValueType> = {
  value: SelectValueType;
  selectedLabel: string;
  onChange: (value: SelectValueType) => void;
  children: ReactNode;
};

const Select = <SelectValueType,>({
  selectedLabel,
  value,
  onChange,
  children,
}: Props<SelectValueType>) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value: SelectValueType) => {
    setIsOpen(false);
    onChange(value);
  };

  return (
    <SelectContext.Provider value={{ selected: value, onSelect: handleSelect }}>
      <div ref={ref} className="relative">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full flex items-center gap-2 p-2 border border-stone-400 rounded-sm bg-black/0 shadow-sm text-left cursor-pointer"
        >
          <span className="flex-1">{selectedLabel || "Select an option"}</span>
          <BsChevronDown />
        </button>
        {isOpen && (
          <div className="w-full absolute z-10 mt-1 bg-black border border-stone-400 rounded-sm shadow-md max-h-60 scrollable">
            {children}
          </div>
        )}
      </div>
    </SelectContext.Provider>
  );
};

export default Select;

// Re-export context for use in CustomOption
export function useSelectContext<T>() {
  const context = useContext(
    SelectContext as React.Context<SelectContextType<T> | null>
  );
  if (!context) {
    throw new Error("CustomOption must be used within CustomSelect");
  }
  return context;
}
