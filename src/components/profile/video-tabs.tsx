import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play } from "@/assets/profile";
import { FaHeart } from "react-icons/fa";
import { MdWatchLater } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import LikedVideos from "./video/liked-videos";
import HistoryVideos from "./video/history-videos";
import CreatedVideo from "./video/created-video";
import { setDefaultTab } from "@/store/slices/persistSlice";
import CreatedVideo2 from "./video/create-video2";

const VideoTabs = () => {
  const user = useSelector((state: any) => state?.persist?.user);
  const defaultTab = useSelector((state: any) => state?.persist?.defaultTab);
  const dispatch = useDispatch();
  // console.log(defaultTab, "defaultab");
  return (
    <Tabs defaultValue={user?.token ? defaultTab : "liked"} className="py-5">
      <TabsList className="grid w-full grid-cols-3 z-[1600] bg-transparent sticky top-[100px] px-5">
        {user?.token ? (
          <TabsTrigger
            className="text-[#888888] data-[state=active]:text-white data-[state=active]:bg-[#FFFFFF0A] rounded-full text-[12px] py-2 flex items-center gap-2"
            onClick={() => dispatch(setDefaultTab ? defaultTab : "liked"("upload"))}
            value="upload"
          >
            <span className="flex items-center gap-1">
              <Play /> 我的作品
            </span>
          </TabsTrigger>
        ) : (
          <></>
        )}
        <TabsTrigger
          className="text-[#888888] data-[state=active]:text-white data-[state=active]:bg-[#FFFFFF0A] rounded-full text-[12px] py-2 flex items-center gap-2"
          value="liked"
          onClick={() => dispatch(setDefaultTab("liked"))}
        >
          <span className="flex items-center gap-1">
            <FaHeart /> 已点赞视频
          </span>
        </TabsTrigger>
        <TabsTrigger
          className="text-[#888888] data-[state=active]:text-white data-[state=active]:bg-[#FFFFFF0A] rounded-full text-[12px] py-2 flex items-center gap-2"
          value="history"
          onClick={() => dispatch(setDefaultTab("history"))}
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
        <CreatedVideo2 id={user?.id} />
      </TabsContent>
    </Tabs>
  );
};

export default VideoTabs;
