import React from "react";

const Skeleton = ({ className }: { className: string }) => {
  return (
    <div
      role="status"
      aria-label="Loading..."
      className={`bg-stone-800 rounded-sm animate-pulse ${className}`}
    ></div>
  );
};

export default Skeleton;
