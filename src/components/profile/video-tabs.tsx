import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, NoVideo } from "@/assets/profile";
import VideoGrid from "./video-grid";
import { FaHeart } from "react-icons/fa";
import { MdWatchLater } from "react-icons/md";
import { useSelector } from "react-redux";
import { useGetLikedPostQuery } from "@/store/api/profileApi";

const VideoTabs = ({ login }: any) => {
  const user = useSelector((state: any) => state.persist.user);
  const { data } = useGetLikedPostQuery(user?.id);
  console.log(data?.data, "liked videos");

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
        <TabsTrigger
          className="text-[#888888] data-[state=active]:text-white data-[state=active]:bg-[#FFFFFF0A] rounded-full text-[12px] py-2 flex items-center gap-2"
          value="history"
        >
          <span className="flex items-center gap-1">
            <MdWatchLater /> 观看历史
          </span>
        </TabsTrigger>
      </TabsList>
      {/* <TabsContent value="videos">
        {login ? (
          <VideoGrid isUpload={true} />
        ) : (
          <div className="flex flex-col justify-center items-center w-full mt-[150px]">
            <NoVideo />
            <p className="text-[12px] text-[#888]"> 这里空空如也～</p>
          </div>
        )}
      </TabsContent> */}
      <TabsContent value="liked">
        {!login || data?.data?.length <= 0 ? (
          <div className="flex flex-col justify-center items-center w-full mt-[150px]">
            <NoVideo />
            <p className="text-[12px] text-[#888]">这里空空如也～</p>
          </div>
        ) : (
          <VideoGrid data={data?.data} />
        )}
      </TabsContent>
      <TabsContent value="history">
        {!login || data?.data?.length <= 0 ? (
          <div className="flex flex-col justify-center items-center w-full mt-[150px]">
            <NoVideo />
            <p className="text-[12px] text-[#888]">这里空空如也～</p>
          </div>
        ) : (
          <VideoGrid data={data?.data} />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default VideoTabs;
