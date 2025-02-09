import { paths } from "@/routes/paths";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import SettingBtn from "./setting-btn";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaHeart } from "react-icons/fa";
import { MdWatchLater } from "react-icons/md";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  useGetLikedPostQuery,
  useGetWatchHistoryQuery,
} from "@/store/api/profileApi";
import { NoVideo } from "@/assets/profile";
import VideoGrid from "./video-grid";
import defaultCover from "@/assets/cover.jpg";
import Loader from "@/page/home/vod_loader.gif";

const ScrollHeader = ({ photo, name, setShow, login, dphoto }: any) => {
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
    <div className="h-screen">
      <div className="gradient-overlay2"></div>
      <img
        src={user?.token ? (dphoto ? dphoto : defaultCover) : defaultCover}
        alt=""
        className={`fixed top-0 z-[1000] left-0 w-full h-[155px] object-cover object-center`}
      />
      <Tabs defaultValue="liked">
        <div className="z-[1500] fixed top-0 px-5  w-full pt-5 pb-10">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-3">
              <img
                className="w-[58px] z-[1500] h-[58px] rounded-full object-cover object-center"
                src={photo}
                alt=""
              />
              <p className="z-[1500]">{name}</p>
            </div>
            <div className="flex gap-3 z-[1500] items-center">
              <Link
                to={paths.noti}
                className="z-[1500] bg-[#FFFFFF12] w-10 h-10 rounded-full flex items-center justify-center"
              >
                <Bell />
              </Link>
              <SettingBtn setShow={setShow} />
            </div>
          </div>
          <TabsList className="grid w-full grid-cols-3 bg-transparent py-5">
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
        </div>
        <div className="relative  pt-[150px] px-5">
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
                  <div className="w-full relative">
                    <VideoGrid
                      showHeader={false}
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
                      showHeader={false}
                      hasMore={hasMore}
                      fetchMoreData={fetchMoreData}
                      data={HistoryList}
                    />
                  </div>
                )}
              </TabsContent>
            </>
          )}
        </div>
        <div className="py-[38px] w-full"></div>
      </Tabs>
    </div>
  );
};

export default ScrollHeader;
