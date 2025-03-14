import tips from "@/assets/createcenter/tips.png";
import TopNav from "@/components/create-center/top-nav";
import YourVideos from "@/components/create-center/your-videos";
import WalletDetails from "@/components/create-center/wallet-details";
import ViewAll from "@/components/create-center/view-all";
import { useGetTopCreatorQuery } from "@/store/api/createCenterApi";

const CreateCenter = () => {
  const { data } = useGetTopCreatorQuery("");
  console.log(data);
  return (
    <>
      <TopNav center={"Creator Centre"} />
      <YourVideos />
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
