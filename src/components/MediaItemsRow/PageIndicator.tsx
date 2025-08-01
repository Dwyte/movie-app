interface Props {
  totalPages: number;
  currentPage: number;
}

const PageIndicator = ({ totalPages, currentPage }: Props) => {
  return (
    <div className="hidden text-white group-hover/root:flex gap-0.5 mb-1 mr-16">
      {Array.from({ length: totalPages }, (_, index) => (
        <div
          key={index}
          className={`h-0.5 rounded-sm ${
            currentPage === index ? "w-5 bg-white" : "w-2 bg-stone-400"
          } `}
        ></div>
      ))}
    </div>
  );
};

export default PageIndicator;
