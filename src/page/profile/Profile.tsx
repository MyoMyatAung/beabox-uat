import {
  Bell,
  Setting,
  Person,
  Wallet,
  Creater,
  Level,
} from "@/assets/profile";
import MenuCard from "@/components/profile/menu-card";
import Stats from "@/components/profile/stats";
import VideoTabs from "@/components/profile/video-tabs";
import { stats } from "./data";
import { FaAngleRight } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import { paths } from "@/routes/paths";

const Profile = () => {
  const [login, setLogin] = useState(false);
  return (
    <div className="px-5">
      <div className="flex gap-3 my-5 justify-end">
        <div className="bg-[#FFFFFF12] w-10 h-10 rounded-full flex items-center justify-center">
          <Bell />
        </div>
        <Link
          to={paths.settings}
          className="bg-[#FFFFFF12] w-10 h-10 rounded-full flex items-center justify-center"
        >
          <Setting />
        </Link>
      </div>
      {/* login  */}
      <div className="w-full flex flex-col justify-center items-center gap-3 py-5">
        <div className="w-[56px] h-[56px] rounded-full bg-[#FFFFFF12] flex justify-center items-center">
          <Person />
        </div>
        {!login ? (
          <p className="text-[14px]" onClick={() => setLogin(true)}>
            Login Or Sign Up
          </p>
        ) : (
          <button
            onClick={() => setLogin(false)}
            className="bg-gradient-to-r from-[#FFB2E038] to-[#CD3EFF38] px-4 py-1 rounded-full shadow-md flex gap-1 items-center"
          >
            <span className="mr-3 text-[14px] flex items-center gap-1">
              <span>Kimmy</span> <FaAngleRight />
            </span>
            <p className="flex items-center bg-[#F9DDF5] text-[#625386] text-[12px] font-bold py-[2px] px-3 rounded-full relative">
              <div className="absolute -left-3">
                <Level />
              </div>
              <span>Lv 1</span>
            </p>
          </button>
        )}
      </div>
      {/* Stats */}
      <Stats
        follower={login ? stats.follower : 0}
        following={login ? stats.following : 0}
        like={login ? stats.like : 0}
      />

      {login ? (
        <h1 className="text-center text-[12px] text-[#888] mb-5">
          “Here is My Bio Tag Line”
        </h1>
      ) : (
        ""
      )}

      {/* Action Cards */}
      <div className="grid grid-cols-2 gap-5">
        <MenuCard Icon={Wallet} title="My Wallet" />
        <MenuCard Icon={Creater} title="Creator Account" />
      </div>
      <VideoTabs login={login} />
    </div>
  );
};

export default Profile;
