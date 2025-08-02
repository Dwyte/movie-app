import React from "react";
import { MediaCreditsAPIResult } from "../../misc/types";
import { getTMDBImageURL } from "../../misc/utils";

interface Props {
  mediaItemCredits: MediaCreditsAPIResult | null;
}

const MediaPageCastsSection = ({ mediaItemCredits }: Props) => {
  if (!mediaItemCredits) return;

  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
      {mediaItemCredits.cast.slice(0, 10).map((cast) => {
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
