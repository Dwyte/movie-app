import clsx from "clsx";
import React from "react";

const PageContainer = (props: React.ComponentProps<"div">) => {
  return (
    <div
      {...props}
      className={clsx(
        "min-h-screen mx-4 sm:mx-20 border-x-1 border-[var(--list-border-color)]",
        props.className
      )}
    />
  );
};

export default PageContainer;
