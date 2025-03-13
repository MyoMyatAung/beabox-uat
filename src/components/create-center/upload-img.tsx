import { decryptImage } from "@/utils/image-decrypt";
import React, { useEffect, useState } from "react";

const UploadImg = ({ imgsrc }: any) => {
  const [decryptImg, setDecryptImg] = useState("");

  useEffect(() => {
    const convertImg = async () => {
      if (imgsrc?.endsWith(".txt")) {
        try {
          const convertedImg = await decryptImage(imgsrc);
          //   console.log(convertedImg, "convertedImg");
          setDecryptImg(convertedImg);
        } catch (error) {
          console.error("Error decrypting preview image:", error);
          setDecryptImg(imgsrc); // Fallback to original URL
        }
      }
    };
    convertImg();
  }, [imgsrc]);
  return (
    <img
      src={`${decryptImg}`}
      className="w-[128px] border border-gray-800 h-[80px] object-cover object-center rounded-[8px]"
      alt=""
    />
  );
};

export default UploadImg;
