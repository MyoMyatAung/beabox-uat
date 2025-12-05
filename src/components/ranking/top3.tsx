import { useDispatch, useSelector } from "react-redux";
import { RankCard } from "@/components/create-center/creator-ranking-section";
import { useChangeFollowStatusMutation } from "@/store/api/profileApi";
import { setFollowStatus } from "@/store/slices/followSlice";
import { setIsDrawerOpen } from "@/store/slices/profileSlice";

const Top3 = ({ rankingData, refetch }: any) => {
  const top3 = rankingData?.slice(0, 3);
  const user = useSelector((state: any) => state?.persist?.user) || "";
  const followStatus = useSelector((state: any) => state?.follow?.status);
  const dispatch = useDispatch();
  const [changeFollowStatus] = useChangeFollowStatusMutation();

  const handleFollow = async (userId: string, isFollowed: boolean) => {
    if (!userId) return;
    if (!user?.token) {
      dispatch(setIsDrawerOpen(true));
      return;
    }
    const newStatus = !isFollowed;
    dispatch(setFollowStatus({ userId, isFollowing: newStatus }));
    try {
      await changeFollowStatus({
        follow_user_id: userId,
        status: newStatus ? "follow" : "unfollow",
      });
      if (refetch) {
        refetch();
      }
    } catch (error) {
      dispatch(setFollowStatus({ userId, isFollowing: !newStatus }));
    }
  };

  // console.log(top3);

  return (
    <div className="w-full pt-5">
      <div className="flex justify-center items-end px-1">
        <div className="w-1/3 px-1">
          <RankCard
            rank={2}
            rankData={top3?.[1]}
            isFollowed={followStatus?.[top3?.[1]?.id] ?? top3?.[1]?.is_followed}
            user={user}
            handleFollow={handleFollow}
            variant="large"
          />
        </div>
        <div className="w-1/3 px-1 pb-5">
          <RankCard
            rank={1}
            rankData={top3?.[0]}
            isFollowed={followStatus?.[top3?.[0]?.id] ?? top3?.[0]?.is_followed}
            user={user}
            handleFollow={handleFollow}
            variant="large"
          />
        </div>
        <div className="w-1/3 px-1">
          <RankCard
            rank={3}
            rankData={top3?.[2]}
            isFollowed={followStatus?.[top3?.[2]?.id] ?? top3?.[2]?.is_followed}
            user={user}
            handleFollow={handleFollow}
            variant="large"
          />
        </div>
      </div>
    </div>
  );
};

export default Top3;
