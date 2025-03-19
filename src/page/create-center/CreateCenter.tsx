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

const CreateCenter = () => {
  const user = useSelector((state: any) => state?.persist?.user) || "";
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <>
      <TopNav
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
      <Ads />
      <div className="grid grid-cols-2 items-center w-full justify-center p-5 gap-3">
        <div className="flex-1">
          <ViewAll />
        </div>
        <div className="flex-1">
          <WalletDetails />
        </div>
      </div>
      {/* <ViewAll />
      <div className="mt-5 rounded-full mx-5 pb-10">
        <img src={tips} className="w-full" alt="" />
      </div> */}
    </>
  );
};

export default CreateCenter;
