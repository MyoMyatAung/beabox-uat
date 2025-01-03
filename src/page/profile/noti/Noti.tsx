import { paths } from "@/routes/paths";
import { FaAngleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import SystemNotiLink from "@/components/profile/noti/system-noti-link";
import BalanceNotiLink from "@/components/profile/noti/balance-noti-link";
import OtherNoti from "@/components/profile/noti/other-noti";

const Noti = () => {
  return (
    <div className="w-full h-screen px-5 flex flex-col items-center justify-between no-scrollbar">
      <div className="w-full">
        <div className="flex justify-between items-center py-5 sticky top-0 bg-black z-50">
          <Link to={paths.profile}>
            <FaAngleLeft size={18} />
          </Link>
          <p className="text-[16px]">Notifications</p>
          <div></div>
        </div>
        <div className="space-y-5 pb-10">
          <SystemNotiLink />
          <BalanceNotiLink />
          <OtherNoti />
        </div>
      </div>
    </div>
  );
};

export default Noti;
