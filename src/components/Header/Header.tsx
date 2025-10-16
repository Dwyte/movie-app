import { Link, NavLink, useLocation, useMatch } from "react-router-dom";
import { useState } from "react";

import { BsChevronDown } from "react-icons/bs";
import SearchBox from "./SearchBox";

import { NAV_LINKS } from "../../misc/constants";
import UserProfile from "./UserProfile";

import mobileLogo from "/logo-mobile.webp";
import webLogo from "/logo.webp";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../ErrorFallback";

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
    <header className="fixed left-0 right-0 top-0 p-4 sm:px-12 sm:py-6 z-40 bg-linear-to-b from-[var(--header-bg)] via-50% via-[var(--header-bg)]/60 to-[var(--header-bg)]/0">
      <div className="flex items-center justify-between gap-4 mb-4 sm:gap-8">
        {/** Full name Logo in Desktop and Just the Letter N logo in Mobile */}
        <Link to="/">
          <img className="hidden w-30 sm:block" src={webLogo} alt="logo" />
          <img className="w-12 sm:hidden" src={mobileLogo} alt="logo" />
        </Link>

        {/**
         * NavLinks are full screen and collapsable in Mobile.
         */}
        <nav
          onClick={handleNavModalClick}
          className={`${
            !isMobileNavVisible && "hidden"
          } z-50 fixed inset-0 sm:static bg-black/75 backdrop-blur-lg sm:block sm:bg-transparent sm:backdrop-blur-none sm:flex-1`}
        >
          <ul
            className={`flex flex-col items-center justify-center gap-10 h-[100%] text-4xl sm:justify-start sm:flex-row sm:text-base sm:gap-8 sm:flex`}
          >
            {NAV_LINKS.map((link) => (
              <li key={link.path}>
                <NavLink
                  className={({ isActive }) =>
                    `text-stone-500 ${isActive && "text-white font-bold"}`
                  }
                  to={link.path}
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-1 sm:max-w-75 items-center justify-end gap-4">
          <ErrorBoundary
            fallbackRender={(props) => <ErrorFallback {...props} />}
          >
            <SearchBox />
          </ErrorBoundary>

          <UserProfile />
        </div>
      </div>

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
