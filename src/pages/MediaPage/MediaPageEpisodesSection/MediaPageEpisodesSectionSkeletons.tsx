import Skeleton from "../../../components/Skeleton";

export const HeaderSkeleton = () => {
  return (
    <div className="flex mt-4 justify-between">
      <Skeleton className="h-10 w-32" />
      <Skeleton className="h-10 w-32" />
    </div>
  );
};

export const EpisodeSkeleton = () => {
  return (
    <div className="flex py-2 flex-col sm:py-4 sm:border-b-stone-800 sm:border-b-1">
      <div className="flex sm:px-4 gap-3 items-center">
        <Skeleton className="hidden sm:block h-5 w-5" rounded="rounded-full" />
        <div className="flex gap-4 w-full">
          <Skeleton className="h-full w-full max-w-[201px] aspect-[16/10]" />

          <div className="flex flex-col gap-1 justify-center w-full">
            <div className="flex justify-between items-center mb-1">
              <Skeleton className="w-[80%] h-6 sm:h-7 sm:w-50" />
              <Skeleton className="hidden sm:block h-5 w-9" />
            </div>
            <Skeleton className="hidden sm:block h-4 w-[95%]" />
            <Skeleton className="hidden sm:block h-4 w-[85%]" />
            <Skeleton className="h-4 w-[65%]" />
          </div>
        </div>
      </div>
    </div>
  );
};
