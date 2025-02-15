import ImageWithPlaceholder from "@/page/explore/comp/imgPlaceHolder";
import { paths } from "@/routes/paths";
import { setDetails } from "@/store/slices/exploreSlice";
import AsyncDecryptedImage from "@/utils/asyncDecryptedImage";
import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { FaEarthAmericas } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const VideoCard = ({ videoData }: any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoad, setIsLoad] = useState(false);
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
  console.log(videoData);

  return (
    <div
      className="bg-gradient-to-r h-[153px] rounded relative"
      onClick={() => showDetailsVod(videoData)}
    >
      {/* <img
        src={videoData?.preview_image}
        alt=""
        className="h-full rounded w-full object-cover object-center"
      /> */}
      {/* remove if not work ;( */}
      <div className="">
        {isLoad ? (
          <div className="absolute inset-0 bg-search-img"></div>
        ) : (
          // <AsyncDecryptedImage
          //   className="h-[153px] object-cover rounded w-full object-center"
          //   // onLoad={() => setImgLoad(true)}
          //   imageUrl={videoData?.preview_image}
          //   alt=""
          // />
          <ImageWithPlaceholder
            className="h-[153px] object-cover rounded w-full object-center"
            width={""}
            height={""}
            alt="preview"
            src={videoData?.preview_image}
          />
        )}

        {/* <ImageWithPlaceholder
          src={videoData?.preview_image}
          alt={videoData.title || "Video"}
          width={""}
          height={""}
          className="h-[153px] object-cover rounded w-full object-center"
        /> */}
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
