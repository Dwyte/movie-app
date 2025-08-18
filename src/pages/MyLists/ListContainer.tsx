import React from "react";

const ListContainer = ({
  className,
...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      {...props}
      className={className || "shrink-0 flex flex-col sm:border-t-stone-800 sm:border-t-1"}
    />
  );
};

export default ListContainer;
