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
    <header>
      <div>
        <div className="mx-4 text-center h-6 sm:h-20 sm:mx-20 border-x-[1px] border-[var(--list-border-color)]"></div>
        <div className="border-y-[1px]  border-[var(--list-border-color)]">
          <div className="flex items-center justify-between gap-4 sm:gap-8 mx-4 sm:mx-20 sm:px-4 px-2 py-2 border-x-[1px]  border-[var(--list-border-color)]">
            {/** Full name Logo in Desktop and Just the Letter N logo in Mobile */}
            <Link to="/">
              <picture>
                <source media="(min-width: 640px)" srcSet={webLogo} />
                <img className="w-12 sm:w-30" src={mobileLogo} alt="logo" />
              </picture>
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

            <div className="flex flex-1 sm:max-w-75 items-center justify-end gap-4 z-50">
              <ErrorBoundary
                fallbackRender={(props) => <ErrorFallback {...props} />}
              >
                <SearchBox />
              </ErrorBoundary>

              <UserProfile />
            </div>
          </div>
        </div>
      </div>

      {/** Discover button for activating fullscreen NavLinks in Mobile */}
      {/* {!(searchMatch || myListsMatch || listPageMatch) && (
        <button
          onClick={() => setIsMobileNavVisible(true)}
          className="absolute -bottom-8 flex items-center gap-1 justify-center w-full text-white cursor-pointer sm:hidden z-50"
        >
          <span>Discover</span> <BsChevronDown className="text-sm" />
        </button>
      )} */}
    </header>
  );
}

export default Header;
