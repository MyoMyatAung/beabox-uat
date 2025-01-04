import { Setting, Person, Wallet, Creater, Level } from "@/assets/profile";
import MenuCard from "@/components/profile/menu-card";
import Stats from "@/components/profile/stats";
import VideoTabs from "@/components/profile/video-tabs";
import { stats } from "./data";
import { FaAngleRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { paths } from "@/routes/paths";
import { useGetMyProfileQuery } from "@/store/api/profileApi";
import { useSelector } from "react-redux";
import { ChevronRight, Menu, UserPen, Bell } from "lucide-react";
import { BsPatchCheckFill } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import SettingBtn from "@/components/profile/setting-btn";

const Profile = () => {
  const { data } = useGetMyProfileQuery("");
  const user = useSelector((state: any) => state.persist.user);
  // console.log(data, user);

  return (
    <div className="px-5 max-h-screen no-scrollbar profile-bg">
      <div className="flex gap-3 my-5 justify-end">
        <Link
          to={paths.noti}
          className="bg-[#FFFFFF12] w-10 h-10 rounded-full flex items-center justify-center"
        >
          <Bell />
        </Link>
        <SettingBtn />
      </div>
      {/* login  */}
      <div className="w-full flex items-center gap-3 py-5">
        <div className="w-[58px] h-[58px] rounded-full bg-[#FFFFFF12] flex justify-center items-center">
          <Person />
        </div>
        {!user?.token ? (
          <Link to={paths.login} className="flex items-center gap-2 flex-1">
            <span className="text-[18px] ">Login Or Sign Up</span>
            <ChevronRight size={18} />
          </Link>
        ) : (
          <div className="flex-1">
            <p className="text-[18px] flex items-center gap-2">
              {data?.data?.nickname}
              <span>
                <BsPatchCheckFill className="text-[#888]" />
              </span>{" "}
            </p>
            <div className="flex items-start gap-2 mt-1">
              <img src={data?.data?.level} className="w-14" alt="" />
              {/* <p className="flex items-center bg-[#F9DDF5] text-[#625386] text-[12px] font-bold py-[0.3px] px-5 rounded-full relative">
                <div className="absolute -left-3">
                  <Level />
                </div>
                <span>Lv 1</span>
              </p> */}
              <p className="text-[14px]">(ID {data?.data?.id})</p>
            </div>
          </div>
          // <button
          //   // onClick={() => dispatch(logOutUser())}
          //   className="bg-gradient-to-r from-[#FFB2E038] to-[#CD3EFF38] px-4 py-1 rounded-full shadow-md flex gap-1 items-center"
          // >
          //   <span className="mr-3 text-[14px] flex items-center gap-1">
          //     <span>{data?.data?.username}</span> <FaAngleRight />
          //   </span>
          //   <p className="flex items-center bg-[#F9DDF5] text-[#625386] text-[12px] font-bold py-[2px] px-3 rounded-full relative">
          //     <div className="absolute -left-3">
          //       <Level />
          //     </div>
          //     <span>Lv 1</span>
          //   </p>
          // </button>
        )}
      </div>
      {user?.token ? (
        <h1 className="text-[12px] text-[#888] mb-5 italic">
          {data?.data?.bio ? data?.data?.bio : ""}
        </h1>
      ) : (
        ""
      )}
      {/* Stats */}
      <Stats
        follower={user?.token ? stats.follower : 0}
        following={user?.token ? stats.following : 0}
        like={user?.token ? stats.like : 0}
      />

      {user?.token ? (
        <Link to={paths.profileDetail}>
          <Button className="w-full bg-[#FFFFFF0F] hover:bg-[#FFFFFF0F] rounded-[12px]">
            <UserPen /> Edit Profile
          </Button>
        </Link>
      ) : (
        <></>
      )}

      {/* Action Cards */}
      {/* <div className="grid grid-cols-2 gap-5">
        <MenuCard Icon={Wallet} title="My Wallet" />
        <MenuCard Icon={Creater} title="Creator Account" />
      </div> */}
      <VideoTabs login={user?.token} />
    </div>
  );
};

export default Profile;
