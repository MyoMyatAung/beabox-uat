import upload from "@/assets/createcenter/upload.svg";
import TopNav from "@/components/create-center/top-nav";
import YourVideos from "@/components/create-center/your-videos";
import WalletDetails from "@/components/create-center/wallet-details";
import ViewAll from "@/components/create-center/view-all";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { paths } from "@/routes/paths";
import { setIsDrawerOpen } from "@/store/slices/profileSlice";
import Ads from "@/components/create-center/ads";
import OtherAds from "@/components/profile/other-ads";
import RankList from "@/components/ranking/rank-list";

const CreateCenter = () => {
  const user = useSelector((state: any) => state?.persist?.user) || "";
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <>
      <TopNav
        styles={"ml-4"}
        center={"创作者中心"}
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
      <YourVideos />
      <div className="px-5">{/* <OtherAds /> */}</div>
      <div className="p-5">
        <ViewAll />
      </div>
      <div className="px-5 pb-5">
        <RankList />
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
    </>
  );
};

export default CreateCenter;
