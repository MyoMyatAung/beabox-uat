import { useSelector } from "react-redux";
import FollowCard from "../follow-card";
import {
  useGetFollowerListQuery,
  useGetMyProfileQuery,
} from "@/store/api/profileApi";
import { Users, UsersRound } from "lucide-react";
import Loader from "../../../page/home/vod_loader.gif";

const FollowerList2 = ({ searchTerm, id, closeTab }: any) => {
  //   const user_code = useSelector((state: any) => state.persist?.user?.id);

  const { data, isLoading, isFetching } = useGetFollowerListQuery({
    user_id: id,
    search: searchTerm,
  });

  // console.log(data?.data, "follower list");

  return (
    <div className="flex flex-col gap-4 w-full no-scrollbar h-screen pb-5">
      {isLoading || isFetching ? (
        <div className=" flex justify-center w-full py-[200px]">
          <div className="">
            <img src={Loader} className="w-[70px] h-[70px]" alt="Loading" />
          </div>
        </div>
      ) : (
        <>
          {data?.data?.length ? (
            data?.data?.map((follower: any) => (
              <div key={follower.user_code} onClick={() => closeTab(false)}>
                <FollowCard data={follower} />
              </div>
            ))
          ) : (
            <div className="h-full flex justify-center mt-[40%]">
              <div className="flex flex-col items-center gap-3">
                <UsersRound className="text-[#888]" />
                <p className="text-[12px] text-[#888] w-[90px] text-center">
                  快关注你感兴 趣的用户吧！
                </p>
              </div>
            </div>
          )}
        </>
      )}
      {/* {data?.data?.map((follower: any) => (
        <FollowCard key={follower.user_code} data={follower} />
      ))} */}
    </div>
  );
};

export default FollowerList2;
