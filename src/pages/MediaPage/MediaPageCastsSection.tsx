import React from "react";
import { MediaCreditsAPIResult } from "../../misc/types";
import { getTMDBImageURL } from "../../misc/utils";
import Skeleton from "../../components/Skeleton";

interface Props {
  mediaItemCredits: MediaCreditsAPIResult | null;
}

const MediaPageCastsSection = ({ mediaItemCredits }: Props) => {
  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
      {!mediaItemCredits &&
        Array.from({ length: 9 }, (_, k) => (
          <div key={k} className="flex flex-col gap-2">
            <Skeleton className="aspect-[1/1]" />
            <Skeleton className="h-8 w-[80%]" />
            <Skeleton className="h-6 w-[50%]" />
          </div>
        ))}

      {mediaItemCredits &&
        mediaItemCredits.cast.slice(0, 10).map((cast) => {
          return (
            <div className="flex flex-col gap-2" key={cast.id}>
              <img
                className="rounded-sm aspect-square object-cover"
                src={
                  cast.profile_path
                    ? getTMDBImageURL(cast.profile_path, "200")
                    : "/profile-picture.jpg"
                }
                alt={cast.name}
              />
              <div>
                <p>{cast.name}</p>
                <p className="text-stone-400">
                  {cast.character.replaceAll("'", "")}
                </p>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default MediaPageCastsSection;
