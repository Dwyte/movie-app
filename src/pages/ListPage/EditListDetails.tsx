import React, { Dispatch, SetStateAction, useState } from "react";
import { ListDetails, ListOptions } from "../../misc/types";
import ListVisibilityRadio from "../../components/AddListModal/ListVisibilityRadio";

interface Props {
  listDetails: ListDetails;
  setListOptions: Dispatch<SetStateAction<Partial<ListOptions>>>;
}

const EditListDetails = ({ listDetails, setListOptions }: Props) => {
  const [name, setName] = useState(listDetails.name);
  const [description, setDescription] = useState(listDetails.description);
  const [isPublic, setIsPublic] = useState(listDetails.public);

  return (
    <div className="flex flex-col gap-2">
      <h2 className="m-0"> Edit List Details: </h2>
      <input
        type="text"
        placeholder="Choose a Title"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setListOptions((p) => {
            return { ...p, name: e.target.value } as ListOptions;
          });
        }}
        className="input"
      />
      <input
        type="text"
        placeholder="Enter Description"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
          setListOptions((p) => {
            return { ...p, description: e.target.value } as ListOptions;
          });
        }}
        className="input"
      />
      <ListVisibilityRadio
        value={isPublic}
        onChange={(isPublic: boolean) => {
          setIsPublic(isPublic);
          setListOptions((p) => {
            return { ...p, public: isPublic };
          });
        }}
      />
    </div>
  );
};

export default EditListDetails;
