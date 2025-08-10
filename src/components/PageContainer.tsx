import React from "react";

const PageContainer = (props: React.ComponentProps<"div">) => {
  return <div {...props} className="px-4 pb-4 pt-20 sm:px-12 sm:py-24" />;
};

export default PageContainer;
