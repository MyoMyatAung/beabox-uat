import FollowCard from "../follow-card";

const FollowerList = () => {
  return (
    <div className="flex flex-col gap-4 w-full no-scrollbar h-screen pb-20">
      <FollowCard following={true} />
      <FollowCard />
      <FollowCard />
      <FollowCard />
      <FollowCard />
      <FollowCard />
      <FollowCard />
      <FollowCard />
      <FollowCard />
      <FollowCard />
      <FollowCard />
      <FollowCard />
      <FollowCard />
      <FollowCard />
    </div>
  );
};

export default FollowerList;
