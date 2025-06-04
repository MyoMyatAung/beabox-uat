import MyRankCard from "@/components/create-center/my-rank-card";
import Top3 from "@/components/ranking/top3";
import Loader from "@/components/shared/loader";
import {
  useGetConfigQuery,
  useGetTopCreatorQuery,
} from "@/store/api/createCenterApi";
import { useGetExploreHeaderQuery } from "@/store/api/explore/exploreApi";
import { UsersRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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

const ranges = [
  { value: "today", title: "今日" },
  { value: "this_week", title: "本周" },
  { value: "this_month", title: "本月" },
  { value: "this_year", title: "今年" },
];

const Ranking = () => {
  const user = useSelector((state: any) => state?.persist?.user);
  const id = user?.id;
  const [rankingList, setRankingList] = useState<any>([]);
  const [totalData, setTotalData] = useState<number>(0);
  const [hasMore, setHasMore] = useState(true);
  const [showHeader, setShowHeader] = useState(false);
  const headerRef = useRef<any>(null);
  const [isCopied2, setIsCopied2] = useState(false);
  const [cachedDownloadLink, setCachedDownloadLink] = useState(null);
  const [shareInfo] = useShareInfoMutation();
  const [ads, setAds] = useState<any>([]);

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

  const { data: exploreData, isLoading: exploreLoading } = useGetExploreHeaderQuery("");

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
  const [selectedRange, setSelectedRange] = useState({
    value: "today",
    title: "今日",
  });
  const [selectedType, setSelectedType] = useState<any>({});
  const { data: configData, isLoading: loading1 } = useGetConfigQuery({});
  const { data, isLoading, refetch, isFetching } = useGetTopCreatorQuery({
    page,
    type: selectedRange?.value,
    tag: selectedType?.keyword,
    token: user?.token,
  });
  useEffect(() => {
    if (
      configData?.status &&
      configData?.data?.creator_center_ranking_filter?.length
    )
      setSelectedType(configData?.data?.creator_center_ranking_filter[0]);
  }, [configData]);
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        // Trigger when the element's top is out of the viewport
        if (rect.top <= 0) {
          setShowHeader(true);
        } else {
          setShowHeader(false);
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
    setPage(1); // Reset pagination
    setRankingList([]); // Clear existing ranking data
    setHasMore(true); // Reset infinite scroll
  }, [selectedRange, selectedType]);

  useEffect(() => {
    if (data?.data?.list) {
      if (page === 1) {
        // Replace the list when page is 1 (new filter or initial load)
        setRankingList(data.data.list);
      } else {
        // Filter out duplicates before adding new data
        const newItems = data.data.list.filter(
          (newItem: any) =>
            !rankingList.some((item: any) => item.id === newItem.id)
        );
        setRankingList((prev: any) => [...prev, ...newItems]);
      }
      setTotalData(data?.pagination?.total);
    }
  }, [data]);

  useEffect(() => {
    return () => {
      // Reset state when component unmounts
      setRankingList([]);
      setPage(1);
    };
  }, []);

  useEffect(() => {
    // Reset page and refetch when token changes
    if (user?.token) {
      setPage(1);
      setRankingList([]);
      refetch();
    }
  }, [user?.token, refetch]);

  useEffect(() => {
    if (page == 6) setHasMore(false);
  }, [page]);

  if (loading1 && isLoading && page === 1) return <Loader />;

  return (
    <div className="">
      <div className="ccbg fixed top-0 left-0 "></div>
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
      <div className="relative z-50">
        <div className="pt-5 z-50 flex justify-between items-center">
          <h1 className="text-[18px] opacity-0 text-center">排行榜</h1>
          <h1 className="text-[18px] text-center">排行榜</h1>
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
        <div className={`pb-5}`}>
          <Top3 rankingData={rankingList} refetch={refetch} />
        </div>
        <div ref={headerRef} className="w-full"></div>

        {/* Ads Section - Only in normal view, not sticky */}
        <div className="pt-[20px] px-[10px]">
          {/* <h1 className="text-white text-[14px] font-[500] leading-[20px] pb-[12px] px-1">
            {exploreData?.data?.ads?.application?.title || ""}
          </h1> */}
          {exploreLoading ? (
            <div className="grid grid-cols-6 gap-[20px]">
              {[...Array(12)].map((_, index) => (
                <div key={index} className="w-[56px] h-[53px] rounded-md bg-white/20 animate-pulse"></div>
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

        <div
          className={`w-full sticky top-0 ${
            showHeader ? "ccbg2 z-50 pb-1" : ""
          }`}
        >
          {showHeader ? (
            <div className="pt-5 z-50 animate-fade-in">
              <h1 className="text-[18px] text-center">排行榜</h1>
            </div>
          ) : (
            <></>
          )}
          
          <div className="flex items-center gap-4 px-2">
            {configData?.data?.creator_center_ranking_filter?.map(
              (tag: any) => (
                <div
                  className="flex flex-col justify-center items-center gap-3"
                  key={tag?.title}
                >
                  <div className="w-[58px] h-[3px] rounded-[1px] bg-transparent"></div>
                  <button
                    onClick={() => {
                      setSelectedType(tag);
                      setSelectedRange({
                        value: "today",
                        title: "今日",
                      });
                    }}
                    className={`text-[14px] ${
                      selectedType?.keyword == tag?.keyword
                        ? "text-white"
                        : "text-[#999]"
                    }`}
                  >
                    {tag?.title}
                  </button>
                  <div
                    className={`w-[58px] h-[3px] rounded-[1px] ${
                      selectedType?.keyword == tag?.keyword
                        ? "bg-[#CD3EFF]"
                        : "bg-transparent"
                    } `}
                  ></div>
                </div>
              )
            )}
          </div>
          <div className="w-full h-[1px] bg-[#FFFFFF05]"></div>
          <div className="flex my-3 px-2 items-center gap-2 top-0">
            {ranges?.map((range: any) => (
              <button
                onClick={() => setSelectedRange(range)}
                className={`text-[14px] ${
                  selectedRange?.value == range?.value
                    ? "text-white bg-[#FFFFFF1F]"
                    : "text-[#999] bg-[#FFFFFF05]"
                } px-5 py-1 text-center rounded-full`}
              >
                {range?.title}
              </button>
            ))}
          </div>
        </div>
        <div className="px-5 py-5 space-y-4 sticky">
          {isFetching && page == 1 ? (
            <div className="flex w-full items-center justify-center pt-[100px]">
              <img src={loader} alt="" className="w-12" />
            </div>
          ) : rankingList?.length > 3 ? (
            <OtherRank data={rankingList} refetch={refetch} />
          ) : (
            <div className="w-full flex justify-center items-center mt-[100px]">
              <div className="flex flex-col justify-center items-center gap-3">
                <UsersRound className="text-[#888888]" />
                <p className="text-[14px] text-[#888888]">当前没有创作者展示</p>
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
        {user?.token ? <MyRankCard myrank={data?.data?.my_rank} /> : <></>}
      </div>
      <div className="py-32"></div>
    </div>
  );
};

export default Ranking;
