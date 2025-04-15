import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/create-center/drawer";
import Divider from "./divider";
import { useState } from "react";
import AsyncDecryptedImage from "@/utils/asyncDecryptedImage";
import { Camera } from "lucide-react";
import { useRemoveAvatarMutation } from "@/store/api/profileApi";
import TranLoader from "../shared/tran-loader";

const ProfilePhotoUpload = ({
  imgurl,
  srcImg,
  setShowAvatar,
  reviewStatus,
  refetchHandler,
}: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [removeAvatar, { isLoading, data }] = useRemoveAvatarMutation();
  console.log(data);

  const removeHandler = async () => {
    await removeAvatar("");
    setIsOpen(false);
    refetchHandler();
  };

  return (
    <>
      {isLoading ? <TranLoader /> : <></>}
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <div>
            {imgurl ? (
              <div className="flex justify-center items-center relative">
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
              <div className="flex justify-center items-center relative">
                <div className="w-[80px] h-[80px] rounded-full bg-[#FFFFFF12] flex justify-center items-center object-cover object-center filter saturate-50 brightness-75"></div>
                <div className="absolute">
                  <Camera />
                </div>
              </div>
            )}
          </div>
        </DrawerTrigger>
        <DrawerContent className="border-0">
          <div className="p-5">
            <h1 className="text-[16px] text-white text-center">头像</h1>
            <div className="space-y-5 mt-5">
              <div className="flex justify-between items-center">
                <div className="">
                  <h1
                    className={`text-[16px] ${
                      reviewStatus === "pending" ? "text-[#888]" : "text-white"
                    } `}
                  >
                    上传图片
                  </h1>
                  <p className="text-[12px] text-[#888888]">
                    上传 PNG/JPG，限1MB
                  </p>
                </div>
                {reviewStatus === "pending" ? (
                  <button className="text-[#E79AFE] bg-[#E79AFE14] text-[14px] px-2 py-1 rounded-[4px]">
                    正在审核中...
                  </button>
                ) : (
                  <></>
                )}
              </div>
              <Divider show={true} />
              <div
                className=""
                onClick={() => {
                  setIsOpen(false);
                  setShowAvatar(true);
                }}
              >
                <h1 className="text-[16px] text-white">获取头像</h1>
                <p className="text-[12px] text-[#888888]">
                  升级即可解锁专属头像！
                </p>
              </div>
              <Divider show={true} />
              <div onClick={removeHandler}>
                <h1 className="text-[16px] text-[#F54C4F]">移除头像</h1>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ProfilePhotoUpload;
