import { useMemo } from "react";
import { RiDownloadLine } from "react-icons/ri";

import {
  BsBadgeCcFill,
  BsBadgeHdFill,
  BsBan,
  BsBoxArrowLeft,
  BsPlayFill,
} from "react-icons/bs";

import {
  Crew,
  MediaCreditsAPIResult,
  MediaDetails,
  MediaType,
  TimeWindow,
  TrailerState,
} from "../../misc/types";
import { getDurationString, shortenParagraph } from "../../misc/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTrendingMediaItems } from "../../misc/tmdbAPI";
import StyledKeyValue from "../../components/StyledKeyValue";
import Skeleton from "../../components/Skeleton";
import { useMediaQueries } from "../../contexts/MediaQueriesContext";

interface Props {
  mediaItemDetails: MediaDetails | null;
  mediaItemCredits: MediaCreditsAPIResult | null;
  trailerState: TrailerState;
  onPlayTrailer: () => void;
  onExitTrailer: () => void;
}

const Container = (props: React.ComponentProps<"div">) => (
  <div
    {...props}
    className="flex flex-col gap-2 sm:flex sm:flex-row sm:gap-12"
  />
);

const SectionA = (props: React.ComponentProps<"div">) => (
  <div {...props} className="flex flex-col gap-2 sm:flex-3" />
);

const SectionB = (props: React.ComponentProps<"div">) => (
  <div {...props} className="flex flex-col gap-2 sm:flex-2 text-sm" />
);

const DesktopSkeleton = () => {
  return (
    <Container>
      <SectionA>
        <Skeleton className="h-6 w-[50%]" />
        <Skeleton className="h-4 w-[95%]" />
        <Skeleton className="h-4 w-[85%]" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[35%]" />
      </SectionA>
      <SectionB>
        <Skeleton className="h-4 w-[95%]" />
        <Skeleton className="h-4 w-[70%]" />
        <Skeleton className="h-4 w-[100%]" />
        <Skeleton className="h-4 w-[80%]" />
      </SectionB>
    </Container>
  );
};

const MobileSkeleton = () => {
  return (
    <Container>
      <SectionA>
        <Skeleton className="h-6 w-[50%]" />
        <Skeleton className="h-8 w-[65%]" />
        <Skeleton className="h-10 w-[100%]" />
        <Skeleton className="h-10 w-[100%]" />
        <Skeleton className="h-4 w-[95%]" />
        <Skeleton className="h-4 w-[75%]" />
        <Skeleton className="h-4 w-[85%]" />
      </SectionA>
      <SectionB>
        <Skeleton className="h-4 w-[90%] mt-1" />
        <Skeleton className="h-4 w-[70%]" />
        <Skeleton className="h-4 w-[80%]" />
      </SectionB>
    </Container>
  );
};

const MediaPageDetailsSection = ({
  mediaItemDetails,
  mediaItemCredits,
  trailerState,
  onExitTrailer,
  onPlayTrailer,
}: Props) => {
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

  const { isSmUp } = useMediaQueries();

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

  const isLoading =
    !mediaItemDetails ||
    !mediaItemCredits ||
    !trendingMediaToday ||
    trailerState === "FETCHING";
  if (isLoading) return isSmUp ? <DesktopSkeleton /> : <MobileSkeleton />;

  return (
    <Container>
      <SectionA>
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

        {trailerState === "AVAILABLE" && (
          <button
            onClick={onPlayTrailer}
            className="primary-btn justify-center sm:hidden"
          >
            <BsPlayFill className="text-2xl mr-1" />
            Play Trailer
          </button>
        )}
        {trailerState === "UNAVAILABLE" && (
          <button
            onClick={onPlayTrailer}
            className="primary-btn justify-center sm:hidden"
          >
            <BsBan className="text-2xl mr-1" />
            No Trailer Available
          </button>
        )}
        {trailerState === "PLAYING" && (
          <button
            onClick={onExitTrailer}
            className="primary-btn justify-center sm:hidden"
          >
            <BsBoxArrowLeft className="text-2xl mr-1" />
            Exit Trailer
          </button>
        )}
        <button className="secondary-btn justify-center sm:hidden">
          <RiDownloadLine className="text-2xl mr-1" />
          Download
        </button>

        <p className="text-stone-300 text-sm">
          {mediaItemDetails && shortenParagraph(mediaItemDetails.overview, 200)}
        </p>
      </SectionA>

      <SectionB>
        {mediaItemCredits && mediaItemCredits.cast.length > 0 && (
          <StyledKeyValue
            label="Casts: "
            value={mediaItemCredits.cast
              .slice(0, 3)
              .map((cast) => cast.name)
              .join(", ")}
          />
        )}
        {director && (
          <StyledKeyValue label="Director: " value={director.name} />
        )}
        <StyledKeyValue
          label="Genres: "
          value={
            mediaItemDetails &&
            mediaItemDetails.genres.map((g) => g.name).join(", ")
          }
        />
      </SectionB>
    </Container>
  );
};

export default MediaPageDetailsSection;
