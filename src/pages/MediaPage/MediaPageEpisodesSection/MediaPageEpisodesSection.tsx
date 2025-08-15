import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MediaType, Season } from "../../../misc/types";
import { getTVSeasonDetails } from "../../../misc/tmdbAPI";
import {
  HeaderSkeleton,
  EpisodeSkeleton,
} from "./MediaPageEpisodesSectionSkeletons";
import EpisodeItem from "./EpisodeItem";
import SeasonPickerHeader from "./SeasonPickerHeader";

interface Props {
  mediaId: number | null;
  seasons: Season[] | undefined;
}

const MediaPageEpisodesSection = ({ mediaId, seasons }: Props) => {
  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState<number>(0);
  const { data: seasonDetails, isFetching } = useQuery({
    enabled: !!seasons && mediaId !== null,
    queryKey: [
      "tv",
      mediaId,
      "season",
      seasons?.[selectedSeasonIndex].season_number,
    ],
    queryFn: ({ queryKey }) => {
      const [mediaType, mediaId, _, seasonNumber] = queryKey as [
        MediaType,
        number,
        string,
        number
      ];

      return getTVSeasonDetails(mediaId, seasonNumber);
    },
  });

  return (
    <div className="flex flex-col gap-2">
      {!seasons && <HeaderSkeleton />}

      {seasons && (
        <SeasonPickerHeader
          onChange={setSelectedSeasonIndex}
          seasons={seasons}
          selectedSeasonIndex={selectedSeasonIndex}
        />
      )}
      <div className="flex flex-col max-h-100 sm:max-h-none scrollable">
        {(isFetching || !seasons) &&
          Array.from({ length: 10 }, (_, k) => <EpisodeSkeleton key={k} />)}

        {!isFetching &&
          seasons?.length &&
          seasonDetails?.episodes.map((episode) => (
            <EpisodeItem key={episode.id} episode={episode} />
          ))}
      </div>
    </div>
  );
};

export default MediaPageEpisodesSection;
