import React from "react";
import { BsGlobeAmericas, BsLockFill } from "react-icons/bs";

const VisibilityIcon = ({
  isPublic,
  showLabel = false,
}: {
  isPublic: boolean;
  showLabel?: boolean;
}) => {
  const Icon = isPublic ? BsGlobeAmericas : BsLockFill;
  const label = isPublic ? "Public" : "Only Me";

  return (
    <div className="flex items-center gap-2">
      <Icon /> {showLabel && label}
    </div>
  );
};

export default VisibilityIcon;
