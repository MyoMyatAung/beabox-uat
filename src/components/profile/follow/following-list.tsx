import React from "react";
import FollowCard from "../follow-card";
import { useSelector } from "react-redux";
import { useGetFollowingListQuery } from "@/store/api/profileApi";

const FollowingList = () => {
  const user_code = useSelector(
    (state: any) => state.persist.profileData.user_code
  );
  const { data, isLoading } = useGetFollowingListQuery(user_code);
  console.log(data);
  return (
    <div className="flex flex-col gap-4 w-full no-scrollbar h-screen pb-20">
      {data?.data?.map((follower: any) => (
        <FollowCard key={follower.user_code} data={follower} />
      ))}
    </div>
  );
};

export default FollowingList;
