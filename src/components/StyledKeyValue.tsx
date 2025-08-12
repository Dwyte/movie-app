import { ReactNode } from "react";

type Props = React.ComponentProps<"div"> & {
  label: ReactNode;
  value: ReactNode;
};

const StyledKeyValue = ({ label, value, className, ...rest }: Props) => {
  return (
    <div className={`flex gap-2 ${className}`} {...rest}>
      <span className="text-stone-400">{label}</span>
      <span className="text-white">{value}</span>
    </div>
  );
};

export default StyledKeyValue;
