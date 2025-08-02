import React, { useEffect, useState } from "react";
import { Season, TVSeasonDetailsAPIResult } from "../../misc/types";
import { getTVSeasonDetails } from "../../misc/tmdbAPI";
import { getTMDBImageURL } from "../../misc/utils";

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
    <div className="flex flex-col gap-4">
      <div className="flex items-center">
        <h2 className="flex-1 m-0">{seasons[selectedSeason].name}</h2>
        <select
          value={selectedSeason}
          onChange={(event) => setSelectedSeason(parseInt(event.target.value))}
          className="p-2 cursor-pointer border-1 border-stone-500 rounded-sm"
        >
          {seasons.map((season, index) => (
            <option key={season.id} value={index}>
              Episode {season.season_number}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2 max-h-100 sm:max-h-200 scrollable">
        {seasonDetails?.episodes.map((episode) => (
          <div key={episode.id} className="flex gap-4">
            <img
              src={getTMDBImageURL(episode.still_path, "200")}
              className="rounded-sm"
              alt=""
            />
            <div className="flex flex-col justify-center">
              <div className="text-sm uppercase font-bold text-red-800">
                Episode {episode.episode_number}
              </div>
              <div>{episode.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaPageEpisodesSection;
