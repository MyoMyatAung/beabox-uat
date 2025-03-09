import RankingCard from "@/components/create-center/ranking-card";
import TopNav from "@/components/create-center/top-nav";
import TopRankCard from "@/components/create-center/top-rank-card";
import { useGetTopCreatorQuery } from "@/store/api/createCenterApi";
import topcreator from "@/assets/createcenter/topcreator.png";

const Ranking = () => {
  const { data } = useGetTopCreatorQuery("");
  console.log(data?.data);
  let top3 = data?.data?.slice(0, 3);
  let otherrank = data?.data?.slice(3);
  return (
    <>
      <div className="">
        <div className="relative w-full h-[176px] rankbg">
          <div className="absolute top-0 left-0 w-full z-50">
            <TopNav />
          </div>
          <div className="w-full h-full flex justify-between items-center px-5">
            <div className="px-5"></div>
            <div className="">
              <img src={topcreator} className="w-[158px]" alt="" />
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
      <div className="px-5 py-5 space-y-4">
        {otherrank?.map((item: any, index: any) => (
          <div className="flex items-center gap-3" key={item?.id}>
            <p className="text-[16px] font-semibold w-8">{index + 4}</p>
            <RankingCard data={item} />
          </div>
        ))}
      </div>
    </>
  );
};

export default Ranking;
