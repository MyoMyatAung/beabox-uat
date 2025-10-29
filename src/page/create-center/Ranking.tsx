import MyRankCard from "@/components/create-center/my-rank-card";
import Top3 from "@/components/ranking/top3";
import Loader from "@/components/shared/loader";
import {
  useGetConfigQuery,
  useGetTopCreatorQuery,
  useGetTopVideoQuery,
} from "@/store/api/createCenterApi";
import { useGetExploreHeaderQuery } from "@/store/api/explore/exploreApi";
import { UsersRound, ImagePlayIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useSelector } from "react-redux";
import {
  useGetUserProfileQuery,
  useShareInfoMutation,
} from "@/store/api/profileApi";
import logo from "@/assets/logo.svg";
import loader from "@/page/home/vod_loader.gif";
import OtherRank from "@/components/ranking/other-rank";
import { useGetUserShareQuery } from "../home/services/homeApi";
import RankingLoadMore from "@/components/shared/ranking-load-more";
import { cn } from "@/lib/utils";
import Top3Video from "@/components/ranking/top3-video";
import OtherRankVideo from "@/components/ranking/other-rank-video";
import VideoRankFeed from "@/components/ranking/video-rank-feed";

const ranges = [
  { value: "today", title: "今日" },
  { value: "this_week", title: "本周" },
  { value: "this_month", title: "本月" },
  { value: "this_year", title: "今年" },
];

const Ranking = () => {
  const user = useSelector((state: any) => state?.persist?.user);
  const id = user?.id;
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTab = searchParams.get("tab") || "video";
  const [rankingList, setRankingList] = useState<any>([]);
  const [videoRankingList, setVideoRankingList] = useState<any>([]);
  const [totalData, setTotalData] = useState<number>(0);
  const [totalVideoData, setTotalVideoData] = useState<number>(0);
  const [hasMore, setHasMore] = useState(true);
  const [hasMoreVideo, setHasMoreVideo] = useState(true);
  const [showHeader, setShowHeader] = useState(false);
  const [isFilterSticky, setIsFilterSticky] = useState(false);
  const titleTabsRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<any>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const [isCopied2, setIsCopied2] = useState(false);

  const otherRankRef = useRef<HTMLDivElement>(null);
  const otherRankVideoRef = useRef<HTMLDivElement>(null);
  const pageContainerRef = useRef<HTMLDivElement>(null);

  const top3SectionRef = useRef<HTMLDivElement>(null);
  const adsSectionRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();

  const top3Y = useTransform(scrollY, [0, 1500], [0, 350]);
  const adsY = useTransform(scrollY, [0, 1500], [0, 350]);

  const top3Opacity = useTransform(scrollY, [100, 400], [1, 0]);
  const adsOpacity = useTransform(scrollY, [150, 450], [1, 0]);

  const stickyBottomY = useTransform(scrollY, [800, 2500], [0, -200]);
  const [cachedDownloadLink, setCachedDownloadLink] = useState(null);
  const [shareInfo] = useShareInfoMutation();
  const [ads, setAds] = useState<any>([]);

  // Video feed states
  const [showVideoFeed, setShowVideoFeed] = useState(false);
  const [currentActiveVideoId, setCurrentActiveVideoId] = useState<
    string | null
  >(null);

  // Handle video card click to open feed
  const handleVideoCardClick = (videoId: string) => {
    setCurrentActiveVideoId(videoId);
    setShowVideoFeed(true);
  };

  // Handle tab change with URL sync
  const handleTabChange = (tab: string) => {
    setSearchParams({ tab });
    // Scroll to top when switching tabs for better UX
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const {
    data: userData,
    isLoading: userLoading,
    isFetching: userFetching,
  } = useGetUserProfileQuery(id, {
    skip: !id,
  });
  const code = userData?.data?.user_code ? userData?.data?.user_code : "";

  const { data: shareData } = useGetUserShareQuery({
    type: "ranking",
    id: code,
    qr_code: 0,
  });

  const { data: exploreData, isLoading: exploreLoading } =
    useGetExploreHeaderQuery("");

  useEffect(() => {
    if (shareData?.data?.link) {
      setCachedDownloadLink(shareData?.data?.content);
    }
  }, [shareData]);

  useEffect(() => {
    if (exploreData?.data) {
      const adsData = exploreData?.data?.ads?.application?.apps;
      setAds(adsData || []);
    }
  }, [exploreData]);

  const isIOSApp = () => {
    return (
      (window as any).webkit &&
      (window as any).webkit.messageHandlers &&
      (window as any).webkit.messageHandlers.jsBridge
    );
  };

  const sendEventToNative = (name: string, text: string) => {
    if (
      (window as any).webkit &&
      (window as any).webkit.messageHandlers &&
      (window as any).webkit.messageHandlers.jsBridge
    ) {
      (window as any).webkit.messageHandlers.jsBridge.postMessage({
        eventName: name,
        value: text,
      });
    }
  };

  const handleCopy2 = async () => {
    // If we already have a cached link, use it
    if (cachedDownloadLink) {
      copyToClipboard(cachedDownloadLink);
      return;
    }

    // If we have share data but no cached link yet
    if (shareData?.data?.link) {
      setCachedDownloadLink(shareData.data.content);
      copyToClipboard(shareData.data.content);
      return;
    }

    // Fallback to a default link if no share data is available
    const defaultLink = window.location.href;
    copyToClipboard(defaultLink);
  };

  const copyToClipboard = (link: any) => {
    if (isIOSApp()) {
      sendEventToNative("copyAppdownloadUrl", link);
    } else {
      navigator.clipboard
        .writeText(link)
        .then(() => {
          setIsCopied2(true);
          setTimeout(() => setIsCopied2(false), 2000);
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    }
  };

  const [page, setPage] = useState(1);
  const [videoPage, setVideoPage] = useState(1);
  const [selectedRange, setSelectedRange] = useState({
    value: "today",
    title: "今日",
  });
  const [selectedType, setSelectedType] = useState<any>({});
  const [selectedVideoTag, setSelectedVideoTag] = useState<string>("");
  const [isTagsExpanded, setIsTagsExpanded] = useState(false);
  const [combinedHeight, setCombinedHeight] = useState<number>(0);

  // Calculate combined height and update state
  const updateCombinedHeight = () => {
    if (titleTabsRef.current && filterRef.current) {
      const titleTabsHeight = titleTabsRef.current.offsetHeight;
      const filterHeight = filterRef.current.offsetHeight;
      setCombinedHeight(titleTabsHeight + filterHeight);
    }
  };

  // Update height when isTagsExpanded changes
  useEffect(() => {
    // Use setTimeout to ensure DOM has updated
    const timeoutId = setTimeout(updateCombinedHeight, 0);
    return () => clearTimeout(timeoutId);
  }, [isTagsExpanded, selectedTab]);

  const { data: configData, isLoading: loading1 } = useGetConfigQuery({});
  const {
    data: creatorData,
    isLoading: isCreatorLoading,
    refetch,
    isFetching,
  } = useGetTopCreatorQuery(
    {
      page,
      type: selectedRange?.value,
      tag: selectedType?.keyword,
      token: user?.token,
    },
    {
      skip: selectedTab !== "author",
    }
  );
  const {
    data: videoData,
    isLoading: isVideoLoading,
    refetch: videoRefetch,
    isFetching: isVideoFetching,
  } = useGetTopVideoQuery(
    {
      page: videoPage,
      rank: selectedType?.keyword,
      tag: selectedVideoTag,
      type: selectedRange?.value,
      token: user?.token,
    },
    {
      skip:
        selectedTab !== "video" ||
        !selectedType.keyword ||
        !selectedVideoTag ||
        !selectedRange.value,
    }
  );

  useEffect(() => {
    if (configData?.status) {
      if (configData?.data?.creator_center_ranking_filter?.length)
        setSelectedType(configData?.data?.creator_center_ranking_filter[0]);
      if (configData?.data?.top_video_tags) {
        const tags = configData?.data?.top_video_tags.split(",");
        setSelectedVideoTag(tags?.[0] || "");
      }
    }
  }, [configData]);

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        // Show header when the element's top is out of the viewport
        if (rect.top <= 0) {
          setShowHeader(true);
        } else {
          setShowHeader(false);
        }
      }

      if (filterRef.current) {
        const filterRect = filterRef.current.getBoundingClientRect();
        if (filterRect.top <= 100) {
          setIsFilterSticky(true);
        } else {
          setIsFilterSticky(false);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (totalData <= rankingList.length || rankingList.length < 20) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  }, [totalData, rankingList]);

  const fetchMoreData = () => {
    if (hasMore && !isFetching) {
      // Prevent duplicate requests
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (
      totalVideoData <= videoRankingList.length ||
      videoRankingList.length < 20
    ) {
      setHasMoreVideo(false);
    } else {
      setHasMoreVideo(true);
    }
  }, [totalVideoData, videoRankingList]);

  const fetchMoreVideoData = () => {
    if (hasMoreVideo && !isVideoFetching) {
      // Prevent duplicate requests
      setVideoPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    setPage(1); // Reset pagination
    setVideoPage(1);
    setRankingList([]); // Clear existing ranking data
    setVideoRankingList([]); // Clear existing video ranking data
    setHasMore(true); // Reset infinite scroll
    setHasMoreVideo(true); // Reset video infinite scroll

    // Scroll to top when filters change for better UX
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [selectedRange, selectedType, selectedVideoTag]);

  useEffect(() => {
    if (creatorData?.data?.list) {
      if (page === 1) {
        // Replace the list when page is 1 (new filter or initial load)
        setRankingList(creatorData.data.list);
      } else {
        // Filter out duplicates before adding new data
        const newItems = creatorData.data.list.filter(
          (newItem: any) =>
            !rankingList.some((item: any) => item.id === newItem.id)
        );
        setRankingList((prev: any) => [...prev, ...newItems]);
      }
      setTotalData(creatorData?.pagination?.total);
    }
  }, [creatorData]);

  useEffect(() => {
    if (videoData?.data) {
      if (videoPage === 1) {
        // Replace the list when page is 1 (new filter or initial load)
        setVideoRankingList(videoData.data);
      } else {
        // Filter out duplicates before adding new data
        setVideoRankingList((prev: any) => {
          const newItems = videoData.data.filter(
            (newItem: any) =>
              !prev.some((item: any) => item.post_id === newItem.post_id)
          );
          return [...prev, ...newItems];
        });
      }
      setTotalVideoData(videoData?.pagination?.total);
    }
  }, [videoData]);

  useEffect(() => {
    return () => {
      // Reset state when component unmounts
      setRankingList([]);
      setVideoRankingList([]);
      setPage(1);
      setVideoPage(1);
    };
  }, []);

  useEffect(() => {
    // Reset page and refetch when token changes
    if (user?.token) {
      setPage(1);
      setVideoPage(1);
      setRankingList([]);
      setVideoRankingList([]);
      // refetch();
    }
  }, [user?.token, refetch]);

  useEffect(() => {
    if (page == 6) setHasMore(false);
  }, [page]);

  if (
    loading1 &&
    isCreatorLoading &&
    isVideoLoading &&
    page === 1 &&
    videoPage === 1
  )
    return <Loader />;

  return (
    <div ref={pageContainerRef} className="">
      <div
        className={cn(
          "w-full h-full bg-cover bg-no-repeat fixed top-0 left-0 z-20",
          {
            "min-h-[214px] bg-[url('./assets/createcenter/ccbg-video.png')]":
              selectedTab === "video",
            "min-h-[173px] bg-[url('./assets/createcenter/ccbg-author.png')]":
              selectedTab === "author",
          }
        )}
        style={{ height: `${combinedHeight}px` }}
      ></div>
      {isCopied2 ? (
        <div className="fixed w-full h-screen bg-[#000000CC]  z-[3000] top-0 left-0">
          <div className="w-full z-[1300] absolute top-[80vh] flex justify-center">
            <div className="text-[14px] bg-[#191721] px-2 py-1 rounded-lg w-[103px] flex items-center gap-2 text-center">
              <img src={logo} className="w-5" alt="" />
              <span>复制成功</span>
            </div>
          </div>
          {/* 1 */}
        </div>
      ) : (
        ""
      )}
      <div className="relative">
        <div
          ref={titleTabsRef}
          className="pt-5 z-30 flex justify-between items-center sticky top-0"
        >
          <h1 className="text-[18px] opacity-0 text-center">排行榜</h1>
          <div className="flex items-start gap-x-6 h-11">
            {[
              {
                key: "video",
                label: "内容热榜",
                defaultColor: "text-gray-200",
              },
              {
                key: "author",
                label: "作者热榜",
                defaultColor: "text-gray-300",
              },
            ].map((tab) => (
              <div
                key={tab.key}
                className="flex flex-col gap-y-2 items-center cursor-pointer"
                onClick={() => handleTabChange(tab.key)}
              >
                <h1
                  className={cn(
                    "text-center text-xl transition-all duration-300 ease-in-out",
                    tab.defaultColor,
                    {
                      "text-white font-bold text-2xl": selectedTab === tab.key,
                    }
                  )}
                >
                  {tab.label}
                </h1>
                <div
                  className={cn(
                    "h-[3px] w-7 bg-white rounded-full transition-all duration-300 ease-in-out",
                    {
                      "opacity-100 scale-100": tab.key === selectedTab,
                      "opacity-0 scale-75": tab.key !== selectedTab,
                    }
                  )}
                />
              </div>
            ))}
          </div>
          <div onClick={() => handleCopy2()} className="new_share_button mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="16"
              viewBox="0 0 21 16"
              fill="none"
            >
              <path
                d="M18.3644 9.14101L18.3646 9.14104L12.3285 15.1769C12.2574 15.248 12.1507 15.2697 12.0564 15.2309C11.9634 15.1923 11.9024 15.101 11.9024 15.0004V12.0162V11.2402L11.1269 11.2666C5.31469 11.4646 2.42333 13.3101 1.58207 13.9633H1.5473L1.32893 14.1759C1.25101 14.2517 1.13063 14.2688 1.03267 14.215C0.934575 14.1602 0.885528 14.0493 0.908499 13.943L0.908565 13.9427L0.908616 13.9425C0.917513 13.9049 1.42645 11.7536 2.96879 9.54177C4.51457 7.32496 7.06877 5.08129 11.2063 4.78322L11.9024 4.73307V4.03516V0.999607C11.9024 0.898961 11.9634 0.80759 12.0565 0.768965L11.7693 0.0761493L12.0559 0.76923C12.1503 0.730194 12.2572 0.751864 12.3284 0.823053L19.3291 7.82345C19.3768 7.87123 19.4028 7.9349 19.4028 7.99999C19.4028 8.06511 19.3768 8.12876 19.3291 8.1765L18.3644 9.14101Z"
                stroke="white"
                stroke-width="1.5"
              />
            </svg>
          </div>
        </div>
        <motion.div
          ref={top3SectionRef}
          className="pb-5 z-20 relative"
          style={{
            y: top3Y,
            opacity: top3Opacity,
          }}
        >
          {selectedTab === "author" && (
            <Top3 rankingData={rankingList} refetch={refetch} />
          )}
          {selectedTab === "video" && (
            <Top3Video
              rankingData={videoRankingList}
              onVideoClick={handleVideoCardClick}
            />
          )}
        </motion.div>
        <motion.div
          ref={adsSectionRef}
          className="z-20 relative"
          style={{
            y: adsY,
            opacity: adsOpacity,
          }}
        >
          {/* Ads Section - Only in normal view, not sticky */}
          <div className="py-[20px] px-[10px]">
            {/* <h1 className="text-white text-[14px] font-[500] leading-[20px] pb-[12px] px-1">
            {exploreData?.data?.ads?.application?.title || ""}
          </h1> */}
            {exploreLoading ? (
              <div className="grid grid-cols-6 gap-[20px]">
                {[...Array(12)].map((_, index) => (
                  <div
                    key={index}
                    className="w-[56px] h-[53px] rounded-md bg-white/20 animate-pulse"
                  ></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-6 gap-[5px]">
                {ads?.map((app: any) => (
                  <a
                    key={app.id}
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col justify-center items-center gap-[4px]"
                  >
                    <img
                      className="min-w-[56px] min-h-[56px] rounded-[6px] border-[#222]"
                      src={app.image}
                      alt={app.title}
                    />
                    <h1 className="text-white ad_update text-[14px] font-[400]">
                      {app.title}
                    </h1>
                  </a>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        <div
          ref={filterRef}
          className={cn(
            "z-30 sticky top-[64px] w-full pb-3 transition-colors duration-300 space-y-3",
            {
              "bg-transparent": isFilterSticky,
              "bg-[#16131C]": !isFilterSticky,
            }
          )}
        >
          <div className="flex items-center gap-4 px-2">
            {configData?.data?.creator_center_ranking_filter?.map(
              (rank: any) => (
                <div
                  className="flex flex-col justify-center items-center gap-3"
                  key={rank?.title}
                >
                  <div className="w-[58px] h-[3px] rounded-[1px] bg-transparent"></div>
                  <button
                    onClick={() => {
                      setSelectedType(rank);
                      setSelectedRange({
                        value: "today",
                        title: "今日",
                      });
                    }}
                    className={`text-[14px] ${
                      selectedType?.keyword == rank?.keyword
                        ? "text-white"
                        : "text-[#999]"
                    }`}
                  >
                    {rank?.title}
                  </button>
                  <div
                    className={`w-[58px] h-[3px] rounded-[1px] ${
                      selectedType?.keyword == rank?.keyword
                        ? "bg-[#CD3EFF]"
                        : "bg-transparent"
                    } `}
                  ></div>
                </div>
              )
            )}
          </div>
          {selectedTab === "video" && (
            <div className="relative flex items-end justify-between pr-2 gap-x-2">
              <div
                className={`px-2 gap-2 ${
                  isTagsExpanded
                    ? "flex flex-wrap"
                    : "flex items-center overflow-x-scroll scrollbar-hide"
                }`}
              >
                {configData?.data?.top_video_tags
                  .split(",")
                  ?.map((tag: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedVideoTag(tag)}
                      className={`text-[14px] whitespace-nowrap flex-shrink-0 ${
                        selectedVideoTag == tag
                          ? "text-white bg-[#CD3EFF]"
                          : "text-[#999] bg-[#FFFFFF05]"
                      } px-5 py-1 text-center rounded-full`}
                    >
                      {tag}
                    </button>
                  ))}
                {configData?.data?.top_video_tags
                  .split(",")
                  ?.map((tag: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedVideoTag(tag)}
                      className={`text-[14px] whitespace-nowrap flex-shrink-0 ${
                        selectedVideoTag == tag
                          ? "text-white bg-[#CD3EFF]"
                          : "text-[#999] bg-[#FFFFFF05]"
                      } px-5 py-1 text-center rounded-full`}
                    >
                      {tag}
                    </button>
                  ))}
              </div>
              <button
                onClick={() => setIsTagsExpanded(!isTagsExpanded)}
                className="flex-shrink-0 relative z-[1] bg-[#242129] flex items-center justify-center size-7 rounded-full"
              >
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 19 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`transition-transform duration-200 ${
                    isTagsExpanded ? "rotate-180" : ""
                  }`}
                >
                  <path
                    d="M9.24665 10.1584L5.39665 6.30835L4.29687 7.40813L9.24665 12.3579L14.1964 7.40813L13.0967 6.30835L9.24665 10.1584Z"
                    fill="white"
                  />
                </svg>
              </button>
              {!isTagsExpanded && (
                <div
                  className="absolute bottom-0 right-0 w-20 h-7"
                  style={{
                    background: isFilterSticky
                      ? "transparent"
                      : "linear-gradient(270deg, #16131C 21.43%, rgba(22, 19, 28, 0.8) 61.97%, rgba(22, 19, 28, 0) 100%)",
                  }}
                ></div>
              )}
            </div>
          )}
          <div className="flex px-2 items-center gap-2 top-0 overflow-x-scroll scrollbar-hide">
            {ranges?.map((range: any) => (
              <button
                onClick={() => setSelectedRange(range)}
                className={`text-[14px] whitespace-nowrap flex flex-shrink-0 ${
                  selectedRange?.value == range?.value
                    ? "text-white bg-[#CD3EFF]"
                    : "text-[#999] bg-[#FFFFFF05]"
                } px-5 py-1 text-center rounded-full`}
              >
                {range?.title}
              </button>
            ))}
          </div>
        </div>

        <motion.div style={{ y: stickyBottomY }} className="relative">
          {selectedTab === "author" && (
            <>
              <div
                ref={otherRankRef}
                className="z-10 px-5 py-5 space-y-4 sticky"
              >
                {isFetching && page == 1 ? (
                  <div className="flex w-full items-center justify-center my-20">
                    <img src={loader} alt="" className="w-12" />
                  </div>
                ) : rankingList?.length > 3 ? (
                  <OtherRank data={rankingList} refetch={refetch} />
                ) : (
                  <div className="w-full flex justify-center items-center my-20">
                    <div className="flex flex-col justify-center items-center gap-3">
                      <UsersRound className="text-[#888888]" />
                      <p className="text-[14px] text-[#888888]">
                        当前没有创作者展示
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {page !== 6 ? (
                <RankingLoadMore
                  userFetching={userFetching}
                  data={rankingList}
                  fetchData={fetchMoreData}
                  hasMore={hasMore}
                />
              ) : (
                <></>
              )}
            </>
          )}
          {selectedTab === "video" && (
            <>
              <div
                ref={otherRankVideoRef}
                className="z-10 px-5 py-5 space-y-4 sticky"
              >
                {isVideoFetching && videoPage == 1 ? (
                  <div className="flex w-full items-center justify-center my-20">
                    <img src={loader} alt="" className="w-12" />
                  </div>
                ) : videoRankingList?.length > 3 ? (
                  <OtherRankVideo
                    data={videoRankingList}
                    refetch={videoRefetch}
                    onVideoClick={handleVideoCardClick}
                  />
                ) : (
                  <div className="w-full flex justify-center items-center my-20">
                    <div className="flex flex-col justify-center items-center gap-3">
                      <ImagePlayIcon className="text-[#888888]" />
                      <p className="text-[14px] text-[#888888]">
                        目前没有显示内容
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {videoPage !== 6 ? (
                <RankingLoadMore
                  userFetching={isVideoFetching}
                  data={videoRankingList}
                  fetchData={fetchMoreVideoData}
                  hasMore={hasMoreVideo}
                />
              ) : (
                <></>
              )}
            </>
          )}
          <div className="h-[68px]"></div>
        </motion.div>

        {/* MyRankCard outside parallax motion for stability */}
        {selectedTab === "author" && user?.token && (
          <MyRankCard myrank={creatorData?.data?.my_rank} />
        )}
      </div>
      <div className="py-8"></div>

      {/* Video Feed Modal */}
      {showVideoFeed && (
        <div className="fixed inset-0 z-[10000] bg-black">
          <VideoRankFeed
            videos={videoRankingList}
            currentActiveId={currentActiveVideoId}
            setShowVideoFeed={setShowVideoFeed}
            query="视频排行榜"
            setVideos={setVideoRankingList}
            setPage={setVideoPage}
            search={false}
          />
        </div>
      )}
    </div>
  );
};

export default Ranking;
