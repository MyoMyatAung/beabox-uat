import RankingCard from "@/components/create-center/ranking-card";
import TopNav from "@/components/create-center/top-nav";
import TopRankCard from "@/components/create-center/top-rank-card";
import {
  useGetTopCreatorQuery,
  useGetConfigQuery,
} from "@/store/api/createCenterApi";
import topcreator from "@/assets/createcenter/topcreator.png";
import topcrown from "@/assets/createcenter/topcrown.png";
import Loader from "@/components/shared/loader";
import { useEffect, useRef, useState } from "react";
import InfinitLoad from "@/components/shared/infinit-load";
import MyRank from "@/components/create-center/my-rank";
import { useSelector } from "react-redux";
import loader from "@/page/home/vod_loader.gif";

const Ranking = () => {
  const [keyword, setKeyword] = useState("");
  const [showHeader, setShowHeader] = useState(false);
  const headerRef = useRef<any>(null);
  const me = useSelector((state: any) => state?.persist?.user?.id);

  const [isload, setIsload] = useState(false);
  const [page, setPage] = useState(1);
  const [rankingData, setRankingData] = useState<any>([]);
  const [hasMore, setHasMore] = useState(true);
  const [totalData, setTotalData] = useState<number>(0);
  const { data, isLoading, refetch, isFetching } = useGetTopCreatorQuery({
    tag: keyword,
    page,
  });
  const { data: newData } = useGetConfigQuery({});
  const tags = newData?.data?.creator_center_ranking_filter;
  console.log(tags);
  let top3 = rankingData?.slice(0, 3);
  let otherrank = rankingData?.slice(3);
  let myrank = rankingData?.find((item: any) => item?.id == me);
  console.log(myrank);
  useEffect(() => {
    if (tags) setKeyword(tags[0]?.keyword);
  }, [newData, tags]);

  useEffect(() => {
    setPage(1), setRankingData([]);
    setHasMore(true);
    setTotalData(0);
    refetch();
    setIsload(false);
  }, [refetch, keyword]);

  useEffect(() => {
    if (data?.data?.list?.length) {
      // console.log(data?.data?.list, "top creator data");

      // Append new data to the existing videos
      setRankingData((prev: any) => [...prev, ...data?.data?.list]);
      setTotalData(data?.pagination?.total);
    }
  }, [data]);

  useEffect(() => {
    if (totalData <= rankingData?.length) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  }, [totalData, rankingData]);

  const fetchMoreData = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        // console.log(rect);

        if (rect.top <= 100) {
          setShowHeader(true);
        } else {
          setShowHeader(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll); // Clean up on unmount
    };
  }, []);
  if (isLoading && page == 1) return <Loader />;

  return (
    <div className="relative">
      {isFetching ? (
        <div className="fixed top-0 left-0 w-full h-screen bg-[#000000CC] flex justify-center items-center z-[3000]">
          <img src={loader} alt="" className="w-20" />
        </div>
      ) : (
        <></>
      )}
      {showHeader ? (
        <div className="sticky top-0 w-full z-[9999] bg-[#16131C] pb-5">
          <TopNav center="热门创作者" />
          <div className="px-5 pt-3 w-full flex items-center gap-2 overflow-x-scroll whitespace-nowrap">
            {tags?.map((tag: any) => (
              <button
                className={`${
                  keyword == tag?.keyword ? "bg-[#FFFFFF14]" : ""
                } px-2 py-1 rounded-full text-[14px]`}
                onClick={() => {
                  setIsload(true);

                  setKeyword(tag?.keyword);
                }}
                key={tag?.title}
              >
                {tag?.title}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}

      <div className="bg-[#16131C] pb-2">
        <div className="">
          <div className="relative w-full h-[176px] rankbg">
            <div className="absolute top-0 left-0 w-full z-50">
              <TopNav />
            </div>
            <div className="w-full h-full flex justify-between items-center px-5">
              <div className="px-5"></div>
              <div className="relative">
                <img src={topcreator} className="w-[158px]" alt="" />
                {/* <p className="text-[15px] font-light">September, 2024</p> */}
                {/* <img
                    src={topcrown}
                    className="w-[30px] absolute -top-8 left-4"
                    alt=""
                  /> */}
              </div>
            </div>
            <div className="rankbg-gradient absolute top-0 left-0"></div>
            <div className="absolute -bottom-28 w-full flex justify-center">
              {top3?.length ? (
                <div className="flex w-full justify-center gap-3">
                  <div className="pt-5">
                    <TopRankCard rank={2} data={top3[1]} />
                  </div>
                  <TopRankCard rank={1} data={top3[0]} />
                  <div className="pt-5">
                    <TopRankCard rank={3} data={top3[2]} />
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        <div className="py-[60px]"></div>
        <div ref={headerRef} className="sticky z-[1500] top-0"></div>
        <div className="px-5 pt-3 w-full flex items-center gap-2 overflow-x-scroll whitespace-nowrap">
          {tags?.map((tag: any) => (
            <button
              className={`${
                keyword == tag?.keyword ? "bg-[#FFFFFF14]" : ""
              } px-2 py-1 rounded-full text-[14px]`}
              onClick={() => {
                setIsload(true);

                setKeyword(tag?.keyword);
              }}
              key={tag?.title}
            >
              {tag?.title}
            </button>
          ))}
        </div>
      </div>
      <div className="px-5 py-5 space-y-4">
        {otherrank?.map((item: any, index: any) => (
          <div className="flex items-center gap-3" key={item?.id}>
            <p className="text-[16px] font-semibold w-8">{index + 4}</p>
            <RankingCard data={item} />
          </div>
        ))}
      </div>
      <InfinitLoad
        data={rankingData}
        fetchData={fetchMoreData}
        hasMore={hasMore}
      />
      <div className="fixed bottom-0 left-0 w-full">
        <MyRank data={myrank} rankno={data?.data?.my_rank} />
      </div>
    </div>
  );
};

export default Ranking;
