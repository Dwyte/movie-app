import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../contexts/AuthContext";
import { getAccountLists } from "../misc/tmdbAPI";
import { BsGlobeAmericas, BsLockFill } from "react-icons/bs";

const MyLists = () => {
  const { authDetails, isLoggedIn } = useAuth();

  const { data: userLists } = useQuery({
    enabled: isLoggedIn,
    initialData: null,
    queryKey: ["lists", authDetails?.accountId],
    queryFn: async () => {
      if (!authDetails) return null;

      const response = await getAccountLists(
        authDetails.accessToken,
        authDetails.accountId
      );

      return response.results;
    },
  });

  return (
    <div className="mx-4 mt-20 mb-4 sm:px-16">
      <h1 className="text-3xl text-white mb-2">My List</h1>
      <div className="flex flex-col">
        {userLists?.map((listItem) => {
          return (
            <div key={listItem.id} className="text-white py-1">
              <div className="flex gap-2 items-center">
                <img src="/no-image-landscape.png" alt="" className="w-36" />
                <div className="flex flex-col flex-1">
                  <div>{listItem.name}</div>

                  <div className="text-stone-500 text-sm">
                    {listItem.number_of_items} item
                    {listItem.number_of_items > 1 && "s"}
                  </div>
                </div>
                <div className="text-sm">
                  {listItem.public ? <BsGlobeAmericas /> : <BsLockFill />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyLists;
