// import { useChangeFollowStatusMutation } from "@/store/api/profileApi";
// import { Check, Sparkle } from "lucide-react";
// import { useEffect, useState } from "react";
// import loader from "@/page/home/vod_loader.gif";
// import { useDispatch, useSelector } from "react-redux";
// import { setIsDrawerOpen } from "@/store/slices/profileSlice";
// import { setFollowStatus } from "@/store/slices/followSlice";

// const RankBtn = ({ id, followBack, refetch }: any) => {
//   const dispatch = useDispatch();
//   const user = useSelector((state: any) => state?.persist?.user);
//   const followStatus = useSelector((state: any) => state?.follow?.status);

//   const [changeFollowStatus, { isLoading }] = useChangeFollowStatusMutation();

//   // Use Redux state if available, otherwise use prop
//   const currentFollowState = followStatus[id] ?? followBack;

//   const handleChangeFollowStatus = async () => {
//     if (!user?.token) {
//       dispatch(setIsDrawerOpen(true));
//       return;
//     }

//     const newStatus = !currentFollowState;
//     dispatch(setFollowStatus({ userId: id, isFollowing: newStatus })); // Update Redux immediately

//     try {
//       await changeFollowStatus({
//         follow_user_id: id,
//         status: newStatus ? "follow" : "unfollow",
//       });
//       // if (refetch) await refetch(); // Only refetch if needed
//     } catch (error) {
//       console.error("Error changing follow status:", error);
//       dispatch(setFollowStatus({ userId: id, isFollowing: !newStatus })); // Revert on error
//     }
//   };

//   // Sync with prop changes when component mounts or prop changes
//   useEffect(() => {
//     if (followBack !== undefined && followStatus[id] === undefined) {
//       dispatch(setFollowStatus({ userId: id, isFollowing: followBack }));
//     }
//   }, [followBack, id, dispatch, followStatus]);
//   return (
//     <button
//       disabled={isLoading}
//       onClick={handleChangeFollowStatus}
//       className={`text-[14px] z-[1000] flex items-center justify-between rounded-[8px] px-1 py-1.5 ${
//         currentFollowState
//           ? "bg-[#2B2830] hover:bg-[#2B2830]"
//           : "gradient-bg hover:gradient-bg"
//       } w-full`}
//     >
//       <div></div>
//       <span
//         className={`text-[14px] flex items-center gap-2 ${
//           currentFollowState ? "ml-2" : "ml-0"
//         }`}
//       >
//         {currentFollowState ? "已关注" : "关注"}
//       </span>
//       {currentFollowState ? <Check size={14} /> : <div></div>}
//     </button>
//   );
// };

// export default RankBtn;

import { useChangeFollowStatusMutation } from "@/store/api/profileApi";
import { setFollowStatus } from "@/store/slices/followSlice";
import { setIsDrawerOpen } from "@/store/slices/profileSlice";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const RankBtn = ({ id, followBack, refetch }: any) => {
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false);
  const user = useSelector((state: any) => state?.persist?.user);
  const followStatus = useSelector((state: any) => state?.follow?.status) ?? followBack;
  const [changeFollowStatus] = useChangeFollowStatusMutation();

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
      className={`text-[14px] z-[1000] flex items-center justify-between rounded-[8px] px-1 py-1.5 ${
        currentFollowState
          ? "bg-[#2B2830] hover:bg-[#2B2830]"
          : "gradient-bg hover:gradient-bg"
      } w-full`}
    >
      <div></div>
      {currentFollowState ? "已关注" : "关注"}
      {currentFollowState ? <Check size={14} /> : <div></div>}
    </button>
  );
};

export default RankBtn;
