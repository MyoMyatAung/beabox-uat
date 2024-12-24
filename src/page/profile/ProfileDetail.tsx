import { paths } from "@/routes/paths";
import { Camera } from "lucide-react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import EditUsername from "@/components/profile/edit-username";
import EditGender from "@/components/profile/edit-gender";
import EditReferral from "@/components/profile/edit-referral";
import ChangePassword from "@/components/profile/change-password";
import EditBio from "@/components/profile/edit-bio";
import { useSelector } from "react-redux";
import { useGetMyProfileQuery } from "@/store/api/profileApi";
import { useEffect } from "react";

const Settings = () => {
  const user = useSelector((state: any) => state.persist.user);
  const { data, refetch } = useGetMyProfileQuery("");
  console.log(data?.data?.bio);

  // useEffect(() => {
  //   refetch();
  // }, []);

  return (
    <div className="w-full h-screen px-5">
      <div className="flex justify-between items-center py-5">
        <Link to={paths.profile}>
          <FaAngleLeft size={18} />
        </Link>
        <p className="text-[16px] mr-5">Profile</p>
        <div></div>
      </div>
      <div className="w-[80px] h-[80px] rounded-full bg-[#FFFFFF12] flex justify-center items-center mx-auto">
        <Camera />
      </div>
      <div className="flex flex-col gap-7 my-7">
        <h1 className="text-[12px] text-[#888]">About you</h1>
        <EditUsername username={data?.data?.username} />
        <EditGender />
        <div className="text-[14px] flex items-center justify-between">
          <h1>Region</h1>
          <p className="flex items-center gap-1 text-[#888]">
            Bangkok,Thailand <FaAngleRight />
          </p>
        </div>
        <div className="text-[14px] flex items-center justify-between">
          <h1>User ID</h1>
          <p className="flex items-center gap-1 text-[#888]">{user?.id}</p>
        </div>
        <EditBio bio={data?.data?.bio} />
      </div>
      <div className="w-full h-[0.08px] bg-[#FFFFFF0A]"></div>
      <div className="flex flex-col gap-7 my-7">
        <h1 className="text-[12px] text-[#888]">Invitation</h1>
        <EditReferral referral_code={data?.data?.referral_code} />
      </div>
      <div className="w-full h-[0.08px] bg-[#FFFFFF0A]"></div>
      <div className="flex flex-col gap-7 my-7">
        <h1 className="text-[12px] text-[#888]">Account Security</h1>
        <ChangePassword />
        {/* <div className="text-[14px] flex items-center justify-between">
          <h1>Change Password</h1>
          <p className="flex items-center gap-1 text-[#888]">
            <FaAngleRight />
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default Settings;
