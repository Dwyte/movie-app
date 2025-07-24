import { FormEvent, useEffect, useState } from "react";
import { BsSearch, BsX } from "react-icons/bs";
import { useNavigate, useSearchParams } from "react-router-dom";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const q = searchParams.get("q");

    if (window.location.pathname === "/search" && q) {
      setSearchTerm(q);
    }
  }, []);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (searchTerm.trim().length > 0) {
      navigate(`/search?q=${encodeURI(searchTerm)}`);
    }
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm((prev) => {
      if (prev.length > 0 && event.target.value.length === 0) {
        navigate("/");
      }

      return event.target.value;
    });
  };

  return (
    <div className="flex-1 rounded-sm overflow-hidden flex gap-2 items-center text-white bg-stone-800 px-3 sm:flex sm:items-center sm:relative">
      <BsSearch onClick={handleSubmit} className="text-white text-md " />
      <form className="flex-1" onSubmit={handleSubmit}>
        <input
          className="w-full py-2 focus:outline-0"
          type="text"
          placeholder="Titles, People, Genres"
          value={searchTerm}
          onChange={handleSearchInputChange}
        />
      </form>
      {searchTerm.length > 0 && (
        <BsX
          onClick={() => setSearchTerm("")}
          className="text-white text-2xl cursor-pointer"
        />
      )}
    </div>
  );
};

export default Search;
