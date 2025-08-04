import { useMemo } from "react";
import { RiDownloadLine } from "react-icons/ri";

import { BsBadgeCcFill, BsBadgeHdFill, BsPlayFill } from "react-icons/bs";

import {
  Crew,
  Media,
  MediaCreditsAPIResult,
  MediaDetails,
  MediaType,
  TimeWindow,
} from "../../misc/types";
import { getDurationString, shortenParagraph } from "../../misc/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTrendingMediaItems } from "../../misc/tmdbAPI";

interface Props {
  mediaItemDetails: MediaDetails | null;
  mediaItemCredits: MediaCreditsAPIResult | null;
}

const MediaPageDetailsSection = ({
  mediaItemDetails,
  mediaItemCredits,
}: Props) => {
  const queryClient = useQueryClient();
  const { data: trendingMediaToday } = useQuery({
    enabled: !!mediaItemDetails,
    queryKey: ["trending", mediaItemDetails?.media_type, "day"],
    queryFn: async ({ queryKey }) => {
      const [_, mediaType, timeWindow] = queryKey as [
        string,
        MediaType,
        TimeWindow
      ];

      return (await getTrendingMediaItems(mediaType, timeWindow)).results;
    },
  });

  const director = useMemo<Crew | null>(() => {
    if (!mediaItemCredits) return null;

    const directorDetails = mediaItemCredits.crew.filter(
      (crew) => crew.job === "Director"
    );

    if (directorDetails.length > 0) return directorDetails[0];

    return null;
  }, [mediaItemCredits]);

  const rankInTrendingToday = useMemo(() => {
    if (!trendingMediaToday) return -1;

    const rank = trendingMediaToday
      .slice(0, 10)
      .findIndex((media) => media.id === mediaItemDetails?.id);

    return rank === -1 ? -1 : rank + 1;
  }, [mediaItemDetails, trendingMediaToday]);

  return (
    <div className="flex flex-col gap-2 sm:flex sm:flex-row sm:gap-12">
      <div className="flex flex-col gap-2 sm:flex-3">
        <div className="flex items-center gap-2 text-stone-400">
          <div>
            {mediaItemDetails?.release_date || mediaItemDetails?.first_air_date}
          </div>
          <div>
            {mediaItemDetails?.runtime &&
              getDurationString(mediaItemDetails.runtime)}

            {mediaItemDetails?.number_of_seasons &&
              `${mediaItemDetails.number_of_seasons} season${
                mediaItemDetails.number_of_seasons > 1 ? "s" : ""
              }`}
          </div>
          <BsBadgeHdFill className="text-xl" />
          <BsBadgeCcFill className="text-xl" />
        </div>

        {rankInTrendingToday !== -1 && (
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center leading-none text-[8px] font-bold bg-red-600 p-[3px] rounded-[2px]">
              <span>TOP</span> <span className="text-[11px]">10</span>
            </div>
            <h3 className="font-bold text-lg">
              #{rankInTrendingToday} in TV Shows Today
            </h3>
          </div>
        )}

        <button className="primary-btn justify-center sm:hidden">
          <BsPlayFill className="text-2xl mr-1" />
          Play
        </button>
        <button className="secondary-btn justify-center sm:hidden">
          <RiDownloadLine className="text-2xl mr-1" />
          Download
        </button>

        <p className="text-stone-300 text-sm">
          {mediaItemDetails && shortenParagraph(mediaItemDetails.overview, 200)}
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-2">
        {mediaItemCredits && mediaItemCredits?.cast.length > 0 && (
          <div className="text-sm text-stone-400">
            Casts: &#32;
            <span className="text-white">
              {mediaItemCredits.cast
                .slice(0, 3)
                .map((cast) => cast.name)
                .join(", ")}
            </span>
          </div>
        )}
        {director && (
          <div className="text-sm text-stone-400">
            Director: &#32;
            <span className="text-white">{director.name}</span>
          </div>
        )}
        <div className="text-sm text-stone-400">
          Genres: &#32;
          <span className="text-white">
            {mediaItemDetails &&
              mediaItemDetails.genres.map((genre) => genre.name).join(", ")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MediaPageDetailsSection;
