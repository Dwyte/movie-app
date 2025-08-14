import React from "react";

const Skeleton = ({
  className,
  rounded = "rounded-sm",
}: {
  className?: string;
  rounded?: string;
}) => {
  return (
    <div
      role="status"
      aria-label="Loading..."
      className={`bg-stone-800 animate-pulse ${className} ${rounded}`}
    ></div>
  );
};

export default Skeleton;
