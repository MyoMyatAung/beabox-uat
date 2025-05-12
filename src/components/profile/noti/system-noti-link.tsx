import System from "@/assets/profile/system1.png";
import { paths } from "@/routes/paths";
import { useNavigate } from "react-router-dom";

const SystemNotiLink = () => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(paths.system_noti)}
      className="system flex items-start gap-2"
    >
      <img src={System} className="w-10 h-10 mt-1" alt="" />
      <div className="w-full">
        <div className="flex items-center text-[14px] justify-between font-bold">
          <p>System Notification</p>
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
        </div>
        <div className="flex items-end justify-between ">
          <p className="text-[10px] w-[80%]">
            Exciting New Features Available Now! : Discover the latest updates
            to enhan...{" "}
          </p>
          <p className="text-[10px] text-[#888]">1 min</p>
        </div>
      </div>
    </div>
  );
};

export default SystemNotiLink;
