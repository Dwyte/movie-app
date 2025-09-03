import React, { useCallback } from "react";
import { BsPlusLg, BsSend, BsStar } from "react-icons/bs";
import Skeleton from "../../components/Skeleton";
import { MediaDetails } from "../../misc/types";
import { useAddListModal } from "../../contexts/AddListModalContext";

const MobileButtonsSkeleton = () => {
  return (
    <div className="flex gap-2 h-14 sm:hidden">
      <Skeleton className="aspect-[1.4/1] h-full" />
      <Skeleton className="aspect-[1.4/1] h-full" />
      <Skeleton className="aspect-[1.4/1] h-full" />
    </div>
  );
};

interface Props {
  mediaItemDetails: MediaDetails | null | undefined;
}

const MediaPageMobileButtons = ({ mediaItemDetails }: Props) => {
  const { showAddListModal } = useAddListModal();

  const handleAddToList = useCallback(() => {
    if (!mediaItemDetails) return;

    showAddListModal({
      media_id: mediaItemDetails.id,
      media_type: mediaItemDetails.media_type,
    });
  }, [mediaItemDetails]);

  if (!mediaItemDetails) return <MobileButtonsSkeleton />;

  return (
    <div className="flex gap-2 sm:hidden">
      <button
        onClick={handleAddToList}
        className="flex flex-col justify-between items-center gap-1 px-3 py-2 min-w-16"
      >
        <BsPlusLg className="text-2xl p-[3px]" />
        <span className="text-sm">My Lists</span>
      </button>
      <button className="flex flex-col justify-between items-center px-3 py-2 min-w-16">
        <BsSend className="text-2xl p-[3px]" />
        <span className="text-sm">Share</span>
      </button>
      <button className="flex flex-col justify-between items-center px-3 py-2 min-w-16">
        <BsStar className="text-2xl p-[3px]" />
        <span className="text-sm">Rate</span>
      </button>
    </div>
  );
};

export default MediaPageMobileButtons;
