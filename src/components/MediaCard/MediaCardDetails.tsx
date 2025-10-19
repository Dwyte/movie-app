import { BsPlayFill, BsPlusLg, BsStar, BsChevronDown } from "react-icons/bs";
import { getGenreNamesFromIds } from "../../misc/utils";
import { Media } from "../../misc/types";
import { useAddListModal } from "../../contexts/AddListModalContext";
import { Link, useNavigate } from "react-router-dom";

interface Props {
  media: Media;
  mediaUrl: string;
  backgroundLocation: string;
}

export const MediaCardDetails = ({
  media,
  mediaUrl,
  backgroundLocation,
}: Props) => {
  const navigate = useNavigate();
  const { showAddListModal } = useAddListModal();

  const handlePlay = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    navigate(mediaUrl, {
      state: {
        backgroundLocation,
        showTrailerOnLoad: true,
      },
    });
  };

  const handleAddToList = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    showAddListModal({
      media_id: media.id,
      media_type: media.media_type,
    });
  };

  return (
    <div className="p-4 flex flex-col gap-4 bg-[var(--media-card-bg)] text-white shadow-2xl">
      <div className="flex gap-2 text-xl">
        <button
          aria-label="Open Media Page and Play Trailer"
          onClick={handlePlay}
          className="btn"
          data-variant="primary-icon"
        >
          <BsPlayFill />
        </button>
        <button
          aria-label={`Add ${media.title} to a List`}
          onClick={handleAddToList}
          className="btn"
          data-variant="secondary-icon"
        >
          <BsPlusLg />
        </button>
        <button className="btn" data-variant="secondary-icon">
          <BsStar />
        </button>
        <div className="flex-1"></div>
        <Link
          to={mediaUrl}
          state={{
            backgroundLocation,
            showTrailerOnLoad: false,
          }}
          aria-label="Open Media Page"
          className="btn"
          data-variant="secondary-icon"
        >
          <BsChevronDown />
        </Link>
      </div>

      <div className="text-stone-300">
        {getGenreNamesFromIds(media.genre_ids, 3)}
      </div>
    </div>
  );
};
