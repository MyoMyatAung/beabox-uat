import { useChangeFollowStatusMutation } from "@/store/api/profileApi";
import { Sparkle } from "lucide-react";
import { useState } from "react";

const RankBtn = ({ id, followBack, rank }: any) => {
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
      className={`text-[14px] z-[1000] flex items-center justify-between rounded-[8px] px-1 py-1.5 ${
        (rank == 1 && "bg-[#F7C09B]") ||
        (rank == 2 && "bg-[#D7D7D8]") ||
        (rank == 3 && "bg-[#DFA28E]")
      } w-full`}
    >
      <Sparkle size={12} />
      <span className="text-[14px] ">{follow ? "已关注" : "关注"}</span>
      <Sparkle size={12} />
    </button>
    // <button
    //   disabled={isLoading}
    //   onClick={handleChangeFollowStatus}
    //   className={`w-full text-[14px] z-50 text-[#080608] font-semibold rounded-[8px] py-2 ${
    //     (rank == 1 && "bg-[#F7C09B]") ||
    //     (rank == 2 && "bg-[#D7D7D8]") ||
    //     (rank == 3 && "bg-[#DFA28E]")
    //   }`}
    // >
    //   <div className="flex items-center text-[12px] justify-between">
    //     <Sparkle className="mx-3" size={16} />
    //     {follow ? "已关注" : "关注"}
    //     <Sparkle className="mx-3" size={16} />
    //   </div>
    // </button>
  );
};

export default RankBtn;
