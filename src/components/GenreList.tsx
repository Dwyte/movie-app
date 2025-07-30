import { Genre } from "../misc/types";
import { MOVIE_GENRES } from "../misc/constants";

const genreIdsToName = (genreIds: number[]): string[] => {
  return MOVIE_GENRES.filter((genre) => genreIds.includes(genre.id)).map(
    (genre) => genre.name
  );
};

const GenreList = ({
  genreList,
  genreIds,
  className,
}: {
  genreIds?: number[];
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
      {genreIds && genreIdsToName(genreIds).join(" • ").toString()}
    </div>
  );
};

export default GenreList;
