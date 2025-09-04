import { BsPlayFill, BsPlusLg, BsStar, BsChevronDown } from "react-icons/bs";
import { getGenreNamesFromIds } from "../../misc/utils";
import { Media } from "../../misc/types";

interface Props {
  media: Media;
  onPlay: React.MouseEventHandler<HTMLButtonElement>;
  onAddToList: React.MouseEventHandler<HTMLButtonElement>;
}

export const MediaCardDetails = ({ media, onPlay, onAddToList }: Props) => {
  return (
    <div className="hidden p-2 sm:group-hover/mcard:flex sm:group-focus/mcard:flex sm:group-focus-within/mcard:flex flex-col gap-2 bg-[var(--media-card-bg)] text-white shadow-2xl">
      <div className="flex gap-1 text-sm">
        <button
          aria-label="Open Media Page and Play Trailer"
          onClick={onPlay}
          className="btn rounded-full"
          data-variant="primary-icon"
        >
          <BsPlayFill />
        </button>
        <button
          aria-label={`Add ${media.title} to a List`}
          onClick={onAddToList}
          className="btn rounded-full"
          data-variant="secondary-icon"
        >
          <BsPlusLg />
        </button>
        <button className="btn rounded-full" data-variant="secondary-icon">
          <BsStar />
        </button>
        <div className="flex-1"></div>
        <button
          aria-label="Open Media Page"
          className="btn rounded-full"
          data-variant="secondary-icon"
        >
          <BsChevronDown />
        </button>
      </div>

      <div className="text-xs text-stone-300">
        {getGenreNamesFromIds(media.genre_ids, 3)}
      </div>
    </div>
  );
};
