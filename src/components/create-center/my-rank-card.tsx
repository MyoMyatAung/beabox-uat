import ImageWithPlaceholder from "@/page/explore/comp/imgPlaceHolder";
import { useGetMyOwnProfileQuery } from "@/store/api/profileApi";
import { useSelector } from "react-redux";
import AvatarImage from "../avatar/avatar-image";

const MyRankCard = ({ myrank }: any) => {
  const user = useSelector((state: any) => state?.persist?.user) || "";
  const { data, isLoading, refetch } = useGetMyOwnProfileQuery("", {
    skip: !user,
  });
  // console.log(data?.data);
  return (
    <div className="w-full h-[68px] bgbg py-3 fixed bottom-[75px] flex items-center justify-between px-5">
      <div className="w-full h-[68px] fixed bottom-[75px] left-0 overflow-hidden bgbg2"></div>
      <div className="flex gap-3 items-center">
        <p className="text-[16px] font-semibold">{myrank}</p>
        <div className="flex items-center gap-2">
          <AvatarImage
            className={`w-[40px] h-[40px]  rounded-full `}
            src={data?.data?.profile_photo}
            width={"40px"}
            height={"40px"}
            alt={""}
          />
          <div className="flex flex-col">
            <p className="text-[14px]">{data?.data?.nickname}</p>
            <p className="text-[14px] text-[#AAAAAA]">
              {data?.data?.followers_count} 粉丝
            </p>
          </div>
        </div>
      </div>
      <button className="text-[14px] text-white bg-[#FFFFFF17] px-3 py-1 rounded-[8px]">
        你的排名
      </button>
    </div>
  );
};

export default MyRankCard;
