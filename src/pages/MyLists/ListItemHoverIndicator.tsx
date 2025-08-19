import { BsGrid3X2GapFill } from "react-icons/bs";
import { useMediaQueries } from "../../contexts/MediaQueriesContext";

const ListItemHoverIndicator = () => {
  const { isSmUp } = useMediaQueries();

  if (!isSmUp) return;
  return (
    <div className="invisible text-lg text-stone-300/50 group-hover:visible">
      <BsGrid3X2GapFill className="rotate-90" />
      <BsGrid3X2GapFill className="rotate-90 mt-[-1px]" />
      <BsGrid3X2GapFill className="rotate-90 mt-[-1px]" />
    </div>
  );
};

export default ListItemHoverIndicator;
