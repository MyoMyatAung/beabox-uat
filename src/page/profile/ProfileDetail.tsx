import { paths } from "@/routes/paths";
import { Camera } from "lucide-react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import EditUsername from "@/components/profile/edit-username";
import EditGender from "@/components/profile/edit-gender";
import EditReferral from "@/components/profile/edit-referral";
import EditBio from "@/components/profile/edit-bio";
import { useDispatch, useSelector } from "react-redux";
import { useGetMyOwnProfileQuery } from "@/store/api/profileApi";
import { useEffect, useState } from "react";
import { setProfileData } from "@/store/slices/persistSlice";
import EditNickName from "@/components/profile/edit-nickname";
import EditRegion from "@/components/profile/edit-region";
import logo from "@/assets/logo.svg";
import backButton from "../../assets/backButton.svg";
import Avatars from "@/components/avatar/avatars";
import ProfilePhotoUpload from "@/components/shared/profile-photo-upload";
import { useGetConfigQuery } from "@/store/api/createCenterApi";
import Loader from "@/components/shared/loader";

const ProfileDetail = () => {
  const [showAvatar, setShowAvatar] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [srcImg, setSrcImg] = useState("");
  const [avatarId, setAvatarId] = useState("");
  const user = useSelector((state: any) => state?.persist?.user);
  const profileData = useSelector((state: any) => state?.persist?.profileData);
  const [decryptedPhoto, setDecryptedPhoto] = useState("");
  const { data: config } = useGetConfigQuery({});
  const [uploadLoading, setUploadLoading] = useState(false);

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

  console.log(data?.data?.user_profile_review_status, "pddata");
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

  const showAlertHandler = () => {
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 2000);
  };

  // console.log(data?.data);

  return (
    <>
      {/* {!uploadLoading ? <Loader /> : <></>} */}
      {/* <TranLoader /> */}
      <div className="w-full h-screen px-5 bg-[#16131C]">
        {showAlert ? (
          <div className="fixed w-full h-screen bg-[#000000CC]  z-[3000] top-0 left-0">
            <div className="w-full z-[1300] absolute top-[80vh] flex justify-center">
              <div className="text-[14px] bg-[#191721] px-2 py-1 rounded-lg  flex items-center gap-2 text-center">
                <img src={logo} className="w-5" alt="" />
                <span>您已经填写过邀请码</span>
              </div>
            </div>
            {/* 1 */}
          </div>
        ) : (
          ""
        )}
        {showAvatar ? (
          <Avatars
            setShowAvatar={setShowAvatar}
            avatarId={avatarId}
            setAvatarId={setAvatarId}
            srcImg={srcImg}
            setSrcImg={setSrcImg}
            refetch={refetch}
          />
        ) : (
          <></>
        )}
        <div className="flex justify-between items-center py-5">
          <Link to={paths.profile}>
            {/* <FaAngleLeft size={22} /> */}
            <img src={backButton} alt="" />
          </Link>
          <p className="text-[16px] mr-5">资料</p>
          <div></div>
        </div>
        <ProfilePhotoUpload
          imgurl={decryptedPhoto}
          srcImg={srcImg}
          setShowAvatar={setShowAvatar}
          reviewStatus={data?.data?.user_profile_review_status}
          refetchHandler={refetchHandler}
          exist={data?.data?.user_profile_exist}
          refetch={refetch}
          imageLimit={config?.data?.profile_image_limit}
        />
        {/* <ImageUpload imgurl={decryptedPhoto} /> */}

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
          <EditGender gender={data?.data?.gender} />
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
          <EditReferral
            referral_code={data?.data?.referral_by}
            showAlertHandler={showAlertHandler}
            refetchHandler={refetchHandler}
          />
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
