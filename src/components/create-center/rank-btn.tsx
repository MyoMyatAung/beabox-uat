import { useChangeFollowStatusMutation } from "@/store/api/profileApi";
import { Sparkle } from "lucide-react";
import { useEffect, useState } from "react";
import loader from "@/page/home/vod_loader.gif";
import { useDispatch, useSelector } from "react-redux";
import { setIsDrawerOpen } from "@/store/slices/profileSlice";

const RankBtn = ({ id, followBack, refetch }: any) => {
  const user = useSelector((state: any) => state?.persist?.user);
  const dispatch = useDispatch();
  const [follow, setFollow] = useState(followBack);
  const [changeFollowStatus, { data, isLoading }] =
    useChangeFollowStatusMutation();
  const handleChangeFollowStatus = async () => {
    setFollow(!follow);
    await changeFollowStatus({
      follow_user_id: id,
      status: followBack ? "unfollow" : "follow",
    });
    // await refetch();
  };
  useEffect(() => {
    setFollow(followBack);
  }, [followBack]);
  console.log(followBack, "follow");
  return (
    <button
      disabled={isLoading}
      onClick={
        user?.token
          ? () => handleChangeFollowStatus()
          : () => dispatch(setIsDrawerOpen(true))
      }
      // onClick={handleChangeFollowStatus}
      className={`text-[14px] z-[1000] flex items-center justify-between rounded-[8px] px-1 py-1.5 ${
        follow
          ? "bg-[#2B2830] hover:bg-[#2B2830]"
          : "gradient-bg hover:gradient-bg"
      }  w-full`}
    >
      <Sparkle size={12} />
      <span className="text-[14px] ">
        {follow ? "已关注" : "关注"}
        {/* {isLoading ? (
          <img src={loader} alt="" className="w-5" />
        ) : follow ? (
          "已关注"
        ) : (
          "关注"
        )} */}
      </span>
      <Sparkle size={12} />
    </button>
  );
};

export default RankBtn;
