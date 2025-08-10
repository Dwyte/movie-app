import React from "react";
import PageContainer from "../components/PageContainer";
import { useParams } from "react-router-dom";

const ListPage = () => {
  const params = useParams();

  return (
    <PageContainer>
      <h1 className="text-white text-3xl">List {params?.listId}</h1>
    </PageContainer>
  );
};

export default ListPage;
