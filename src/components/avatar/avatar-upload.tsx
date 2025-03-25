import {
  useAvatarUploadMutation,
  useProfileUploadMutation,
  useSettingUploadMutation,
} from "@/store/api/profileApi";
import { Camera } from "lucide-react";

import { useEffect, useState } from "react";
import Loader from "../shared/loader";
import TranLoader from "../shared/tran-loader";
import AsyncDecryptedImage from "@/utils/asyncDecryptedImage";

const AvatarUpload = ({
  imgurl,
  setShowAvatar,
  avatarId,
  setAvatarId,
}: any) => {
  const [image, setImage] = useState<string | null>(null);
  console.log(imgurl);

  return (
    <>
      {imgurl ? (
        <div
          onClick={() => setShowAvatar(true)}
          className="flex justify-center items-center relative"
        >
          <AsyncDecryptedImage
            imageUrl={imgurl || "/placeholder.svg"}
            alt="Preview"
            className="w-[80px] h-[80px] rounded-full bg-[#FFFFFF12] flex justify-center items-center object-cover object-center filter saturate-50 brightness-75"
          />
          <div className="absolute">
            <Camera />
          </div>
        </div>
      ) : (
        <div
          onClick={() => setShowAvatar(true)}
          className="flex justify-center items-center relative"
        >
          <div className="w-[80px] h-[80px] rounded-full bg-[#FFFFFF12] flex justify-center items-center object-cover object-center filter saturate-50 brightness-75"></div>
          {/* <AsyncDecryptedImage
            imageUrl={imgurl || "/placeholder.svg"}
            alt="Preview"
            className="w-[80px] h-[80px] rounded-full bg-[#FFFFFF12] flex justify-center items-center object-cover object-center filter saturate-50 brightness-75"
          /> */}
          <div className="absolute">
            <Camera />
          </div>
        </div>
      )}
      {/* <label htmlFor="image-upload" className="">
        <div
          className="flex justify-center items-center relative"
          onClick={() => setShowAvatar(true)}
        >
          <AsyncDecryptedImage
            imageUrl={image || "/placeholder.svg"}
            alt="Preview"
            className="w-[80px] h-[80px] rounded-full bg-[#FFFFFF12] flex justify-center items-center object-cover object-center filter saturate-50 brightness-75"
          />
          <div className="absolute">
            <Camera />
          </div>
        </div>
      </label> */}
    </>
  );
};

export default AvatarUpload;

{
  /* <>
  <div className="relative">
    {loading1 || loading2 ? <TranLoader /> : <></>}
    <div>
      {image ? (
        <label htmlFor="image-upload" className="">
          <div className="flex justify-center items-center relative">
            <AsyncDecryptedImage
              imageUrl={image || "/placeholder.svg"}
              alt="Preview"
              className="w-[80px] h-[80px] rounded-full bg-[#FFFFFF12] flex justify-center items-center object-cover object-center filter saturate-50 brightness-75"
            />
            <div className="absolute">
              <Camera />
            </div>
          </div>
        </label>
      ) : (
        <></>
      )}
      <div onClick={() => setShowAvatar(true)}></div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="image-upload"
      />
      {!image && !imgurl?.length ? (
        <label htmlFor="image-upload" className="">
          <div className="w-[80px] h-[80px] rounded-full bg-[#FFFFFF12] flex justify-center items-center mx-auto">
            <Camera />
          </div>
        </label>
      ) : (
        <></>
      )}
      {!image && imgurl?.length ? (
        <label htmlFor="image-upload" className="">
          <div className="flex justify-center items-center relative">
            <img
              src={imgurl}
              alt="Preview"
              className="w-[80px] h-[80px] rounded-full bg-[#FFFFFF12] flex justify-center items-center object-cover object-center filter saturate-50 brightness-75"
            />
            <div className="absolute">
              <Camera />
            </div>
          </div>
        </label>
      ) : (
        <></>
      )}
    </div>
  </div>
</>; */
}
