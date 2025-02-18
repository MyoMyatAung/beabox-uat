import { useEffect, useState, useRef, useCallback } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { usePostsSearchMutation } from "@/store/api/profileApi";
import { ChevronLeft, Search } from "lucide-react";
import { FaSearch } from "react-icons/fa";
import VideoCard from "../video-card";
import loader from "@/page/home/vod_loader.gif";

const SearchVideo = ({ id }: { id: string }) => {
  const [postsSearch] = usePostsSearchMutation();
  const [search, setSearch] = useState("");
  const [videos, setVideos] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastVideoElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  const searchHandler = async () => {
    setIsLoading(true);
    setPage(1);
    const { data } = await postsSearch({ page: 1, search });
    if (data?.data?.list?.length) {
      setVideos(data.data.list);
      setHasMore(data.pagination.total > data.data.list.length);
    } else {
      setVideos([]);
      setHasMore(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchMoreData = async () => {
      if (isLoading || !hasMore) return;
      setIsLoading(true);
      const { data } = await postsSearch({ page, search });
      if (data?.data?.list?.length) {
        setVideos((prevVideos) => [...prevVideos, ...data.data.list]);
        setHasMore(
          data.pagination.total > videos.length + data.data.list.length
        );
      } else {
        setHasMore(false);
      }
      setIsLoading(false);
    };

    if (page > 1) {
      fetchMoreData();
    }
  }, [page, search, isLoading, hasMore, postsSearch, videos.length]); // Added missing dependencies

  return (
    <Drawer>
      <DrawerTrigger>
        <div className="bg-[#f3e7e71f] w-10 h-10 flex justify-center items-center p-2 rounded-full">
          <Search size={18} />
        </div>
      </DrawerTrigger>
      <DrawerContent className="z-[9900] gradient-bg border-0">
        <div className="c-height w-full gradient-bg overflow-y-auto hide-sb">
          <div className="px-5 z-[9000] gradient-bg sticky top-0 py-5 flex items-center gap-3">
            <DrawerClose>
              <ChevronLeft size={18} />
            </DrawerClose>
            <div className="bg-gray-500/25 w-full rounded-full shadow-md flex items-center pl-4">
              <FaSearch />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索作品"
                className="bg-gray-500/10 rounded-full border-0 focus:border-transparent focus-visible:ring-0"
              />
            </div>
            <button onClick={searchHandler} className="w-[50px]">
              搜索
            </button>
          </div>
          <div className="pt-5 pb-5">
            <div className="grid grid-cols-3 gap-1">
              {videos.map((item: any, index: number) => (
                <div
                  key={item.id}
                  ref={index === videos.length - 1 ? lastVideoElementRef : null}
                >
                  <VideoCard videoData={item} />
                </div>
              ))}
            </div>
            {isLoading ? (
              <img className="w-10 mx-auto" src={loader} alt="" />
            ) : (
              <></>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default SearchVideo;
