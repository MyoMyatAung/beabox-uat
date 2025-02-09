import { paths } from "@/routes/paths";
import { Camera } from "lucide-react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import EditUsername from "@/components/profile/edit-username";
import EditGender from "@/components/profile/edit-gender";
import EditReferral from "@/components/profile/edit-referral";
import ChangePassword from "@/components/profile/change-password";
import EditBio from "@/components/profile/edit-bio";
import { useDispatch, useSelector } from "react-redux";
import { useGetMyProfileQuery } from "@/store/api/profileApi";
import { useEffect } from "react";
import { setProfileData } from "@/store/slices/persistSlice";
import EditNickName from "@/components/profile/edit-nickname";
import EditRegion from "@/components/profile/edit-region";
import ImageUpload from "@/components/profile/image-upload";
import TranLoader from "@/components/shared/tran-loader";
import backButton from "../../assets/backButton.svg";

const ProfileDetail = () => {
  const user = useSelector((state: any) => state.persist.user);
  const profileData = useSelector((state: any) => state.persist.profileData);
  const private_profile = useSelector(
    (state: any) => state.persist.private_profile
  );
  const { data, refetch } = useGetMyProfileQuery("");
  const dispatch = useDispatch();
  const refetchHandler = async () => {
    await refetch();
  };
  useEffect(() => {
    if (data?.status) dispatch(setProfileData(data?.data));
  }, []);

  useEffect(() => {
    refetch();
  }, [private_profile]);

  // console.log(profileData)
  // console.log(data?.data?.profile_photo);

  // useEffect(() => {
  //   refetch();
  // }, [bio, refetch, gender]);
  return (
    <>
      {/* <TranLoader /> */}
      <div className="w-full h-screen px-5 bg-[#16131C]">
        <div className="flex justify-between items-center py-5">
          <Link to={paths.profile}>
            {/* <FaAngleLeft size={22} /> */}
            <img src={backButton} alt="" />
          </Link>
          <p className="text-[16px] mr-5">资料</p>
          <div></div>
        </div>
        <ImageUpload imgurl={data?.data?.profile_photo} />
        <div className="flex flex-col gap-7 my-7">
          <h1 className="text-[12px] text-[#888]">关于你</h1>
          <EditUsername
            username={data?.data?.username}
            refetchHandler={refetchHandler}
          />
          <EditNickName
            nickname={data?.data?.nickname}
            refetchHandler={refetchHandler}
          />
          <EditGender />
          <EditRegion />
          {/* <div className="text-[14px] flex items-center justify-between">
          <h1>Region</h1>
          <p className="flex items-center gap-1 text-[#888]">
            Bangkok,Thailand <FaAngleRight />
          </p>
        </div> */}
          <div className="text-[14px] flex items-center justify-between">
            <h1>用户身份</h1>
            <p className="flex items-center gap-1 text-[#888]">{profileData?.user_code}</p>
          </div>
          <EditBio bio={data?.data?.bio} refetchHandler={refetchHandler} />
        </div>
        <div className="w-full h-[0.08px] bg-[#FFFFFF0A]"></div>
        <div className="flex flex-col gap-7 my-7">
          <h1 className="text-[12px] text-[#888]">邀请函</h1>
          <EditReferral referral_code={data?.data?.referral_code} />
        </div>
        <div className="w-full h-[0.08px] bg-[#FFFFFF0A]"></div>
        {/* <div className="flex flex-col gap-7 my-7">
        <h1 className="text-[12px] text-[#888]">Account Security</h1>
        <ChangePassword />
      </div> */}
      </div>
    </>
  );
};

export default ProfileDetail;
