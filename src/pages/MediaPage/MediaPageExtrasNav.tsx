import {
  MEDIA_PAGE_TV_NAV_LINKS,
  MEDIA_PAGE_MOVIE_NAV_LINKS,
} from "../../misc/constants";
import Skeleton from "../../components/Skeleton";
import { MediaDetails } from "../../misc/types";
import { NavLink } from "react-router-dom";

const MediaExtrasNavSkeleton = () => {
  return (
    <div className="flex gap-2 mb-4">
      <Skeleton className="h-10 w-34" />
      <Skeleton className="h-10 w-34" />
    </div>
  );
};

interface Props {
  mediaItemDetails: MediaDetails | null | undefined;
  backgroundLocation: string;
}

const MediaPageExtrasNav = ({
  mediaItemDetails,
  backgroundLocation,
}: Props) => {
  if (!mediaItemDetails) return <MediaExtrasNavSkeleton />;

  const navLinks =
    mediaItemDetails.media_type === "movie"
      ? MEDIA_PAGE_MOVIE_NAV_LINKS
      : MEDIA_PAGE_TV_NAV_LINKS;

  return (
    <nav className="flex gap-4">
      {navLinks.map((navLink) => {
        return (
          <NavLink
            key={navLink.path}
            className={({ isActive }) =>
              `media-page-nav${isActive ? "-active" : ""}`
            }
            state={{ backgroundLocation }}
            to={`/${mediaItemDetails.media_type}/${mediaItemDetails.id}${navLink.path}`}
            end
          >
            {navLink.name}
          </NavLink>
        );
      })}
    </nav>
  );
};

export default MediaPageExtrasNav;
