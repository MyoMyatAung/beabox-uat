import { paths } from "@/routes/paths";
import backButton from "../../../assets/backButton.svg";
import { Link } from "react-router-dom";
import Card from "@/components/profile/noti/card";
const SystemNoti = () => {
  return (
    <div className="w-full h-screen px-5 flex flex-col items-center justify-between no-scrollbar">
      <div className="w-full">
        <div className="flex justify-between items-center py-5 sticky top-0 bg-black z-50">
          <Link to={paths.noti}>
            {/* <FaAngleLeft size={22} /> */}
            <img src={backButton} alt="" />
          </Link>
          <p className="text-[16px]">System Notification</p>
          <div></div>
        </div>
        <div className="space-y-5 pb-10">
          <Card type={true} />
          <Card type={true} />

          <p className="text-[14px] text-[#666] text-center">
            14-10-2024 12:24:10
          </p>
          <Card type={true} />
          <Card type={true} />
        </div>
      </div>
    </div>
  );
};

export default SystemNoti;
