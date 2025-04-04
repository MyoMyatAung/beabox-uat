import { Button } from "@/components/ui/button";
import { useChangeFollowStatusMutation } from "@/store/api/profileApi";
import { setIsDrawerOpen } from "@/store/slices/profileSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import loader from "@/page/home/vod_loader.gif";

const FollowBtn = ({ id, followBack, refetch }: any) => {
  const [follow, setFollow] = useState(followBack ? true : false);
  const user = useSelector((state: any) => state?.persist?.user);
  const dispatch = useDispatch();
  const [changeFollowStatus, { data, isLoading }] =
    useChangeFollowStatusMutation();
  const handleChangeFollowStatus = async () => {
    await changeFollowStatus({
      follow_user_id: id,
      status: followBack ? "unfollow" : "follow",
    });
    await refetch();
    setFollow(!follow);
  };

  
  return (
    <button
      disabled={isLoading}
      onClick={
        user?.token
          ? () => handleChangeFollowStatus()
          : () => dispatch(setIsDrawerOpen(true))
      }
      className={`w-[88px] h-[33px] rounded-[8px] flex justify-center items-center text-[14px] ${
        follow
          ? "bg-[#FFFFFF0F] hover:bg-[#FFFFFF0F]"
          : "gradient-bg hover:gradient-bg"
      }`}
    >
      {isLoading ? (
        <img src={loader} alt="" className="w-12" />
      ) : follow ? (
        "已关注"
      ) : (
        "关注"
      )}
      {/* {follow ? "已关注" : "关注"} */}
    </button>
  );
};

export default FollowBtn;
