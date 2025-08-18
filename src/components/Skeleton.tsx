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
      className={`bg-[var(--skeleton-color)] animate-pulse ${className} ${rounded}`}
    ></div>
  );
};

export default Skeleton;
