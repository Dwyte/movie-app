import { Season } from "../../../misc/types";
import Select, { Option } from "../../../components/Select";

const SeasonPickerHeader = ({
  seasons,
  selectedSeasonIndex,
  onChange,
}: {
  seasons: Season[];
  selectedSeasonIndex: number;
  onChange: (seasonIndex: number) => void;
}) => {
  return (
    <div className="flex py-4 sm:sticky sm:top-0 bg-[var(--main-bg)] items-center border-b border-b-stone-700 z-10">
      <h2 className="flex-1 m-0 text-2xl">
        Season {seasons[selectedSeasonIndex].season_number}
      </h2>
      <div className="w-32">
        <Select
          selectedLabel={`Season ${seasons[selectedSeasonIndex].season_number}`}
          value={selectedSeasonIndex}
          onChange={onChange}
        >
          {seasons.map((season, index) => (
            <Option key={season.id} value={index}>
              Season {season.season_number}
            </Option>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default SeasonPickerHeader;
