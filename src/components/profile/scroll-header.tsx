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
import { NoVideo, Person } from "@/assets/profile";
import VideoGrid from "./video-grid";
import defaultCover from "@/assets/cover.jpg";
import Loader from "@/page/home/vod_loader.gif";

const ScrollHeader = ({
  photo,
  name,
  login,
  dphoto,
  setShow,
}: any) => {
  const user = useSelector((state: any) => state?.persist?.user);
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
    <div className="flex justify-between items-center w-full z-[1800] relative">
      <div className="flex items-center gap-3">
        {photo ? (
          <img
            className="w-[48px] z-[1500] h-[48px] rounded-full object-cover object-center"
            src={photo}
            alt=""
          />
        ) : (
          <div className="w-[48px] h-[48px] rounded-full bg-[#FFFFFF12] flex justify-center items-center p-2">
            <Person />
          </div>
        )}

        <p className="z-[1500]">{name}</p>
      </div>
      <div className="flex gap-3 z-[1500] items-center">
        <Link
          to={paths.noti}
          className="z-[1200] bg-[#FFFFFF12] w-10 h-10 rounded-full flex items-center justify-center"
        >
          <Bell />
        </Link>
        <SettingBtn setShow={setShow} />
      </div>
    </div>
  );
};

export default ScrollHeader;
