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
import { useEffect, useState } from "react";

const Ranking = () => {
  const [keyword, setKeyword] = useState("");
  const [isload, setIsload] = useState(false);
  const { data, isLoading, refetch } = useGetTopCreatorQuery(keyword);
  const { data: newData } = useGetConfigQuery({});
  const tags = newData?.data?.creator_center_ranking_filter;
  console.log(tags);
  let top3 = data?.data?.slice(0, 3);
  let otherrank = data?.data?.slice(3);

  useEffect(() => {
    if (tags) setKeyword(tags[0]?.keyword);
  }, [newData, tags]);

  useEffect(() => {
    refetch();
    setIsload(false);
  }, [refetch, keyword]);

  console.log(isload);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="relative">
          <div className="sticky top-0 z-50 bg-[#16131C] pb-2">
            <div className="">
              <div className="relative w-full h-[176px] rankbg">
                <div className="absolute top-0 left-0 w-full z-50">
                  <TopNav />
                </div>
                <div className="w-full h-full flex justify-between items-center px-5">
                  <div className="px-5"></div>
                  <div className="relative">
                    <img src={topcreator} className="w-[158px]" alt="" />
                    <p className="text-[15px] font-light">September, 2024</p>
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
        </div>
      )}
    </>
  );
};

export default Ranking;
