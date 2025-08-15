import { Episode } from "../../../misc/types";
import {
  shortenParagraph,
  getTMDBImageURL,
  getDurationString,
} from "../../../misc/utils";

interface Props {
  episode: Episode;
  onLoad?: () => void;
}

const EpisodeItem = ({ episode, onLoad }: Props) => {
  const thumbnailSrc = episode.still_path
    ? getTMDBImageURL(episode.still_path, "200")
    : "/no-image-landscape.png";

  return (
    <div className="flex items-center gap-4 py-2 sm:border-b-1 sm:border-stone-700 sm:py-4 sm:pr-6 cursor-pointer hover:bg-stone-900">
      <span className="hidden sm:block text-right w-8 text-lg text-stone-200">
        {episode.episode_number}
      </span>
      <img
        src={thumbnailSrc}
        className="aspect-16/10 object-cover rounded-sm max-w-[200px]"
        alt=""
        onLoad={onLoad}
      />
      <div className="flex flex-col flex-1 gap-1 justify-center">
        <div className="text-sm uppercase font-bold text-red-800 sm:hidden">
          Episode {episode.episode_number}
        </div>
        <div className="flex">
          <p className="sm:font-bold sm:flex-1 sm:text-lg">{episode.name}</p>

          <p className="hidden sm:block sm:font-bold sm:text-stone-400">
            {getDurationString(episode.runtime)}
          </p>
        </div>
        <p className="hidden sm:block text-sm text-stone-400">
          {shortenParagraph(episode.overview, 100)}
        </p>
      </div>
    </div>
  );
};

export default EpisodeItem;
