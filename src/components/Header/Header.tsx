import { Link, NavLink, useLocation, useMatch } from "react-router-dom";
import { useState } from "react";

import { BsChevronDown } from "react-icons/bs";
import SearchBox from "./SearchBox";

import { NAV_LINKS } from "../../misc/constants";
import UserProfile from "./UserProfile";

function Header() {
  const location = useLocation();
  const searchMatch = useMatch("/search");
  const myListsMatch = useMatch("/myLists");
  const listPageMatch = useMatch("/list/:id");

  const [isMobileNavVisible, setIsMobileNavVisible] = useState(false);

  const handleNavModalClick = () => {
    setIsMobileNavVisible(false);
  };

  return (
    <header className="fixed left-0 right-0 top-0 p-4 sm:px-12 sm:py-6 z-1000 bg-gradient-to-b from-black via-50% via-black/70 to-black/0">
      <nav className="flex justify-between items-center gap-4 mb-4 sm:gap-8">
        {/** Full name Logo in Desktop and Just the Letter N logo in Mobile */}
        <Link to="/">
          <img className="hidden w-30 sm:block" src="/logo.png" alt="logo" />
          <img className="w-5 sm:hidden" src="/n-logo.svg" alt="logo" />
        </Link>

        {/**
         * NavLinks except Notflix Logo is full screen and collapsable in Mobile.
         */}
        <div
          onClick={handleNavModalClick}
          className={`${
            !isMobileNavVisible && "hidden"
          } fixed flex flex-col items-center justify-center gap-10 bg-black/60 backdrop-blur-sm inset-0 text-4xl sm:static sm:justify-start sm:flex-row sm:text-base sm:bg-transparent sm:bg-none sm:backdrop-blur-none sm:flex-1 sm:gap-8 sm:flex`}
        >
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              className={({ isActive }) =>
                `text-stone-500 ${isActive && "text-white font-bold"}`
              }
              to={link.path}
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        <div className="flex flex-1 sm:max-w-75 items-center gap-4">
          <SearchBox />
          <UserProfile />
        </div>
      </nav>

      {/** Discover button for activating fullscreen NavLinks in Mobile */}
      {!(searchMatch || myListsMatch || listPageMatch) && (
        <button
          onClick={() => setIsMobileNavVisible(true)}
          className="flex items-center gap-1 justify-center w-full text-white cursor-pointer sm:hidden"
        >
          <span>Discover</span> <BsChevronDown className="text-sm" />
        </button>
      )}
    </header>
  );
}

export default Header;
