import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

const ListPagination = ({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
}: {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}) => {
  return (
    <div className="flex justify-center text-white gap-1 items-center">
      <button
        onClick={onPrevPage}
        className="secondary-btn"
        disabled={currentPage === 1}
      >
        <BsChevronLeft />
      </button>
      <div className="px-4 py-1 flex gap-2 bg-stone-800 rounded-sm">
        <span>{currentPage}</span> OF
        <span>{totalPages}</span>
      </div>
      <button
        onClick={onNextPage}
        className="secondary-btn"
        disabled={currentPage === totalPages}
      >
        <BsChevronRight />
      </button>
    </div>
  );
};

export default ListPagination;
