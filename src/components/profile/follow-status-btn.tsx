import { Button } from "@/components/ui/button";
import { useChangeFollowStatusMutation } from "@/store/api/profileApi";
import loader from "@/page/home/vod_loader.gif";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsDrawerOpen } from "@/store/slices/profileSlice";
import { setFollowStatus, setPendingStatus } from "@/store/slices/followSlice";

const FollowStatusBtn = ({ userData, id, refetch, userLoading }: any) => {
  const dispatch = useDispatch();
  const token = useSelector((state: any) => state?.persist?.user?.token);
  // console.log(userData, "userData?.is_following");
  const followState =
    useSelector((state: any) => state.follow.status[id]) ??
    userData?.data?.is_following;
  const isPending = useSelector((state: any) => state.follow.pending[id]);
  const [changeFollowStatus] = useChangeFollowStatusMutation();

  // Initialize with server data if not in Redux
  useEffect(() => {
    if (
      userData?.data?.is_following !== undefined &&
      followState === undefined
    ) {
      dispatch(
        setFollowStatus({
          userId: id,
          isFollowing: userData.data.is_following,
        })
      );
    }
  }, [userData?.data?.is_following, id, dispatch, followState]);

  const handleFollowAction = async () => {
    if (!token) {
      dispatch(setIsDrawerOpen(true));
      return;
    }

    const newStatus = !followState;

    // Optimistic update
    dispatch(setFollowStatus({ userId: id, isFollowing: newStatus }));
    dispatch(setPendingStatus({ userId: id, isPending: true }));

    try {
      await changeFollowStatus({
        follow_user_id: id,
        status: newStatus ? "follow" : "unfollow",
      });
      // Optional: refetch if needed for other data
      if (refetch) await refetch();
    } catch (error) {
      console.error("Follow action failed:", error);
      // Revert on error
      dispatch(
        setFollowStatus({
          userId: id,
          isFollowing: !newStatus,
        })
      );
    } finally {
      dispatch(setPendingStatus({ userId: id, isPending: false }));
    }
  };

  return (
    <button
      disabled={isPending || userLoading}
      onClick={handleFollowAction}
      className={`w-full ${
        followState
          ? "bg-[#FFFFFF0F] hover:bg-[#FFFFFF0F]"
          : "gradient-bg hover:gradient-bg"
      } rounded-[12px] z-[1200] h-[51px] flex justify-center items-center`}
    >
      {followState ? "已关注" : "关注"}
    </button>
  );
};

export default FollowStatusBtn;
