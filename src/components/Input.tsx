import React from "react";

type Props = React.ComponentProps<"input"> & { label: string };

const Input = ({ label, id, ...rest }: Props) => {
  return (
    <label htmlFor={id}>
      <span className="font-bold inline-block mb-2">{label}</span>
      <input
        id={id}
        className="w-full text-white px-4 py-4 bg-[var(--input-bg)] rounded-sm outline-0 focus-visible:outline"
        {...rest}
      />
    </label>
  );
};

export default Input;
