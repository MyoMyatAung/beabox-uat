import { paths } from "@/routes/paths";
import { FaAngleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import SystemNotiLink from "@/components/profile/noti/system-noti-link";

const Noti = () => {
  return (
    <div className="w-full h-screen px-5 flex flex-col items-center justify-between">
      <div className="w-full">
        <div className="flex justify-between items-center py-5">
          <Link to={paths.profile}>
            <FaAngleLeft size={18} />
          </Link>
          <p className="text-[16px]">Notifications</p>
          <div></div>
        </div>
        <div className="">
          <SystemNotiLink />
        </div>
      </div>
    </div>
  );
};

export default Noti;
