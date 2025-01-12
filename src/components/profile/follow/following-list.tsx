import React from "react";
import FollowCard from "../follow-card";

const FollowingList = () => {
  return (
    <div className="flex flex-col gap-4 w-full no-scrollbar h-screen pb-20">
      <FollowCard following={true} />
      <FollowCard following={true} />
      <FollowCard following={true} />
      <FollowCard following={true} />
      <FollowCard following={true} />
      <FollowCard following={true} />
      <FollowCard following={true} />
      <FollowCard following={true} />
      <FollowCard following={true} />
      <FollowCard following={true} />
    </div>
  );
};

export default FollowingList;
