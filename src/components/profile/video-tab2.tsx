import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NoVideo } from "@/assets/profile";
import VideoGrid from "./video-grid";
import { FaHeart } from "react-icons/fa";
import { useGetLikedPostQuery } from "@/store/api/profileApi";
import Loader from "../../page/home/vod_loader.gif";
import { useEffect, useState } from "react";
import { BsPersonLock } from "react-icons/bs";

const VideoTab2 = ({ id, visibility, showHeader }: any) => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [waterfall, setWaterFall] = useState<any[]>([]);
  const { data, isLoading } = useGetLikedPostQuery({ user_id: id, page });

  useEffect(() => {
    if (data?.data) {
      setWaterFall((prev) => [...prev, ...data.data]);

      const loadedItems =
        data.pagination.current_page * data.pagination.per_page;
      setHasMore(loadedItems < data.pagination.total);
    } else {
      setHasMore(false);
    }
  }, [data]);

  const fetchMoreData = () => {
    setPage((prevPage) => prevPage + 1);
  };
  console.log(data);

  return (
    <Tabs defaultValue="liked" className="my-5">
      <TabsList className="grid w-full grid-cols-3 bg-transparent">
        <TabsTrigger
          className="text-[#888888] data-[state=active]:text-white data-[state=active]:bg-[#FFFFFF0A] rounded-full text-[12px] py-2 flex items-center gap-2"
          value="liked"
        >
          <span className="flex items-center gap-1">
            <FaHeart /> 已点赞视频
          </span>
        </TabsTrigger>
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
        {data?.data?.length > 0 && visibility == "public" ? (
          <div className="w-full relative  z-[1200]">
            <VideoGrid
              showHeader={showHeader}
              data={waterfall}
              fetchMoreData={fetchMoreData}
            />
          </div>
        ) : visibility == "public" ? (
          <div className="flex flex-col justify-center items-center w-full mt-[150px]">
            <NoVideo />
            <p className="text-[12px] text-[#888]">这里空空如也～</p>
          </div>
        ) : (
          <div className="flex gap-2 flex-col justify-center items-center w-full mt-[150px]">
            <BsPersonLock size={32} />
            <p className="text-[12px] text-[#888]">私密账号</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default VideoTab2;
