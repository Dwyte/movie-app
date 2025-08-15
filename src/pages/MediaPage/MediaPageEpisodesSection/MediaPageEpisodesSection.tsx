import { useEffect, useState } from "react";
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
  const { data: seasonDetails, isFetching: isFetchingSeasonDetails } = useQuery(
    {
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
    }
  );

  const [loadedEpisodeCount, setLoadedEpisodeCount] = useState(0);
  const isDoneLoadingEpisodes =
    !!seasons &&
    loadedEpisodeCount >= seasons[selectedSeasonIndex].episode_count;

  useEffect(() => {
    setLoadedEpisodeCount(0);
  }, [selectedSeasonIndex]);

  return (
    <div className="flex flex-col gap-2 sm:gap-0">
      {!seasons && <HeaderSkeleton />}

      {seasons && (
        <SeasonPickerHeader
          onChange={setSelectedSeasonIndex}
          seasons={seasons}
          selectedSeasonIndex={selectedSeasonIndex}
        />
      )}
      <div className="flex flex-col max-h-100 sm:max-h-none scrollable">
        {/** Display optimisitcally that there will be seasons/episodes. Even before
         * the fetching of seasonData and seasons are done.
         */}
        {(!seasons || isFetchingSeasonDetails) &&
          Array.from({ length: 10 }, (_, k) => <EpisodeSkeleton key={k} />)}

        {/** Once Seasons Data are fetched, display the episodes. But skeletons on top first while
         * image loading. When we loaded all the images of all episodes, we show them all at once.
         */}
        {!isFetchingSeasonDetails &&
          seasons &&
          seasonDetails?.episodes.map((episode) => (
            <div className="relative" key={episode.id}>
              {!isDoneLoadingEpisodes && (
                <div className="absolute inset-0">
                  <EpisodeSkeleton />
                </div>
              )}

              <div
                className={`transition-opacity ${
                  isDoneLoadingEpisodes ? "opacity-100" : "opacity-0"
                }`}
              >
                <EpisodeItem
                  key={episode.id}
                  episode={episode}
                  onLoad={() => setLoadedEpisodeCount((p) => p + 1)}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MediaPageEpisodesSection;
