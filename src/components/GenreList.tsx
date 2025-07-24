import { MovieGenre } from "../types";
import { movieGenres } from "../constants";

const genreIdsToName = (genreIds: number[]): string[] => {
  return movieGenres
    .filter((genre) => genreIds.includes(genre.id))
    .map((genre) => genre.name);
};

const GenreList = ({
  genreList,
  genreIds,
  className,
}: {
  genreIds?: number[];
  genreList?: MovieGenre[];
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
