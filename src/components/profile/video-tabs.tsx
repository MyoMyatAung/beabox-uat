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

const VideoTabs = ({ login, showHeader, headerRef }: any) => {
  const user = useSelector((state: any) => state.persist.user);

  const { data: mydata, isLoading: myloading } = useGetPostsQuery({
    id: user?.id,
  });
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
        <LikedVideos />
      </TabsContent>
      <TabsContent value="history">
        <HistoryVideos />
      </TabsContent>
      <TabsContent value="upload">
        <div className="py-5">
          {myloading ? (
            <div className=" flex justify-center w-full py-[200px]">
              <div className="">
                <img src={Loader} className="w-[70px] h-[70px]" alt="Loading" />
              </div>
            </div>
          ) : (
            <></>
          )}
          {!login || mydata?.data?.length <= 0 ? (
            <div>
              <div className="flex flex-col justify-center items-center w-full mt-[150px]">
                <NoVideo />
                <p className="text-[12px] text-[#888]">这里空空如也～</p>
              </div>
            </div>
          ) : (
            <div>
              <VideoGrid
                showHeader={showHeader}
                data={mydata?.data}
                fetchMoreData={() => {}}
              />
              <div className="py-[38px]"></div>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default VideoTabs;
