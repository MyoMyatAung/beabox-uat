import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, NoVideo } from "@/assets/profile";
import VideoGrid from "./video-grid";
import { FaHeart } from "react-icons/fa";
import { MdWatchLater } from "react-icons/md";
import { useSelector } from "react-redux";
import { useGetLikedPostQuery } from "@/store/api/profileApi";
import Loader from "../../page/home/vod_loader.gif";

const VideoTab2 = ({ id }: any) => {
  const { data, isLoading } = useGetLikedPostQuery(id);

  return (
    <Tabs defaultValue="liked" className="my-5">
      <TabsList className="grid w-full grid-cols-3 bg-transparent">
        {/* <TabsTrigger
      className="text-[#888888] data-[state=active]:text-white data-[state=active]:bg-[#FFFFFF0A] rounded-full text-[12px] py-2 flex items-center gap-2"
      value="videos"
    >
      <Play /> <span>Your Videos</span>
    </TabsTrigger> */}
        <TabsTrigger
          className="text-[#888888] data-[state=active]:text-white data-[state=active]:bg-[#FFFFFF0A] rounded-full text-[12px] py-2 flex items-center gap-2"
          value="liked"
        >
          <span className="flex items-center gap-1">
            <FaHeart /> 已点赞视频
          </span>
        </TabsTrigger>
        {/* <TabsTrigger
          className="text-[#888888] data-[state=active]:text-white data-[state=active]:bg-[#FFFFFF0A] rounded-full text-[12px] py-2 flex items-center gap-2"
          value="history"
        >
          <span className="flex items-center gap-1">
            <MdWatchLater /> Watch History
          </span>
        </TabsTrigger> */}
      </TabsList>
      <TabsContent value="liked">
        {isLoading ? (
          <div className=" flex justify-center w-full py-[200px]">
            <div className="">
              <img src={Loader} className="w-[70px] h-[70px]" alt="Loading" />
            </div>
          </div>
        ) : (
          <></>
        )}
        {data?.data?.length <= 0 ? (
          <div className="flex flex-col justify-center items-center w-full mt-[150px]">
            <NoVideo />
            <p className="text-[12px] text-[#888]">Oops! No videos here</p>
          </div>
        ) : (
          <div className="w-full relative  z-[1200]">
            <VideoGrid data={data?.data} />
          </div>
        )}
      </TabsContent>
      {/* <TabsContent value="history">
        {!login || data?.data?.length <= 0 ? (
          <div className="flex flex-col justify-center items-center w-full mt-[150px]">
            <NoVideo />
            <p className="text-[12px] text-[#888]">Oops! No videos here</p>
          </div>
        ) : (
          <VideoGrid data={data?.data} />
        )}
      </TabsContent> */}
    </Tabs>
  );
};

export default VideoTab2;
