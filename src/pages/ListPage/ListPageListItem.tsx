import { Link, useLocation } from "react-router-dom";
import { Media, MediaRef } from "../../misc/types";
import ListItemDiv from "../../components/Lists/ListItemDiv";
import MediaListItem, { MediaListItemSkeleton } from "./MediaListItem";

interface ListPageListItemProps {
  media: Media;
  isDoneLoadingListItems: boolean;
  index: number;
  comment: string | null;
  isDeleting: boolean;
  onLoad: () => void;
  onDelete: ((mediaRefToDelete: MediaRef) => void) | null;
  onComment: ((listItem: Media) => void) | null;
}

const ListPageListItem = ({
  media,
  isDoneLoadingListItems,
  index,
  comment,
  isDeleting,
  onLoad,
  onDelete,
  onComment,
}: ListPageListItemProps) => {
  const location = useLocation();

  return (
    <li className="relative" key={media.id}>
      {!isDoneLoadingListItems && (
        <div className="absolute inset-0">
          <MediaListItemSkeleton />
        </div>
      )}

      <Link
        to={`/${media.media_type}/${media.id}`}
        state={{ backgroundLocation: location }}
        className={`group outline-none transition-opacity ${
          isDoneLoadingListItems ? "opacity-100" : "opacity-0"
        }`}
      >
        <ListItemDiv index={index + 1}>
          <MediaListItem
            media={media}
            comment={comment}
            onDelete={onDelete}
            isDeleting={isDeleting}
            onComment={onComment}
            onLoad={onLoad}
          />
        </ListItemDiv>
      </Link>
    </li>
  );
};

export default ListPageListItem;
