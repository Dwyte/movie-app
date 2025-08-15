import React, { useState } from "react";
import { MediaCreditsAPIResult } from "../../misc/types";
import { getTMDBImageURL } from "../../misc/utils";
import Skeleton from "../../components/Skeleton";

interface Props {
  mediaItemCredits: MediaCreditsAPIResult | null;
}

const CastSkeleton = ({ className }: React.ComponentProps<"div">) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Skeleton className="aspect-square" />
      <Skeleton className="h-6 w-[80%]" />
      <Skeleton className="h-6 w-[50%]" />
    </div>
  );
};

const MediaPageCastsSection = ({ mediaItemCredits }: Props) => {
  const [doneLoadingCount, setDoneLoadingCount] = useState(0);

  const mediaItemCasts = mediaItemCredits?.cast.slice(0, 10);

  const isLoadingImages =
    !mediaItemCasts || doneLoadingCount !== mediaItemCasts.length;

  return (
    <div>
      <div className="grid gap-4 grid-cols-2 mt-4 sm:grid-cols-4">
        {/** Optimistic Skeletons even before mediaItemCredits are fetched  */}
        {!mediaItemCredits &&
          Array.from({ length: 9 }, (_, k) => <CastSkeleton key={k} />)}

        {mediaItemCasts &&
          mediaItemCasts.map((cast) => {
            return (
              <div key={cast.id} className="relative">
                {/** Skeletons while we wait for all Images to load, then show all at the same time. */}
                {isLoadingImages && (
                  <CastSkeleton className="absolute inset-0" />
                )}
                <div
                  className={`flex flex-col gap-2 transition-opacity ${
                    isLoadingImages ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <img
                    className={`rounded-sm aspect-square object-cover`}
                    src={
                      cast.profile_path
                        ? getTMDBImageURL(cast.profile_path, "200")
                        : "/profile-picture.jpg"
                    }
                    onLoad={() => setDoneLoadingCount((p) => p + 1)}
                    alt={cast.name}
                  />
                  <div>
                    <p>{cast.name}</p>
                    <p className="text-stone-400">
                      {cast.character.replaceAll("'", "")}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      {mediaItemCredits && mediaItemCredits.cast.length === 0 && (
        <div className="text-lg text-stone-400 font-bold p-8 w-full text-center">
          No Data Available.
        </div>
      )}
    </div>
  );
};

export default MediaPageCastsSection;
