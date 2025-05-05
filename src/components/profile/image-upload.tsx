import { showToast } from "@/page/home/services/errorSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const ImageUpload = ({
  imgurl,
  reviewStatus,
  setIsOpen,
  refetchHandler,
  settingUpload,
  settingUploadData,
  profileUpload,
  refetch,
  imageLimit,
}: any) => {
  const [image, setImage] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsOpen(false);
    setError(null); // Reset error state
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file size (2MB limit)
      if (file.size > imageLimit * 1024 * 1024) {
        // setError("文件大小超过2MB限制");
        dispatch(
          showToast({
            message: "文件大小超过2MB限制",
            type: "error",
          })
        );
        return;
      }

      handleFile(file);
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
      // setIsOpen(false);
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
        <div>
          <label htmlFor="image-upload" className="">
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
                  上传 PNG/JPG，限{imageLimit}MB
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
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
          />
        </div>
      </div>
    </>
  );
};

export default ImageUpload;
