import Search from "./Search";

function Header({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <header className="flex justify-between fixed left-0 right-0 top-0 items-center bg-black py-4 px-8">
      <div className="flex justify-between items-center gap-16">
        <img className="w-30 h-9" src="/logo.png" alt="logo" />
        <a className="text-white" href="">
          Movies
        </a>
        <a className="text-gray-500">TV Shows</a>
      </div>

      <div className="flex justify-center items-center gap-8">
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <img
          className="w-10 h-10"
          src="/profile-picture.jpg"
          alt="Smiley Icon"
        />
      </div>
    </header>
  );
}

export default Header;
