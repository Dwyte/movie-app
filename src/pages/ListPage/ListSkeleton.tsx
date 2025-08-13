import Skeleton from "../../components/Skeleton";

const ListSkeleton = () => {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 12 }).map((v, k) => (
        <Skeleton key={k} className="h-20 w-full" />
      ))}
    </div>
  );
};

export default ListSkeleton;
