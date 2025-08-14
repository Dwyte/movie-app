import { useState } from "react";
import { MediaType, Season } from "../../misc/types";
import { getTVSeasonDetails } from "../../misc/tmdbAPI";
import {
  getDurationString,
  getTMDBImageURL,
  shortenParagraph,
} from "../../misc/utils";
import Select, { Option } from "../../components/Select";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "../../components/Skeleton";
import ListSkeleton from "../ListPage/ListSkeleton";

interface Props {
  mediaId: number | null;
  seasons: Season[] | undefined;
}

const HeaderSkeleton = () => {
  return (
    <div className="flex justify-between">
      <Skeleton className="h-10 w-32" />
      <Skeleton className="h-10 w-32" />
    </div>
  );
};

const MediaPageEpisodesSection = ({ mediaId, seasons }: Props) => {
  const [selectedSeason, setSelectedSeason] = useState<number>(0);
  const { data: seasonDetails, isFetching } = useQuery({
    enabled: !!seasons && mediaId !== null,
    queryKey: [
      "tv",
      mediaId,
      "season",
      seasons?.[selectedSeason].season_number,
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
    <div className="flex flex-col gap-2 sm:gap-4">
      {!seasons && <HeaderSkeleton />}
      {seasons && (
        <div className="flex items-center">
          <h2 className="flex-1 m-0 text-2xl">
            Season {seasons[selectedSeason].season_number}
          </h2>
          <div className="w-32">
            <Select
              selectedLabel={`Season ${seasons[selectedSeason].season_number}`}
              value={selectedSeason}
              onChange={(value) => setSelectedSeason(value)}
            >
              {seasons.map((season, index) => (
                <Option key={season.id} value={index}>
                  Season {season.season_number}
                </Option>
              ))}
            </Select>
          </div>
        </div>
      )}

      {(isFetching || !seasons) && <ListSkeleton className="h-28" />}
      {!isFetching && seasons?.length && (
        <div className="flex flex-col max-h-100 sm:max-h-200 scrollable">
          {seasonDetails?.episodes.map((episode) => (
            <div
              key={episode.id}
              className="flex items-center gap-4 py-2 sm:border-b-1 sm:border-stone-700 sm:py-4 sm:pr-6 cursor-pointer hover:bg-stone-900"
            >
              <span className="hidden sm:block text-right w-8 text-lg text-stone-200">
                {episode.episode_number}
              </span>
              <img
                src={
                  episode.still_path
                    ? getTMDBImageURL(episode.still_path, "200")
                    : "/no-image-landscape.png"
                }
                className="aspect-16/10 object-cover rounded-sm max-w-[200px]"
                alt=""
              />
              <div className="flex flex-col flex-1 gap-1 justify-center">
                <div className="text-sm uppercase font-bold text-red-800 sm:hidden">
                  Episode {episode.episode_number}
                </div>
                <div className="flex">
                  <p className="sm:font-bold sm:flex-1 sm:text-lg">
                    {episode.name}
                  </p>

                  <p className="hidden sm:block sm:font-bold sm:text-stone-400">
                    {getDurationString(episode.runtime)}
                  </p>
                </div>
                <p className="hidden sm:block text-sm text-stone-400">
                  {shortenParagraph(episode.overview, 100)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaPageEpisodesSection;
