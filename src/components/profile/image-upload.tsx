import {
  useProfileUploadMutation,
  useSettingUploadMutation,
} from "@/store/api/profileApi";
import { Camera } from "lucide-react";

import { useEffect, useState } from "react";
import Loader from "../shared/loader";
import TranLoader from "../shared/tran-loader";
import AsyncDecryptedImage from "@/utils/asyncDecryptedImage";

interface ImageUploadProps {
  imgurl: string;
}

const ImageUpload = ({ imgurl }: ImageUploadProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [settingUpload, { data: settingUploadData, isLoading: loading1 }] =
    useSettingUploadMutation();

  const [profileUpload, { data: profileUploadData, isLoading: loading2 }] =
    useProfileUploadMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    try {
      // Create a blob URL for preview
      const url = URL.createObjectURL(file);
      setBlobUrl(url);
      
      // Convert to base64 only for API submission
      const base64 = await fileToBase64(file);
      setImage(url); // Use the blob URL for display
      await settingUpload({ filedata: base64, filePath: "profile" });
    } catch (error) {
      console.error("Error handling file:", error);
    }
  };
  
  // Helper function to convert File to base64 (only for API)
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === "string") {
          resolve(e.target.result);
        } else {
          reject(new Error("Failed to convert file to base64"));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    if (settingUploadData?.status)
      profileUpload({ file_url: settingUploadData?.data?.url });
  }, [settingUploadData]);
  
  // Cleanup blob URLs when component unmounts
  useEffect(() => {
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, []);

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
