import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Heart, Watch, NoVideo } from "@/assets/profile";
import VideoGrid from "./video-grid";
const VideoTabs = ({ login }: any) => {
  return (
    <Tabs defaultValue="videos" className="my-5">
      <TabsList className="grid w-full grid-cols-3 bg-transparent">
        <TabsTrigger
          className="text-[#888888] data-[state=active]:text-white data-[state=active]:bg-[#FFFFFF0A] rounded-full text-[12px] py-2 flex items-center gap-2"
          value="videos"
        >
          <Play /> <span>Your Videos</span>
        </TabsTrigger>
        <TabsTrigger
          className="text-[#888888] data-[state=active]:text-white data-[state=active]:bg-[#FFFFFF0A] rounded-full text-[12px] py-2 flex items-center gap-2"
          value="liked"
        >
          <Heart /> <span>Liked Videos</span>
        </TabsTrigger>
        <TabsTrigger
          className="text-[#888888] data-[state=active]:text-white data-[state=active]:bg-[#FFFFFF0A] rounded-full text-[12px] py-2 flex items-center gap-2"
          value="history"
        >
          <Watch /> <span>Watch History</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="videos">
        {login ? (
          <VideoGrid isUpload={true} />
        ) : (
          <div className="flex flex-col justify-center items-center w-full mt-[150px]">
            <NoVideo />
            <p className="text-[12px] text-[#888]">Oops! No videos here</p>
          </div>
        )}
      </TabsContent>
      <TabsContent value="liked">
        {login ? (
          <VideoGrid />
        ) : (
          <div className="flex flex-col justify-center items-center w-full mt-[150px]">
            <NoVideo />
            <p className="text-[12px] text-[#888]">Oops! No videos here</p>
          </div>
        )}
      </TabsContent>
      <TabsContent value="history">
        {login ? (
          <VideoGrid />
        ) : (
          <div className="flex flex-col justify-center items-center w-full mt-[150px]">
            <NoVideo />
            <p className="text-[12px] text-[#888]">Oops! No videos here</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default VideoTabs;
