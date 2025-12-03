import upload from "@/assets/createcenter/upload.svg";
import TopNav from "@/components/create-center/top-nav";
import YourVideos from "@/components/create-center/your-videos";
import ViewAll from "@/components/create-center/view-all";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { paths } from "@/routes/paths";
import { setIsDrawerOpen } from "@/store/slices/profileSlice";
import { setFollowStatus } from "@/store/slices/followSlice";
import RankList from "@/components/ranking/rank-list";
import CreatorRankingSection from "@/components/create-center/creator-ranking-section";
import { useGetTopListQuery } from "@/store/api/createCenterApi";
import { useChangeFollowStatusMutation } from "@/store/api/profileApi";

const CreateCenter = () => {
  const user = useSelector((state: any) => state?.persist?.user) || "";
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { data } = useGetTopListQuery("");
  const [changeFollowStatus] = useChangeFollowStatusMutation();
  const followStatus = useSelector((state: any) => state?.follow?.status);

  const fromState = (location.state as { from?: string } | null) || null;
  const backPath = fromState?.from || paths.profile;

  const handleFollow = async (userId: string, isFollowed: boolean) => {
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
    } catch (error) {
      console.error("Error changing follow status:", error);
      dispatch(setFollowStatus({ userId, isFollowing: !newStatus }));
    }
  };

  return (
    <div className="h-screen flex flex-col hide-sb max-w-[480px] mx-auto">
      <TopNav
        styles={"ml-4"}
        center={"创作者中心"}
        left={() => {
          navigate(backPath);
        }}
        right={
          <div
            onClick={
              user?.token
                ? () => navigate(paths.creator_upload_video)
                : () => dispatch(setIsDrawerOpen(true))
            }
            className="flex items-center gap-1"
          >
            <img src={upload} alt="" />
            <p className="text-[16px]">创作</p>
          </div>
        }
      />
      <div className="space-y-4">
        <div className="px-5">
          <YourVideos />
        </div>
        <div className="px-5">
          <ViewAll />
        </div>
        <CreatorRankingSection
          data={data}
          handleFollow={handleFollow}
          user={user}
          followStatus={followStatus}
        />
        <div className="px-5 pb-5">
          <RankList />
        </div>
      </div>
      {/* <div className="grid grid-cols-2 items-center w-full justify-center p-5 gap-3">
        <div className="flex-1">
          <ViewAll />
        </div>
        <div className="flex-1">
          <WalletDetails />
        </div>
      </div> */}
      {/* <Ads /> */}
      <div className="pb-10"></div>
    </div>
  );
};

export default CreateCenter;
