import ImageWithPlaceholder from "@/page/explore/comp/imgPlaceHolder";
import { paths } from "@/routes/paths";
import { setDetails } from "@/store/slices/exploreSlice";
import AsyncDecryptedImage from "@/utils/asyncDecryptedImage";
import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { FaEarthAmericas } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
const decryptImage = (arrayBuffer: any, key = 0x12, decryptSize = 4096) => {
  const data = new Uint8Array(arrayBuffer);
  const maxSize = Math.min(decryptSize, data.length);
  for (let i = 0; i < maxSize; i++) {
    data[i] ^= key;
  }
  // Decode the entire data as text.
  return new TextDecoder().decode(data);
};
const VideoCard = ({ videoData }: any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoad, setIsLoad] = useState(false);
  const [decryptedPhoto, setDecryptedPhoto] = useState("");

  const showDetailsVod = (file: any) => {
    dispatch(setDetails(file));
    navigate(paths.vod_details);
  };

  const loadHandler = () => {
    setIsLoad(true);
    setTimeout(() => setIsLoad(false), 1000);
  };

  useEffect(() => {
    loadHandler();
  }, []);
  // console.log(videoData);

  useEffect(() => {
    const loadAndDecryptPhoto = async () => {
      if (!videoData?.preview_image) {
        setDecryptedPhoto("");
        return;
      }

      try {
        const photoUrl = videoData?.preview_image;

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
  }, [videoData?.preview_image]);

  return (
    <div
      className="bg-gradient-to-r h-[170px] relative"
      // onClick={() => showDetailsVod(videoData)}
    >
      <div className="">
        {!decryptedPhoto ? (
          <div className="h-[170px] animate-pulse object-cover w-full object-center bg-[#FFFFFF1F]"></div>
        ) : (
          <ImageWithPlaceholder
            needGradient={true}
            className="h-[170px]  w-full  object-contain"
            width={""}
            height={""}
            alt="preview"
            src={videoData?.preview_image}
          />
        )}
      </div>
      <div className="absolute bottom-0 flex justify-between items-center px-2 w-full">
        <div className="flex items-center gap-1">
          <FaHeart size={10} />
          <span className="text-[12px]">{videoData?.like_count}</span>
        </div>
        <FaEarthAmericas size={10} />
      </div>
    </div>
  );
};

export default VideoCard;
