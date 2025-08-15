import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MediaType, Season } from "../../../misc/types";
import { getTVSeasonDetails } from "../../../misc/tmdbAPI";
import {
  getDurationString,
  getTMDBImageURL,
  shortenParagraph,
} from "../../../misc/utils";
import Select, { Option } from "../../../components/Select";
import {
  HeaderSkeleton,
  EpisodeSkeleton,
} from "./MediaPageEpisodesSectionSkeletons";
import EpisodeItem from "./EpisodeItem";

interface Props {
  mediaId: number | null;
  seasons: Season[] | undefined;
}

const SeasonPickerHeader = ({
  seasons,
  selectedSeasonIndex,
  onChange,
}: {
  seasons: Season[];
  selectedSeasonIndex: number;
  onChange: (seasonIndex: number) => void;
}) => {
  return (
    <div className="flex py-4 sm:sticky sm:top-0 bg-black items-center border-b border-b-stone-700">
      <h2 className="flex-1 m-0 text-2xl">
        Season {seasons[selectedSeasonIndex].season_number}
      </h2>
      <div className="w-32">
        <Select
          selectedLabel={`Season ${seasons[selectedSeasonIndex].season_number}`}
          value={selectedSeasonIndex}
          onChange={onChange}
        >
          {seasons.map((season, index) => (
            <Option key={season.id} value={index}>
              Season {season.season_number}
            </Option>
          ))}
        </Select>
      </div>
    </div>
  );
};

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
