import { BsChevronBarLeft } from "react-icons/bs";
import { useMediaQueries } from "../contexts/MediaQueriesContext";

interface Props {
  title: string;
  videoKey: string;
  onExit: () => void;
}

const YoutubeEmbed = ({ title, videoKey, onExit }: Props) => {
  const { isSmUp } = useMediaQueries();

  return (
    <div className="absolute inset-0 z-50">
      {isSmUp && (
        <button
          ref={(node) => node?.focus()}
          onClick={onExit}
          className="btn  absolute left-4 bottom-10 translate-y-[-50%] gap-1"
          data-variant="secondary-icon"
        >
          <BsChevronBarLeft />{" "}
          <span className="text-sm mr-1">Exit Trailer</span>
        </button>
      )}

      <iframe
        className="aspect-[16/9]"
        src={`https://www.youtube-nocookie.com/embed/${videoKey}?autoPlay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        autoFocus
      ></iframe>
    </div>
  );
};

export default YoutubeEmbed;
