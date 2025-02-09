import { paths } from "@/routes/paths";
// import { FaAngleLeft } from "react-icons/fa";
import backButton from "../../../assets/backButton.svg";
import { Link } from "react-router-dom";
import Card from "@/components/profile/noti/card";
const BalanceNoti = () => {
  return (
    <div className="w-full h-screen px-5 flex flex-col items-center justify-between no-scrollbar">
      <div className="w-full">
        <div className="flex justify-between items-center py-5 sticky top-0 bg-black z-50">
          <Link to={paths.noti}>
            {/* <FaAngleLeft size={22} /> */}
            <img src={backButton} alt="" />
          </Link>
          <p className="text-[16px]">Balance Alert</p>
          <div></div>
        </div>
        <div className="space-y-5 pb-10">
          <Card />
          <Card />
          <p className="text-[12px] text-[#666] text-center">
            14-10-2024 12:24:10
          </p>
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
      </div>
    </div>
  );
};

export default BalanceNoti;
