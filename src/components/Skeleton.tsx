import React from "react";

const Skeleton = ({
  className,
  rounded,
}: {
  className?: string;
  rounded?: string;
}) => {
  return (
    <div
      role="status"
      aria-label="Loading..."
      className={`bg-[var(--skeleton-color)] animate-pulse ${className}`}
    ></div>
  );
};

export default Skeleton;
