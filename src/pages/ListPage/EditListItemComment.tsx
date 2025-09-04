import { Dispatch, SetStateAction } from "react";
import { Media } from "../../misc/types";
import { MEDIA_TYPE_NAME } from "../../misc/constants";
import { BsChatLeftDots } from "react-icons/bs";
import Input from "../../components/Input";

interface Props {
  listItem: Media;
  comment: string;
  setComment: Dispatch<SetStateAction<string>>;
}

const EditListItemComment = ({ listItem, comment, setComment }: Props) => {
  return (
    <Input
      label="Comment"
      placeholder="Write your comment..."
      value={comment}
      onChange={(e) => {
        setComment(e.target.value);
      }}
    />
  );
};

export default EditListItemComment;
