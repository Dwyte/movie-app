import { Dispatch, SetStateAction } from "react";
import { Media } from "../../misc/types";
import { MEDIA_TYPE_NAME } from "../../misc/constants";
import { BsChatLeftDots } from "react-icons/bs";

interface Props {
  listItem: Media;
  comment: string;
  setComment: Dispatch<SetStateAction<string>>;
}

const EditListItemComment = ({ listItem, comment, setComment }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="m-0 text-lg">
        {listItem.title} ({MEDIA_TYPE_NAME[listItem.media_type]}) &nbsp;
        <BsChatLeftDots className="inline" />
      </h2>
      <textarea
        placeholder="Write your comment..."
        value={comment}
        onChange={(e) => {
          setComment(e.target.value);
        }}
        className="input resize-none min-h-32"
      />
    </div>
  );
};

export default EditListItemComment;
