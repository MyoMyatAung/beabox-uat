import ImageWithPlaceholder from "@/page/explore/comp/imgPlaceHolder";
import { paths } from "@/routes/paths";
import { setDetails } from "@/store/slices/exploreSlice";
import AsyncDecryptedImage from "@/utils/asyncDecryptedImage";
import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { FaEarthAmericas } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../../page/search/search.css";
import { Heart } from "lucide-react";
const decryptImage = (arrayBuffer: any, key = 0x12, decryptSize = 4096) => {
  const data = new Uint8Array(arrayBuffer);
  const maxSize = Math.min(decryptSize, data.length);
  for (let i = 0; i < maxSize; i++) {
    data[i] ^= key;
  }
  // Decode the entire data as text.
  return new TextDecoder().decode(data);
};
const VideoCard2 = ({ videoData }: any) => {
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

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}k`;
    }
    return num;
  };

  const calculateHeight = (width: number, height: number) => {
    if (width > height) {
      return 112; // Portrait
    }
    if (width < height) {
      return 240; // Landscape
    }
    return 200;
  };

  console.log(videoData, "videoData");

  return (
    <div className="chinese_photo h-[320px] max-w-full relative pt-[20px]">
      <div className=" relative flex justify-center items-center bg-[#010101] rounded-t-[4px] overflow-hidden  h-[240px]">
        <ImageWithPlaceholder
          src={videoData?.preview_image}
          alt={videoData.title || "Video"}
          width={"100%"}
          height={calculateHeight(
            videoData?.files[0]?.width,
            videoData?.files[0]?.height
          )}
          className=" object-contain h-full w-full rounded-none"
        />
        {/* <div className="absolute card_style_2 bottom-0 flex justify-between items-center h-[50px] px-3 w-full">
          <div className="flex items-center gap-1">
            <Heart />
            <span className="text-[14px]">{videoData?.like_count}</span>
          </div>
          <FaEarthAmericas size={10} />
        </div> */}
      </div>
      {/* line-clamp-2 */}
      <h1 className="search_text font-cnFont line-clamp-2 text-left text-[14px] font-[400] px-[6px] pt-[6px]">
        {videoData.title.length > 50
          ? `${videoData.title.slice(0, 50)}...`
          : videoData.title}
      </h1>
      <div className="px-[6px] flex justify-between items-center w-full my-2">
        <div className="flex items-center gap-1">
          <ImageWithPlaceholder
            src={videoData?.user?.avatar}
            alt={videoData?.user?.avatar || "Video"}
            width={"20px"}
            height={"20px"}
            className=" object-cover h-full w-full rounded-full"
          />
          <p className="text-[12px] text-[#BBBBBB]">{videoData?.user?.name}</p>
        </div>
        <div className="flex items-center gap-1">
          <Heart size={11} />
          <p className="text-[12px] text-[#BBBBBB]">{videoData?.like_count}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard2;
