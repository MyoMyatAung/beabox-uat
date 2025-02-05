import { paths } from "@/routes/paths";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import SettingBtn from "./setting-btn";

const ScrollHeader = ({ photo, name, setShow }: any) => {
  return (
    <>
      <div className="z-[1500] sticky top-0 px-5 flex justify-between items-center w-full py-5">
        <div className="flex items-center gap-3">
          <img
            className="w-[58px] z-[1500] h-[58px] rounded-full object-cover object-center"
            src={photo}
            alt=""
          />
          <p className="z-[1500]">{name}</p>
        </div>
        <div className="flex gap-3 z-[1500] items-center">
          <Link
            to={paths.noti}
            className="z-[1500] bg-[#FFFFFF12] w-10 h-10 rounded-full flex items-center justify-center"
          >
            <Bell />
          </Link>
          <SettingBtn setShow={setShow} />
        </div>
      </div>
    </>
  );
};

export default ScrollHeader;
