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
    <div className="flex justify-center text-white gap-2 items-center">
      <button
        onClick={onPrevPage}
        className={`secondary-btn gap-1 items-center font-normal ${
          currentPage === 1 && "invisible"
        }`}
        disabled={currentPage === 1}
      >
        <BsChevronLeft /> PREV
      </button>
      <div className="px-6 py-2 flex gap-2 bg-stone-800 rounded-sm">
        <span>{currentPage}</span> OF
        <span>{totalPages}</span>
      </div>
      <button
        onClick={onNextPage}
        className={`secondary-btn gap-1 items-center font-normal ${
          currentPage === totalPages && "invisible"
        }`}
        disabled={currentPage === totalPages}
      >
        NEXT <BsChevronRight />
      </button>
    </div>
  );
};

export default ListPagination;
