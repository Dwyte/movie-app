import React from "react";
import Skeleton from "../../components/Skeleton";

interface Props {
  count?: number;
  className?: string;
}

const ListSkeleton = ({ count = 12, className = "" }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: count }).map((v, k) => (
        <Skeleton key={k} className={className || "h-20 w-full"} />
      ))}
    </div>
  );
};

export default ListSkeleton;
