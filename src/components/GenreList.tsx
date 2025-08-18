import { Genre, MediaType } from "../misc/types";
import { MOVIE_GENRES, TV_SHOWS_GENRES } from "../misc/constants";

const GENRES = {
  tv: TV_SHOWS_GENRES,
  movie: MOVIE_GENRES,
};

const genreIdsToName = (genreIds: number[], mediaType: MediaType): string[] => {
  return GENRES[mediaType]
    .filter((genre) => genreIds.includes(genre.id))
    .map((genre) => genre.name);
};

const GenreList = ({
  genreIds,
  genreList,
  mediaType,
  className,
}: {
  genreIds?: number[];
  mediaType?: MediaType;
  genreList?: Genre[];
  className?: string;
}) => {
  return (
    <div className={`text-stone-300 ${className}`}>
      {genreList &&
        genreList
          .map((movieGenre) => movieGenre.name)
          .join(" • ")
          .toString()}
      {genreIds &&
        mediaType &&
        genreIdsToName(genreIds, mediaType).join(" • ").toString()}
    </div>
  );
};

export default GenreList;
