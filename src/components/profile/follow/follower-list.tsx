import { useSelector } from "react-redux";
import FollowCard from "../follow-card";
import { useGetFollowerListQuery } from "@/store/api/profileApi";

const FollowerList = () => {
  const user_code = useSelector(
    (state: any) => state.persist.profileData?.user_code
  );

  const { data } = useGetFollowerListQuery(user_code);

  console.log(data?.data, "follower list"); 

  return (
    <div className="flex flex-col gap-4 w-full no-scrollbar h-screen pb-20">
      {data?.data?.map((follower: any) => (
        <FollowCard key={follower.user_code} data={follower} />
      ))}
    </div>
  );
};

export default FollowerList;
