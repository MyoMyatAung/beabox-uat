import { paths } from "@/routes/paths";
import { setDetails } from "@/store/slices/exploreSlice";
import { FaHeart } from "react-icons/fa";
import { FaEarthAmericas } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const VideoCard = ({ videoData }: any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
    const showDetailsVod = (file: any) => {
      dispatch(setDetails(file));
      navigate(paths.vod_details);
    };
  return (
    <div className="bg-gradient-to-r h-[153px] rounded relative" onClick={() => showDetailsVod(videoData)}>
      <img
        src={videoData?.preview_image}
        alt=""
        className="h-full rounded w-full object-cover"
      />
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
