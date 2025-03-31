import MyRankCard from "@/components/create-center/my-rank-card";
import RankingCard from "@/components/create-center/ranking-card";
import Top3 from "@/components/ranking/top3";
import Loader from "@/components/shared/loader";
import {
  useGetConfigQuery,
  useGetTopCreatorQuery,
} from "@/store/api/createCenterApi";
import { UsersRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import "swiper/css";
import "swiper/css/autoplay";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules"; // Import Swiper's autoplay module
import InfinitLoad from "@/components/shared/infinit-load";

const ranges = [
  { value: "today", title: "今日" },
  { value: "this_week", title: "本周" },
  { value: "this_month", title: "本月" },
  { value: "this_year", title: "今年" },
];

const Ranking = () => {
  const user = useSelector((state: any) => state?.persist?.profileData);
  const [ad, setAd] = useState([]);
  const [rankingList, setRankingList] = useState<any>([]);
  const [totalData, setTotalData] = useState<number>(0);
  const [hasMore, setHasMore] = useState(true);
  const [showHeader, setShowHeader] = useState(false);
  const headerRef = useRef(null);
  const { applicationData } = useSelector((state: any) => state.explore);

  const [page, setPage] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState(0);

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
        if (rect.top <= 100) {
          setShowHeader(true);
        } else {
          setShowHeader(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  console.log(showHeader);
  const handleOnChange = (swiper: any) => {
    setSelectedIndex(swiper.realIndex);
  };
  useEffect(() => {
    if (applicationData) {
      setAd(applicationData.carousel);
    }
  }, [applicationData]);

  useEffect(() => {
    if (data?.data?.list?.length) {
      // Append new data to the existing videos
      setRankingList((pev: any) => [...pev, ...data?.data?.list]);
      setTotalData(data?.pagination?.total);
    }
  }, [data]);

  useEffect(() => {
    if (totalData <= rankingList.length) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  }, [totalData, rankingList]);

  console.log(data, "rl");

  const fetchMoreData = () => {
    if (hasMore) {
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
        setRankingList(data.data.list); // Replace ranking list when filter changes
      } else {
        setRankingList((prev: any) => [...prev, ...data.data.list]); // Append new results for infinite scroll
      }
      setTotalData(data?.pagination?.total);
    }
  }, [data]);



  if (loading1 && isLoading && page === 1) return <Loader />;

  return (
    <div className="">
      <div className="ccbg fixed top-0 left-0 "></div>
      <div className="relative z-50">
        <div className="pt-5 z-50">
          <h1 className="text-[18px] text-center">排行榜</h1>
        </div>
        <div className="test">
          <div className=" relative pt-[10px]">
            <Swiper
              className=""
              slidesPerView={1.5}
              spaceBetween={50}
              centeredSlides={true}
              loop={true}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              modules={[Autoplay]}
              onSlideChange={handleOnChange}
            >
              {ad.map((cc: any, index: number) => (
                <SwiperSlide className=" w-full rounded-[12px]" key={index}>
                  <a
                    href={cc.url}
                    target="_blank"
                    className={`flex rounded-[12px] justify-center w-full items-center px-[8px] flex-col relative transition-all duration-300 `}
                  >
                    <div className=" w-[332px] h-[90px] px-2 overflow-hidden rounded-[12px]">
                      <img
                        className={`object-cover object-center w-full h-full transition-all rounded-[12px] duration-300 ${
                          selectedIndex === index
                            ? "p-0 m-0 opacity-100"
                            : "p-2 opacity-70 "
                        }`}
                        src={cc.image}
                        alt={`Slide ${index + 1}`}
                      />
                    </div>
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
        <div className="pb-5">
          <Top3 rankingData={rankingList} />
        </div>
        <div ref={headerRef} className="sticky w-full top-0"></div>

        <div
          className={`w-full sticky top-0 ${
            showHeader ? "ccbg2 z-50 pb-5" : ""
          }`}
        >
          {showHeader ? (
            <div className="pt-5 z-50">
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
                    onClick={() => setSelectedType(tag)}
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
                className={`text-[12px] ${
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
          {rankingList?.slice(3)?.length ? (
            rankingList?.slice(3)?.map((item: any, index: any) => (
              <div className="flex items-center gap-3" key={item?.id}>
                <p className="text-[16px] font-semibold w-8">{item?.rank}</p>
                <RankingCard data={item} />
              </div>
            ))
          ) : (
            <div className="w-full flex justify-center items-center mt-[100px]">
              <div className="flex flex-col justify-center items-center gap-3">
                <UsersRound className="text-[#888888]" />
                <p className="text-[12px] text-[#888888]">当前没有创作者展示</p>
              </div>
            </div>
          )}
        </div>
        <InfinitLoad
          data={rankingList}
          fetchData={fetchMoreData}
          hasMore={hasMore}
        />
        <MyRankCard myrank={data?.data?.my_rank} />
      </div>
      <div className="py-20"></div>
    </div>
  );
};

export default Ranking;
