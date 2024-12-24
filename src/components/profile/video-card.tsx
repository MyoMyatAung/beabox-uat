import { FaHeart } from "react-icons/fa";
import { FaEarthAmericas } from "react-icons/fa6";

const VideoCard = () => {
  return (
    <div className="bg-gradient-to-r h-[153px] rounded relative">
      <img
        src="https://i.pinimg.com/236x/38/35/e9/3835e962570b7ce17cad39aed79f3957.jpg"
        alt=""
        className="h-full rounded w-full object-cover"
      />
      <div className="absolute bottom-0 flex justify-between items-center px-2 w-full">
        <div className="flex items-center gap-1">
          <FaHeart size={10} />
          <span className="text-[12px]">12</span>
        </div>
        <FaEarthAmericas size={10} />
      </div>
    </div>
  );
};

export default VideoCard;
