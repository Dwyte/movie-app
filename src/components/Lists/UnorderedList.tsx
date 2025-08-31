import React from "react";

const UnorderedList = ({ className, ...props }: React.ComponentProps<"ul">) => {
  return (
    <ul
      {...props}
      className={
        className ||
        "shrink-0 flex flex-col sm:border-t-[var(--list-border-color)] sm:border-t-1"
      }
    />
  );
};

export default UnorderedList;
