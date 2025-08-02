import React, { useEffect, useState } from "react";
import { Season, TVSeasonDetailsAPIResult } from "../../misc/types";
import { getTVSeasonDetails } from "../../misc/tmdbAPI";
import {
  getDurationString,
  getTMDBImageURL,
  shortenParagraph,
} from "../../misc/utils";

interface Props {
  mediaId: number | null;
  seasons: Season[] | undefined;
}

const MediaPageEpisodesSection = ({ mediaId, seasons }: Props) => {
  const [seasonDetails, setSeasonDetails] =
    useState<TVSeasonDetailsAPIResult | null>(null);

  const [selectedSeason, setSelectedSeason] = useState<number>(0);

  useEffect(() => {
    if (!seasons) return;
    setSelectedSeason(0);
  }, [seasons]);

  useEffect(() => {
    const fetchTVSeasonDetails = async () => {
      if (!mediaId || !seasons) return;

      const seasonDetails = await getTVSeasonDetails(
        mediaId,
        seasons[selectedSeason].season_number
      );

      setSeasonDetails(seasonDetails);
    };

    fetchTVSeasonDetails();
  }, [selectedSeason]);

  if (!seasons) return;

  return (
    <div className="flex flex-col gap-2 sm:gap-4">
      <div className="flex items-center">
        <h2 className="flex-1 m-0">{seasons[selectedSeason].name}</h2>
        <select
          value={selectedSeason}
          onChange={(event) => setSelectedSeason(parseInt(event.target.value))}
          className="p-2 cursor-pointer border-1 border-stone-500 rounded-sm"
        >
          {seasons.map((season, index) => (
            <option key={season.id} value={index}>
              Season {season.season_number}
            </option>
          ))}
        </select>
      </div>

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
    </div>
  );
};

export default MediaPageEpisodesSection;
