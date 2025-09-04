import React, { Dispatch, SetStateAction, useState } from "react";
import { ListDetails, ListOptions } from "../../misc/types";
import ListVisibilityRadio from "../../components/AddListModal/ListVisibilityRadio";
import Input from "../../components/Input";

interface Props {
  listDetails: ListDetails;
  setListOptions: Dispatch<SetStateAction<Partial<ListOptions>>>;
}

const EditListDetails = ({ listDetails, setListOptions }: Props) => {
  const [name, setName] = useState(listDetails.name);
  const [description, setDescription] = useState(listDetails.description);
  const [isPublic, setIsPublic] = useState(listDetails.public);

  return (
    <div className="flex flex-col gap-6">
      <Input
        label="List Title"
        type="text"
        placeholder="Choose a Title"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setListOptions((p) => {
            return { ...p, name: e.target.value } as ListOptions;
          });
        }}
      />

      <Input
        label="List Description"
        type="text"
        placeholder="Enter Description"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
          setListOptions((p) => {
            return { ...p, description: e.target.value } as ListOptions;
          });
        }}
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
