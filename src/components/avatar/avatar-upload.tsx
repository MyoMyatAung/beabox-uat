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
  srcImg,
  setSrcImg,
}: any) => {
  return (
    <>
      {imgurl ? (
        <div
          onClick={() => setShowAvatar(true)}
          className="flex justify-center items-center relative"
        >
          <AsyncDecryptedImage
            // imageUrl={imgurl || "/placeholder.svg"}
            imageUrl={srcImg ? srcImg : imgurl}
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
          <div className="absolute">
            <Camera />
          </div>
        </div>
      )}
    </>
  );
};

export default AvatarUpload;