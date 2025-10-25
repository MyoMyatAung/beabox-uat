import { cn } from "@/lib/utils";
import { paths } from "@/routes/paths";
import { FaCrown } from "react-icons/fa6";
import { Link } from "react-router-dom";
import AvatarImage from "../avatar/avatar-image";
import ImageWithPlaceholder from "@/page/explore/comp/imgPlaceHolder";
import ImageWithPlaceholder1 from "@/page/explore/comp/ImgPlaceHolder1";

function TopRankCardVideo({ data, rank, onVideoClick }: { data: any; rank: any; onVideoClick?: (videoId: string) => void }) {
  const handleClick = () => {
    if (onVideoClick && data?.post_id) {
      onVideoClick(data.post_id);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center z-50 rounded-[8px] relative w-[110px] h-[160px] overflow-hidden cursor-pointer",
        {
          rank1: rank == 1,
          rank2: rank == 2,
          rank3: rank == 3,
        }
      )}
      onClick={handleClick}
    >
      <ImageWithPlaceholder1
        src={data?.preview_image}
        width={""}
        height={""}
        alt={data?.title || "Video"}
        className={`w-full relative object-cover`}
      />
      <div className="bg-gradient-to-b from-[#00000000] to-[#000000]/80 absolute top-0 left-0 w-full h-full rounded-[8px]"></div>
      <FaCrown
        className={`absolute top-2 left-2 size-8 ${
          (rank == 1 && "text-[#F7E29B]") ||
          (rank == 2 && "text-[#D7D7D8]") ||
          (rank == 3 && "text-[#FF9C7B] ")
        }`}
      />
      <p
        className={cn("font-semibold text-xs absolute top-5 left-5", {
          "text-[#594400]": rank === 1,
          "text-[#444444]": rank === 2,
          "text-[#8E2300]": rank === 3,
        })}
      >
        {rank}
      </p>

      <div className="z-10 absolute left-2 bottom-2">
        <Link to={paths.getUserProfileId(data?.id)}>
          <div className="flex flex-col">
            <div className="flex items-center gap-x-1">
              <AvatarImage
                src={data?.user?.avatar}
                width={""}
                height={""}
                className="w-5 h-5 rounded-full bg-red-500"
                alt=""
              />
              <p className="text-xs font-medium">{data?.user?.name}</p>
            </div>
            <p className="text-xs">{data?.like_count} likes</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default TopRankCardVideo;
