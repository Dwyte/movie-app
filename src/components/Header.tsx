import { Link, useLocation } from "react-router-dom";
import Search from "./Search";
import { BsChevronDown, BsX, BsXLg } from "react-icons/bs";
import { useState } from "react";

const navLinks: { name: string; path: string }[] = [
  {
    name: "Home",
    path: "/",
  },
  { name: "Movies", path: "/movies" },
  { name: "Series", path: "/series" },
  { name: "My List", path: "/mylist" },
];

function Header() {
  const location = useLocation();

  const [isMobileNavVisible, setIsMobileNavVisible] = useState(false);

  const handleNavModalClick = () => {
    setIsMobileNavVisible(false);
  };

  return (
    <header className="fixed left-0 right-0 top-0 p-6 z-1000 bg-gradient-to-b from-black via-50% via-black/70 to-black/0">
      <div className="flex justify-between items-center gap-2 mb-4 sm:gap-8">
        <Link className="" to="/">
          <img className="hidden w-20 sm:block" src="/logo.png" alt="logo" />
          <img className="w-5 sm:hidden" src="/n-logo.svg" alt="logo" />
        </Link>

        <div
          onClick={handleNavModalClick}
          className={`${
            !isMobileNavVisible && "hidden"
          } fixed flex sm:flex flex-col items-center justify-center gap-10 bg-black/60 backdrop-blur-sm inset-0 text-4xl sm:static sm:justify-start sm:flex-row sm:text-base sm:bg-transparent sm:bg-none sm:backdrop-blur-none sm:flex-1 sm:gap-4`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              className={`text-stone-500 ${
                location.pathname === link.path && "text-white font-bold"
              }`}
              to={link.path}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex flex-1 max-w-80 items-center gap-4">
          <Search />
          <img
            className="hidden w-10 h-10 sm:block"
            src="/profile-picture.jpg"
            alt="Smiley Icon"
          />
        </div>
      </div>

      <div
        onClick={() => setIsMobileNavVisible(true)}
        className="flex justify-center w-full text-white cursor-pointer sm:hidden"
      >
        <label htmlFor="discover-checkbox">
          Discover <BsChevronDown className="inline" />
        </label>
      </div>
    </header>
  );
}

export default Header;
