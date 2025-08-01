import React from "react";

const Item = () => {
  return (
    <div className="group relative flex items-center justify-center shrink-0 w-66 h-40 ">
      <div className="absolute group-hover:w-72 group-hover:z-100">
        <img
          className="border border-white w-66 h-40 group-hover:w-72 group-hover:h-44"
          src="/no-image-landscape.png"
          alt=""
        />
        <div className="hidden bg-white h-10 group-hover:block z-100">
          Title Goes Here....
        </div>
      </div>
    </div>
  );
};

const FlexItem = () => {
  return (
    <div className="relative">
      <h2 className="absolute top-0 left-0">Title</h2>
      <div className="relative flex items-center">
        <div className="scrollable py-10">
          <div className="flex items-center gap-2 border border-white">
            {Array.from({ length: 10 }, (_, index) => (
              <Item key={index} />
            ))}
          </div>
        </div>

        <div className="absolute bg-gray-600 top-bottom left-0 text-white">
          Hello{" "}
        </div>
      </div>
    </div>
  );
};

const Test = () => {
  return (
    <div className="grid grid-cols-4">
      {Array.from({ length: 10 }, (_, index) => (
        <Item key={index} />
      ))}
    </div>
  );
};

export default Test;
