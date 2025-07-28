import { FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { BsSearch, BsX } from "react-icons/bs";

const SearchBox = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const q = searchParams.get("q");

    if (window.location.pathname === "/search" && q) {
      setSearchTerm(q);
    }
  }, []);

  useEffect(() => {
    if (location.pathname !== "/search") {
      setSearchTerm("");
    }
  }, [location.pathname]);

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

  const handleCancelSearch = () => {
    navigate(-1);
    setSearchTerm("");
  };

  return (
    <div className="flex-1 rounded-sm overflow-hidden flex gap-2 items-center text-white border border-stone-400 bg-stone-950/50 backdrop-blur-xs px-3 sm:flex sm:items-center sm:relative">
      <BsSearch onClick={handleSubmit} className="text-white text-md " />
      <form className="flex-1" onSubmit={handleSubmit}>
        <input
          className="w-full py-2 focus:outline-0"
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchInputChange}
        />
      </form>
      {searchTerm.length > 0 && (
        <BsX
          onClick={handleCancelSearch}
          className="text-white text-2xl cursor-pointer"
        />
      )}
    </div>
  );
};

export default SearchBox;
