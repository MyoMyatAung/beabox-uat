import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, NoVideo } from "@/assets/profile";
import VideoGrid from "./video-grid";
import { FaHeart } from "react-icons/fa";
import { MdWatchLater } from "react-icons/md";
import { useSelector } from "react-redux";
import { useGetPostsQuery } from "@/store/api/profileApi";
import Loader from "../../page/home/vod_loader.gif";
import LikedVideos from "./video/liked-videos";
import HistoryVideos from "./video/history-videos";
import CreatedVideo from "./video/created-video";

const VideoTabs = ({ login, showHeader, headerRef }: any) => {
  const user = useSelector((state: any) => state.persist.user);

  return (
    <Tabs defaultValue="upload" className="py-5">
      <TabsList className="grid w-full grid-cols-3 z-[1600] bg-transparent sticky top-[100px]">
        <TabsTrigger
          className="text-[#888888] data-[state=active]:text-white data-[state=active]:bg-[#FFFFFF0A] rounded-full text-[12px] py-2 flex items-center gap-2"
          value="upload"
        >
          <span className="flex items-center gap-1">
            <Play /> 我的作品
          </span>
        </TabsTrigger>
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
      <TabsContent value="liked">
        <LikedVideos id={user?.id} />
      </TabsContent>
      <TabsContent value="history">
        <HistoryVideos />
      </TabsContent>
      <TabsContent value="upload">
        <CreatedVideo id={user?.id} />
      </TabsContent>
    </Tabs>
  );
};

export default VideoTabs;
