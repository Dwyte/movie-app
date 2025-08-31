import { BsChevronDown } from "react-icons/bs";
import { Link } from "react-router-dom";
import { TMDBProfileBaseURL } from "../../misc/constants";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { useMediaQueries } from "../../contexts/MediaQueriesContext";

const UserDropdownContent = () => {
  const auth = useAuth();

  return (
    <div className="inline-block sm:hidden sm:group-hover:inline-block sm:group-focus:inline-block sm:group-focus-within:inline-block absolute min-w-42 right-0 text-white pt-2 w-max">
      <div className="fixed inset-0 bg-black/75 backdrop-blur-lg flex flex-col justify-center items-center text-4xl sm:items-stretch sm:text-base sm:rounded-sm sm:overflow-hidden sm:static sm:bg-black">
        {auth.isLoggedIn ? (
          <>
            <Link
              to={`${TMDBProfileBaseURL}/${auth.account?.username}`}
              className="p-4 flex flex-col gap-1 items-center sm:items-start hover:bg-stone-900 focus:bg-stone-900 focus:border-1"
            >
              <strong className="font-bold">xanderdwightm</strong>
              <small className="text-sm text-stone-400">
                View TMDB Profile
              </small>
            </Link>
            <button
              onClick={auth.logout}
              className="text-left text-stone-300 hover:bg-stone-900 cursor-pointer p-4 focus:border-1"
            >
              Log-out
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="shrink-0 hover:bg-stone-900 cursor-pointer p-4"
          >
            Log-in
          </Link>
        )}
      </div>
    </div>
  );
};

const UserProfile = () => {
  const [isActive, setIsActive] = useState(false);
  const { isSmUp } = useMediaQueries();

  useEffect(() => {
    setIsActive(isSmUp);
  }, [isSmUp]);

  const handleClick = () => {
    setIsActive((p) => !p);
  };

  return (
    <div
      tabIndex={0}
      className="group relative text-white"
      onClick={!isSmUp ? handleClick : undefined}
    >
      <div className="flex gap-2 items-center cursor-pointer">
        <img
          className="rounded-sm w-10 h-10 sm:block"
          src="/profile-picture.webp"
          alt="Smiley Icon"
        />
        <BsChevronDown />
      </div>

      {isActive && <UserDropdownContent />}
    </div>
  );
};

export default UserProfile;
