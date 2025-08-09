import { BsPlusLg } from "react-icons/bs";

const lists = [
  {
    id: 1,
    name: "Comfort Movies",
  },
  {
    id: 2,
    name: "My Top Recommended",
  },
  {
    id: 3,
    name: "Watch Later",
  },
];

interface Props {
  onCreate: () => void;
}

const ListSelection = ({ onCreate }: Props) => {
  return (
    <>
      <h3 className="text-2xl text-white font-bold sm:text-xl">
        Add Media to...
      </h3>
      <div className="flex flex-col flex-1 gap-2 sm:overflow-y">
        {lists.map((item) => {
          return (
            <button
              key={item.id}
              className="secondary-btn font-normal rounded-sm text-white text-xl p-4 sm:text-base sm:p-3"
            >
              {item.name}
            </button>
          );
        })}
      </div>
      <button
        onClick={onCreate}
        className="primary-btn p-4 justify-center gap-1 text-lg text-center rounded-sm sm:text-base sm:p-3"
      >
        <BsPlusLg className="text-2xl sm:text-xl" />
        <span>Create New List</span>
      </button>
    </>
  );
};

export default ListSelection;
