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
import {
  useGetMyOwnProfileQuery,
  useGetMyProfileQuery,
} from "@/store/api/profileApi";
import { useEffect, useState } from "react";
import { setProfileData } from "@/store/slices/persistSlice";
import EditNickName from "@/components/profile/edit-nickname";
import EditRegion from "@/components/profile/edit-region";
import ImageUpload from "@/components/profile/image-upload";
import TranLoader from "@/components/shared/tran-loader";
import backButton from "../../assets/backButton.svg";

const ProfileDetail = () => {
  const user = useSelector((state: any) => state?.persist?.user);
  const profileData = useSelector((state: any) => state?.persist?.profileData);
  const [decryptedPhoto, setDecryptedPhoto] = useState("");
  const decryptImage = (arrayBuffer: any, key = 0x12, decryptSize = 4096) => {
    const data = new Uint8Array(arrayBuffer);
    const maxSize = Math.min(decryptSize, data.length);
    for (let i = 0; i < maxSize; i++) {
      data[i] ^= key;
    }
    // Decode the entire data as text.
    return new TextDecoder().decode(data);
  };
  const private_profile = useSelector(
    (state: any) => state.persist.private_profile
  );
  const { data, refetch } = useGetMyOwnProfileQuery("");
  const dispatch = useDispatch();
  const refetchHandler = async () => {
    await refetch();
  };

  // console.log(data, "pddata");
  useEffect(() => {
    if (data?.status) dispatch(setProfileData(data?.data));
  }, []);

  useEffect(() => {
    const loadAndDecryptPhoto = async () => {
      if (!user?.token || !data?.data?.profile_photo) {
        setDecryptedPhoto("");
        return;
      }

      try {
        const photoUrl = data.data.profile_photo;

        // If it's not a .txt file, assume it's already a valid URL
        if (!photoUrl.endsWith(".txt")) {
          setDecryptedPhoto(photoUrl);
          return;
        }

        // Fetch encrypted image data
        const response = await fetch(photoUrl);
        const arrayBuffer = await response.arrayBuffer();

        // Decrypt the first 4096 bytes and decode as text.
        const decryptedStr = decryptImage(arrayBuffer);

        // Set the decrypted profile photo source
        setDecryptedPhoto(decryptedStr);
      } catch (error) {
        console.error("Error loading profile photo:", error);
        setDecryptedPhoto("");
      }
    };

    loadAndDecryptPhoto();
  }, [data?.data?.profile_photo, user?.token]);

  useEffect(() => {
    refetch();
  }, [private_profile]);

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
        <ImageUpload imgurl={decryptedPhoto} />
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
          <EditRegion province={data?.data?.province} city={data?.data?.city} />
          {/* <div className="text-[14px] flex items-center justify-between">
          <h1>Region</h1>
          <p className="flex items-center gap-1 text-[#888]">
            Bangkok,Thailand <FaAngleRight />
          </p>
        </div> */}
          <div className="text-[14px] flex items-center justify-between">
            <h1>用户身份</h1>
            <p className="flex items-center gap-1 text-[#888]">
              {profileData?.user_code}
            </p>
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
