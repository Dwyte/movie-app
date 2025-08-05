import { BsChevronDown } from "react-icons/bs";
import { NavLink } from "react-router-dom";

const UserProfile = () => {
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

      <div className="hidden group-hover:inline-block absolute right-0 text-white pt-1 w-max">
        <div className="flex flex-col border border-stone-400 bg-stone-950">
          <NavLink
            to="/login"
            className="shrink-0 hover:bg-stone-900 cursor-pointer p-2"
          >
            Log-in
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
