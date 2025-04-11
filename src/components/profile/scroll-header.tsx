import { paths } from "@/routes/paths";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import SettingBtn from "./setting-btn";
import { Person } from "@/assets/profile";
import AsyncDecryptedImage from "@/utils/asyncDecryptedImage";

interface ScrollHeaderProps {
  photo: string;
  name: string;
  setShow: (show: boolean) => void;
}

const ScrollHeader = ({
  photo,
  name,
  setShow,
}: ScrollHeaderProps) => {
  return (
    <div className="flex justify-between items-center w-full z-[1800] relative">
      <div className="flex items-center gap-3">
        {photo ? (
          <AsyncDecryptedImage
            imageUrl={photo}
            className="w-[48px] z-[1500] h-[48px] rounded-full object-cover object-center"
            alt="Profile"
          />
        ) : (
          <div className="w-[48px] h-[48px] rounded-full bg-[#FFFFFF12] flex justify-center items-center p-2">
            <Person />
          </div>
        )}

        <p className="z-[1500]">{name}</p>
      </div>
      <div className="flex gap-3 z-[1500] items-center">
        <Link
          to={paths.noti}
          className="z-[1200] bg-[#FFFFFF12] w-10 h-10 rounded-full flex items-center justify-center"
        >
          <Bell />
        </Link>
        <SettingBtn setShow={setShow} />
      </div>
    </div>
  );
};

export default ScrollHeader;
