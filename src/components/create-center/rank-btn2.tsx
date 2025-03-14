import { useChangeFollowStatusMutation } from "@/store/api/profileApi";
import { Sparkle } from "lucide-react";
import { useState } from "react";

const RankBtn2 = ({ id, followBack, rank }: any) => {
  const [follow, setFollow] = useState(followBack ? true : false);
  const [changeFollowStatus, { data, isLoading }] =
    useChangeFollowStatusMutation();
  const handleChangeFollowStatus = async () => {
    await changeFollowStatus({
      follow_user_id: id,
      status: followBack ? "unfollow" : "follow",
    });
    // await refetch();
    setFollow(!follow);
  };
  // console.log(data);
  return (
    <button
      disabled={isLoading}
      onClick={handleChangeFollowStatus}
      className={`w-full text-[4px]  text-[#080608] font-semibold rounded-[8px] py-[3px] ${
        (rank == 1 && "bg-[#F7C09B]") ||
        (rank == 2 && "bg-[#D7D7D8]") ||
        (rank == 3 && "bg-[#DFA28E]")
      }`}
    >
      <div className="flex items-center text-[4px] justify-between">
        <Sparkle className="" size={3} />
        {follow ? "已关注" : "关注"}
        <Sparkle className="" size={3} />
      </div>
    </button>
  );
};

export default RankBtn2;
