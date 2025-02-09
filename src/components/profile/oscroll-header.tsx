import { EllipsisVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SettingBtn2 from "./setting-btn2";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaHeart } from "react-icons/fa";
import { MdWatchLater } from "react-icons/md";
import Loader from "@/page/home/vod_loader.gif";
import { NoVideo } from "@/assets/profile";
import { BsPersonLock } from "react-icons/bs";
import { useEffect, useState } from "react";
import { useGetLikedPostQuery } from "@/store/api/profileApi";
import VideoGrid from "./video-grid";
import defaultCover from "@/assets/cover.jpg";

const OscrollHeader = ({ photo, name, id, visibility, dphoto }: any) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [waterfall, setWaterFall] = useState<any[]>([]);
  const { data, isLoading } = useGetLikedPostQuery({ user_id: id, page });

  console.log(data, "data for os");

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
  return (
    <div className="h-screen">
      <div className="gradient-overlay2"></div>
      <img
        src={dphoto ? dphoto : defaultCover}
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
              <SettingBtn2 id={id} />
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
          </TabsList>
        </div>
        <div className="relative px-5">
          <TabsContent value="liked">
            {isLoading ? (
              <div className=" flex justify-center w-full py-[200px]">
                <div className="">
                  <img
                    src={Loader}
                    className="w-[70px] h-[70px]"
                    alt="Loading"
                  />
                </div>
              </div>
            ) : (
              <></>
            )}
            {data?.data?.length > 0 && visibility == "public" ? (
              <div className="w-full relative">
                <VideoGrid
                  showHeader={false}
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
        </div>
        <div className="py-[38px] w-full"></div>
      </Tabs>
    </div>
  );
};

export default OscrollHeader;
