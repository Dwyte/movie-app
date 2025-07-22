import { FormEvent, useEffect, useState } from "react";
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
    <div className="">
      <div className="relative flex items-center">
        <img
          className="absolute left-1 h-3 w-6"
          src="search.svg"
          alt="search"
        />
        <form onSubmit={handleSubmit}>
          <input
            className="pl-7 py-1 bg-gray-300 w-60 font-medium focus:outline-0"
            type="text"
            placeholder="Titles, People, Genres"
            value={searchTerm}
            onChange={handleSearchInputChange}
          />
        </form>
      </div>
    </div>
  );
};

export default Search;
