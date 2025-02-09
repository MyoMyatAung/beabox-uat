import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, NoVideo } from "@/assets/profile";
import VideoGrid from "./video-grid";
import { FaHeart } from "react-icons/fa";
import { MdWatchLater } from "react-icons/md";
import { useSelector } from "react-redux";
import {
  useGetLikedPostQuery,
  useGetWatchHistoryQuery,
} from "@/store/api/profileApi";
import { useEffect, useState } from "react";
import Loader from "../../page/home/vod_loader.gif";

const VideoTabs = ({ login, showHeader, headerRef }: any) => {
  const user = useSelector((state: any) => state.persist.user);
  const [page, setPage] = useState(1);
  const [Hispage, setHisPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [waterfall, setWaterFall] = useState<any[]>([]);
  const [HistoryList, setHistoryList] = useState<any[]>([]);
  const { data, isLoading } = useGetLikedPostQuery(
    { user_id: user?.id, page },
    { skip: !user }
  );
  const { data: history, isLoading: historyLoading } = useGetWatchHistoryQuery(
    {
      page: Hispage,
    },
    { skip: !user }
  );
  // console.log(HistoryList);

  useEffect(() => {
    if (data?.data) {
      setWaterFall((prev) => [...prev, ...data.data]);

      const loadedItems =
        data.pagination.current_page * data.pagination.per_page;
      setHasMore(loadedItems < data.pagination.total);
    } else {
      setHasMore(false);
    }

    if (history?.data) {
      setHistoryList(history.data);
    }
  }, [data, history]);
  const fetchMoreData = () => {
    setPage((prevPage) => prevPage + 1);
  };
  return (
    <Tabs defaultValue="liked" className="my-5">
      <div ref={headerRef} className="sticky z-[1300] top-0 w-full"></div>

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
      {isLoading || historyLoading ? (
        <div className=" flex justify-center w-full py-[200px]">
          <div className="">
            <img src={Loader} className="w-[70px] h-[70px]" alt="Loading" />
          </div>
        </div>
      ) : (
        <>
          <TabsContent value="liked">
            {!login || data?.data?.length <= 0 ? (
              <div className="flex flex-col justify-center items-center w-full mt-[150px]">
                <NoVideo />
                <p className="text-[12px] text-[#888]">这里空空如也～</p>
              </div>
            ) : (
              <div className="w-full relative z-[1200]">
                <VideoGrid
                  showHeader={showHeader}
                  hasMore={hasMore}
                  fetchMoreData={fetchMoreData}
                  data={waterfall}
                />
              </div>
            )}
          </TabsContent>
          <TabsContent value="history">
            {!login || history?.data?.length <= 0 ? (
              <div className="flex flex-col justify-center items-center w-full mt-[150px]">
                <NoVideo />
                <p className="text-[12px] text-[#888]">这里空空如也～</p>
              </div>
            ) : (
              <div className="w-full relative  z-[1200]">
                <VideoGrid
                  showHeader={showHeader}
                  hasMore={hasMore}
                  fetchMoreData={fetchMoreData}
                  data={HistoryList}
                />
              </div>
            )}
          </TabsContent>
        </>
      )}
    </Tabs>
  );
};

export default VideoTabs;
