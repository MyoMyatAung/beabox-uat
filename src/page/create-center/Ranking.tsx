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

const ranges = [
  { value: "today", title: "今日" },
  { value: "this_week", title: "本周" },
  { value: "this_month", title: "本月" },
  { value: "this_year", title: "今年" },
];

const Ranking = () => {
  const user = useSelector((state: any) => state?.persist?.user);
  const [showHeader, setShowHeader] = useState(false);
  const headerRef = useRef(null);

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

  if (loading1 && isLoading) return <Loader />;

  return (
    <div className="">
      <div className="ccbg fixed top-0 left-0 "></div>
      <div className="relative z-50">
        <div className="pt-5 z-50">
          <h1 className="text-[18px] text-center">排行榜</h1>
        </div>
        <div className="py-5">
          <Top3 rankingData={data?.data?.list} />
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
          {data?.data?.list?.slice(3)?.length ? (
            data?.data?.list?.slice(3)?.map((item: any, index: any) => (
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
        {user?.token ? <MyRankCard myrank={data?.data?.my_rank} /> : <></>}
      </div>
      <div className="py-20"></div>
    </div>
  );
};

export default Ranking;
