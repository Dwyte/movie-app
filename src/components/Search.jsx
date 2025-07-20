import React from "react";

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="">
      <div className="relative flex items-center">
        <img className="absolute left-1 h-3 w-6" src="search.svg" alt="search" />
        <input
          className="pl-7 py-1 bg-gray-300 w-60 font-medium focus:outline-0"
          type="text"
          placeholder="Titles, People, Genres"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>
    </div>
  );
};

export default Search;
