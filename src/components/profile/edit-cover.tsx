import { PencilLine, Image, X } from "lucide-react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useEffect, useState } from "react";
import {
  useChangeCoverMutation,
  useRemoveCoverMutation,
  useSettingUploadMutation,
} from "@/store/api/profileApi";
import { useDispatch, useSelector } from "react-redux";
import { setCover } from "@/store/slices/persistSlice";
import Loader from "@/components/shared/loader";
import Covers from "../avatar/covers";
import pensvg from "@/assets/pensvg.svg";

interface EditCoverProps {
  coverimg?: string;
  refetch: () => void;
}

const EditCover = ({ refetch, coverimg }: EditCoverProps) => {
  const [showCovers, setShowCovers] = useState(false);
  const dispatch = useDispatch();
  const cover = useSelector((state: any) => state.persist.cover);
  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [settingUpload, { data: settingUploadData, isLoading: load1 }] =
    useSettingUploadMutation();
  const [changeCover, { data: changeCoverData, isLoading: load2 }] =
    useChangeCoverMutation();
  const [removeCover] = useRemoveCoverMutation();
  const removeHandler = async () => {
    await removeCover(cover);
    dispatch(setCover(null));
    setIsOpen(false);
  };

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

      await settingUpload({
        filedata: base64,
        filePath: "cover_photo",
      });
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
    if (settingUploadData?.status) {
      changeCover({ file_url: settingUploadData?.data?.url });
      refetch();
      dispatch(setCover(settingUploadData?.data?.url));
    }
    setIsOpen(false);
    // console.log(settingUploadData?.data?.url, "storage uploaded");
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
      {showCovers ? <Covers setShowCovers={setShowCovers} /> : <></>}
      {load1 || load2 ? (
        <div className="fixed left-0 right-0 top-[100px] flex justify-center items-center h-screen text-red-500 z-[9000]">
          <Loader />
        </div>
      ) : (
        <></>
      )}
      <div
        onClick={() => setShowCovers(true)}
        className="flex gap-2 z-[1900] bg-[#FFFFFF14]  justify-center min-w-[55px] px-3 h-[34px] rounded-[12px] items-center"
      >
        {/* <PencilLine size={14} /> */}
        <img src={pensvg} className="w-[14px] h-auto" alt="" />
        <p className="text-[12px]">设置封面</p>
      </div>
      {/* <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <div className="flex gap-2 z-[1900] bg-[#FFFFFF14] px-4 justify-center py-1 rounded-lg items-center">
            <PencilLine size={14} />
            <p className="text-[12px]">设置封面</p>
          </div>
        </DrawerTrigger>
        <DrawerContent className="border-0 bg-[#121012] z-[1800]">
          <div className="w-full px-5 py-7">
            <div className="space-y-6">
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex items-center gap-3"
                >
                  <div className="bg-[#FFFFFF1F] p-2 rounded-full">
                    <Image size={16} />
                  </div>
                  <p className="text-[14px]">上传封面</p>
                </label>
              </div>
              {coverimg ? (
                <div className="w-full h-[1px] bg-[#FFFFFF0A]"></div>
              ) : (
                <></>
              )}
              {coverimg ? (
                <div
                  className="flex items-center gap-3"
                  onClick={removeHandler}
                >
                  <div className="bg-[#FFFFFF1F] p-2 rounded-full">
                    <X size={16} />
                  </div>
                  <p className="text-[14px]">移除封面</p>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer> */}
    </>
  );
};

export default EditCover;
