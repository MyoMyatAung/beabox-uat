import React from "react";
import FollowCard from "../follow-card";
import { useSelector } from "react-redux";
import { useGetFollowingListQuery } from "@/store/api/profileApi";
import { UsersRound } from "lucide-react";

const FollowingList = () => {
  const user_code = useSelector((state: any) => state.persist?.user?.id);
  const { data, isLoading } = useGetFollowingListQuery(user_code);
  console.log(data?.data?.length, "following");
  return (
    <div className="flex flex-col gap-4 w-full no-scrollbar h-screen pb-20">
      {data?.data?.length ? (
        data?.data?.map((follower: any) => (
          <FollowCard key={follower.user_code} data={follower} />
        ))
      ) : (
        <div className="h-full flex justify-center mt-[40%]">
          <div className="flex flex-col items-center gap-3">
            <UsersRound className="text-[#888]" />
            <p className="text-[12px] text-[#888] w-[90px] text-center">快关注你感兴 趣的用户吧！</p>
          </div>
        </div>
      )}
      {/* {data?.data?.map((follower: any) => (
        <FollowCard key={follower.user_code} data={follower} />
      ))} */}
    </div>
  );
};

export default FollowingList;
