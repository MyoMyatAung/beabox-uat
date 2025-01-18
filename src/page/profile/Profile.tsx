import Stats from "@/components/profile/stats";
import { Person } from "@/assets/profile";

import VideoTabs from "@/components/profile/video-tabs";
import { stats } from "./data";
import { Link } from "react-router-dom";
import { paths } from "@/routes/paths";
import { useGetMyProfileQuery } from "@/store/api/profileApi";
import { useSelector } from "react-redux";
import {
  ChevronRight,
  UserPen,
  Bell,
  Cross,
  X,
  PencilLine,
} from "lucide-react";
import { BsPatchCheckFill } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import SettingBtn from "@/components/profile/setting-btn";
import ProfileAvatar from "@/components/profile/profile-avatar";
import phoneImg from "@/assets/profile/phone-img.png";
import { useState } from "react";
import Loader from "@/components/shared/loader";
import MaleSVG from "@/assets/profile/male";
import FemaleSVG from "@/assets/profile/female";

const Profile = () => {
  const { data, isLoading } = useGetMyProfileQuery("");
  const [show, setShow] = useState(false);
  const user = useSelector((state: any) => state.persist.user);
  const gender = useSelector((state: any) => state.persist.gender);
  const region = useSelector((state: any) => state.persist.region);
  if (isLoading) return <Loader />;
  console.log(region?.city?.length + region?.province?.length);

  return (
    <div className="px-5 max-h-screen no-scrollbar profile-bg">
      {show ? (
        <div className="absolute top-0 z-[1100] left-0 w-full h-full mx-auto flex flex-col justify-center items-center bg-[#161619CC]">
          <div className="px-10">
            <div className="h-[250px] gradient-bg rounded-lg relative">
              <div className="w-full absolute -top-20 flex justify-center items-center">
                <img src={phoneImg} className={`w-[180px]`} alt="" />
              </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-4 bg-[#161619] p-5 rounded-bl-lg rounded-br-lg">
              <h1 className="text-[18px] font-semibold text-white">
                Creator Centre
              </h1>
              <p className="text-[14px] text-[#FFFFFFCC]">
                Introducing Creator Centers: your new hub to discover top
                creators, view rankings, watch the most popular videos, and
                explore fresh content—all in one place.{" "}
              </p>
              <Button className="bg-[#FFFFFF14] hover:bg-[#FFFFFF14]">
                Coming soon, stay tuned!
              </Button>
            </div>
          </div>
          <div
            onClick={() => setShow(false)}
            className="bg-[#FFFFFF29] p-2 rounded-full mt-5"
          >
            <X />
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="flex my-5 justify-between items-center">
        <div className="flex gap-2 bg-[#FFFFFF14] px-4 justify-center py-1 rounded-lg items-center">
          <PencilLine size={14} />
          <p className="text-[12px]">Edit Cover</p>
        </div>
        <div className="flex gap-3 items-center">
          <Link
            to={paths.noti}
            className="bg-[#FFFFFF12] w-10 h-10 rounded-full flex items-center justify-center"
          >
            <Bell />
          </Link>
          <SettingBtn setShow={setShow} />
        </div>
      </div>
      {/* login  */}
      <div className="w-full flex items-center gap-3 py-5">
        {!user?.token ? (
          <div className="w-[58px] h-[58px] rounded-full bg-[#FFFFFF12] flex justify-center items-center p-2">
            <Person />
          </div>
        ) : (
          <ProfileAvatar
            progress={data?.data?.level_progress}
            levelImage={data?.data?.level}
            photo={data?.data?.profile_photo}
          />
        )}
        {!user?.token ? (
          <Link to={paths.login} className="flex items-center gap-2 flex-1">
            <span className="text-[18px] ">Login Or Sign Up</span>
            <ChevronRight size={18} />
          </Link>
        ) : (
          <div className="flex-1 flex flex-col gap-0.5">
            <p className="text-[18px] flex items-center gap-1">
              {data?.data?.nickname}
              <span>{gender == "Male" ? <MaleSVG /> : <FemaleSVG />}</span>
              {/* <span>
                <BsPatchCheckFill className="text-[#888]" />
              </span>{" "} */}
            </p>
            <p className="text-[14px] text-[#BBBBBB]">
              ID - {data?.data?.user_code}
            </p>
            {region ? (
              <div className="flex">
                <div className="text-[12px] flex items-center gap-1 text-[#BBBBBB] bg-[#FFFFFF1F] px-3 pt-1 rounded-full justify-center shrink-0">
                  <span>{region?.city}</span>,<span>{region?.province}</span>
                </div>
              </div>
            ) : (
              <></>
            )}
            {/* <div className="flex items-start gap-2 mt-1">
              <img src={data?.data?.level} className="w-14" alt="" />
              <p className="text-[14px]">(ID {data?.data?.user_code})</p>
            </div> */}
          </div>
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
      <Stats />

      {user?.token ? (
        <Link to={paths.profileDetail}>
          <Button className="w-full bg-[#FFFFFF0F] hover:bg-[#FFFFFF0F] rounded-[12px]">
            <UserPen /> Edit Profile
          </Button>
        </Link>
      ) : (
        <></>
      )}
      <VideoTabs login={user?.token} />
    </div>
  );
};

export default Profile;
