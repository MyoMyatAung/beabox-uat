import { useChangeFollowStatusMutation } from "@/store/api/profileApi";
import { setFollowStatus } from "@/store/slices/followSlice";
import { setIsDrawerOpen } from "@/store/slices/profileSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const FollowBtn = ({ id, followBack, refetch }: any) => {
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false);
  const user = useSelector((state: any) => state?.persist?.user);
  const followStatus =
    useSelector((state: any) => state?.follow?.status) ?? followBack;
  const [changeFollowStatus, { data }] = useChangeFollowStatusMutation();

  // Use Redux state if available, otherwise use prop
  const currentFollowState = followStatus[id] ?? followBack;

  const handleChangeFollowStatus = async () => {
    if (!user?.token) {
      dispatch(setIsDrawerOpen(true));
      return;
    }

    const newStatus = !currentFollowState;
    dispatch(setFollowStatus({ userId: id, isFollowing: newStatus })); // Update Redux immediately
    setIsProcessing(true);

    try {
      await changeFollowStatus({
        follow_user_id: id,
        status: newStatus ? "follow" : "unfollow",
      });
      if (data?.status) refetch();
    } catch (error) {
      console.error("Error changing follow status:", error);
      dispatch(setFollowStatus({ userId: id, isFollowing: !newStatus })); // Revert on error
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      disabled={isProcessing}
      onClick={handleChangeFollowStatus}
      className={`w-[88px] h-[33px] rounded-[8px] flex justify-center items-center text-[14px] ${
        currentFollowState
          ? "bg-[#FFFFFF0F] hover:bg-[#FFFFFF0F]"
          : "gradient-bg hover:gradient-bg"
      }`}
    >
      {currentFollowState ? "已关注" : "关注"}
    </button>
  );
};

export default FollowBtn;
