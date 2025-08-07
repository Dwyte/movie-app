import { BsChevronDown } from "react-icons/bs";
import { Link } from "react-router-dom";
import { TMDBProfileBaseURL } from "../../misc/constants";
import { useAuth } from "../../contexts/AuthContext";

const UserDropdownContent = () => {};

const UserProfile = () => {
  const auth = useAuth();

  return (
    <div className="group relative text-white">
      <div className="flex gap-2 items-center cursor-pointer">
        <img
          className="rounded-sm w-10 h-10 sm:block"
          src="/profile-picture.jpg"
          alt="Smiley Icon"
        />
        <BsChevronDown />
      </div>

      <div className="hidden group-hover:inline-block absolute min-w-42 right-0 text-white pt-2 w-max">
        <div className="flex flex-col rounded-sm overflow-hidden bg-stone-950">
          {auth.isLoggedIn ? (
            <>
              <Link
                to={`${TMDBProfileBaseURL}/${auth.account?.username}`}
                className="p-4 flex flex-col gap-1"
              >
                <strong className="font-bold">xanderdwightm</strong>
                <small className="text-sm text-stone-400">
                  View TMDB Profile
                </small>
              </Link>
              <button
                onClick={auth.logout}
                className="text-left hover:bg-stone-900 cursor-pointer p-4"
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
    </div>
  );
};

export default UserProfile;
