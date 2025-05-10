import { useEffect, useState } from "react";
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
import VideoCard2 from "../video-card2";
import InfinitLoad from "@/components/shared/infinit-load";
import loader from "@/page/home/vod_loader.gif";
import { useSearchParams } from "react-router-dom";
import VideoFeed from "@/page/home/components/VideoFeed";
// import {
//   isMobile,
//   isAndroid,
//   isIOS,
//   isBrowser,
//   isChrome,
//   isIOS13,
//   getUA,
// } from "react-device-detect";

export function isWebView() {
  return (
    (window as any).webkit &&
    (window as any).webkit.messageHandlers &&
    (window as any).webkit.messageHandlers.jsBridge
  );
  // const ua = navigator.userAgent || "";
  // const standalone = window.navigator.standalone;

  // const isIOS = /iPhone|iPad|iPod/.test(ua);
  // const isAndroid = /Android/.test(ua);

  // const isIOSWebView =
  //   isIOS && (!ua.includes("Safari") || standalone === false);
  // const isAndroidWebView = isAndroid && ua.includes("wv");

  // const isCustomFlag = window.IS_APP === true; // if injected from native

  // return isIOSWebView || isAndroidWebView || isCustomFlag;
}

const SearchVideo = ({ id }: { id: string }) => {
  const [vh, setVh] = useState("100vh");
  const [postsSearch, { isLoading }] = usePostsSearchMutation();
  const [search, setSearch] = useState<string>("");
  const [videos, setVideos] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [page2, setPage2] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const [totalData, setTotalData] = useState<number>(0);

  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("query") || "";
  const [query, setQuery] = useState(initialQuery);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [showVideoFeed, setShowVideoFeed] = useState(false);

  const searchHandler = async () => {
    setPage(1);
    setPage2(2);
    if (search.trim() !== "") {
      const { data } = await postsSearch({ page: 1, search, user_id: id });
      setVideos(data?.data?.list ?? []);
      setTotalData(data?.pagination?.total ?? 0);
    } else {
      setVideos([]);
      setTotalData(0);
    }
  };

  useEffect(() => {
    if (totalData <= videos.length) {
      setHasMore(false);
    } else {
      setHasMore(true);
      fetchMoreData();
    }
  }, [totalData, videos]);

  const fetchMoreData = async () => {
    if (search.trim() !== "") {
      setPage2((prev) => prev + 1);
      const { data } = await postsSearch({ page: page2, search, user_id: id });
      setVideos((prev) => [...prev, ...(data?.data?.list ?? [])]);
    }
  };

  // useEffect(() => {
  //   setSearch(null);
  //   setPage(1);
  //   setPage2(2);
  //   setVideos([]);
  //   setHasMore(false);
  //   setTotalData(0);
  // }, []);

  // console.log(page);
  // useEffect(() => {
  //   if (!isInWebView()) {
  //     // console.log("application");
  //     setVh("95vh");
  //   } else {
  //     // console.log("website");
  //     setVh("100vh");
  //   }
  // }, []);
  useEffect(() => {
    // setVh(isMobile ? "95vh" : "100vh");
    setVh(isWebView() ? "100vh" : "100dvh");
  }, []);

  return (
    <div className={`${showVideoFeed ? "z-[9900] relative h-screen" : ""}`}>
      <Drawer>
        <DrawerTrigger>
          <div className="bg-[#FFFFFF1F] w-10 h-10 flex justify-center items-center p-2 rounded-full">
            <Search size={18} />
          </div>
        </DrawerTrigger>

        {showVideoFeed && selectedMovieId ? (
          <div className="z-[9999] h-screen fixed top-0 overflow-y-scroll left-0 w-full">
            <VideoFeed
              // setPage={setPage2}
              setVideos={setVideos}
              videos={videos}
              currentActiveId={selectedMovieId}
              setShowVideoFeed={setShowVideoFeed}
              query={query}
            />
          </div>
        ) : (
          <DrawerContent
            className={`z-[8900] border-0 `}
            style={{ height: vh }}
          >
            <>
              <div className="c-height w-full overflow-y-scroll hide-sb">
                <div className=" px-5 z-[8000]  bg-[#16131C] sticky top-0 py-5 flex items-center gap-3">
                  <DrawerClose
                    onClick={() => {
                      setSearch("");
                      setPage(1);
                      setPage2(2);
                      setVideos([]);
                      setHasMore(false);
                      setTotalData(0);
                    }}
                  >
                    <ChevronLeft size={18} />
                  </DrawerClose>
                  <div className="border border-gray-700 w-full rounded-full shadow-md flex items-center pl-4">
                    <FaSearch />
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="搜索作品"
                      className="bg-transparent placeholder:text-white rounded-full border-0 focus:border-transparent focus-visible:ring-0"
                    />
                  </div>
                  <button onClick={searchHandler} className="w-[50px]">
                    搜索
                  </button>
                </div>
                {isLoading && page == 1 && page2 == 2 ? (
                  <div className="w-full flex justify-center items-center mt-[100px]">
                    <img src={loader} className="w-14" alt="" />
                  </div>
                ) : (
                  <div className="py-5">
                    <div className="grid grid-cols-2 gap-1">
                      {videos.map((item: any) => (
                        <div
                          key={item.post_id}
                          onClick={() => {
                            // console.log(item);
                            setSelectedMovieId(item?.post_id);
                            setShowVideoFeed(true);
                          }}
                        >
                          <VideoCard2 videoData={item} />
                        </div>
                      ))}
                    </div>
                    <InfinitLoad
                      data={videos}
                      fetchData={fetchMoreData}
                      hasMore={hasMore}
                    />
                  </div>
                )}
              </div>
            </>
          </DrawerContent>
        )}
      </Drawer>
    </div>
  );
};

export default SearchVideo;
