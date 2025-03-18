import {
  useProfileUploadMutation,
  useSettingUploadMutation,
} from "@/store/api/profileApi";
import { Camera } from "lucide-react";

import { useEffect, useState } from "react";
import Loader from "../shared/loader";
import TranLoader from "../shared/tran-loader";
import AsyncDecryptedImage from "@/utils/asyncDecryptedImage";

const ImageUpload = ({ imgurl }: any) => {
  const [image, setImage] = useState<string | null>(null);
  const [settingUpload, { data: settingUploadData, isLoading: loading1 }] =
    useSettingUploadMutation();

  const [profileUpload, { data: profileUploadData, isLoading: loading2 }] =
    useProfileUploadMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      if (e.target && typeof e.target.result === "string") {
        setImage(e.target.result);
        await settingUpload({ filedata: e.target.result, filePath: "profile" });
      }
    };
    reader.readAsDataURL(file);
    // console.log(reader.readAsDataURL(file), "reader.readAsDataURL(file)");
  };

  useEffect(() => {
    if (settingUploadData?.status)
      profileUpload({ file_url: settingUploadData?.data?.url });
  }, [settingUploadData]);

  return (
    <>
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
    </>
  );
};

export default ImageUpload;
