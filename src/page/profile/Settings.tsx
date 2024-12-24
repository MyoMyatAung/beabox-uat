import { paths } from "@/routes/paths";
import { FaAngleLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { Globe, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditLanguage from "@/components/profile/edit-language";
import { logOutUser } from "@/store/slices/persistSlice";
import { useDispatch } from "react-redux";

const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div className="w-full h-screen px-5 flex flex-col items-center justify-between">
      <div className="top flex flex-col gap-5 w-full">
        <div className="flex justify-between items-center py-5">
          <Link to={paths.profile}>
            <FaAngleLeft size={18} />
          </Link>
          <p className="text-[16px]">Profile</p>
          <div></div>
        </div>

        <EditLanguage />

        <div className="border-b border-white/10"></div>
        <div className="flex justify-between items-center">
          <p className="flex items-center gap-1 text-[14px]">Current Version</p>
          <p className="flex items-center gap-1 text-[14px]">
            V 8.0.4 <ChevronRight size={15} className="text-[#777777]" />
          </p>
        </div>
        <div className="border-b border-white/10"></div>
        <div className="flex justify-between items-center">
          <p className="flex items-center gap-1 text-[14px]">Clear Cache</p>
          <p className="flex items-center gap-1 text-[14px]">
            V 8.0.4 <ChevronRight size={15} className="text-[#777777]" />
          </p>
        </div>
        <div className="border-b border-white/10"></div>
        <div className="flex justify-between items-start">
          <div className="">
            <p className="text-[14px]">Private Profile</p>
            <p className="text-[12px] w-[230px] text-[#888]">
              No one can see your posts and alos followers, or following list
            </p>
          </div>
          <label className="switch">
            <input type="checkbox" />
            <span className="slider round"></span>
          </label>
        </div>
        <div className="border-b border-white/10"></div>
        <div className="flex justify-between items-start">
          <div className="">
            <p className="text-[14px]">Allowed Liked video Visibility</p>
            <p className="text-[12px] w-[230px] text-[#888]">
              public can see the videos you've liked.
            </p>
          </div>
          <label className="switch">
            <input type="checkbox" />
            <span className="slider round"></span>
          </label>
        </div>
      </div>
      <div className="bot w-full py-5">
        <Button
          onClick={() => {
            dispatch(logOutUser());
            navigate(paths.profile);
          }}
          className="w-full rounded-lg bg-[#1C1A22] hover:bg-[#1C1A22]"
        >
          Log Out
        </Button>
      </div>
    </div>
  );
};

export default Settings;
