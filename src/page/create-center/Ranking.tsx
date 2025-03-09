import RankingCard from "@/components/create-center/ranking-card";
import TopNav from "@/components/create-center/top-nav";
import TopRankCard from "@/components/create-center/top-rank-card";
import { useGetTopCreatorQuery } from "@/store/api/createCenterApi";

const Ranking = () => {
  const { data } = useGetTopCreatorQuery("");
  console.log(data?.data);
  let top3 = data?.data?.slice(0, 3);
  let otherrank = data?.data?.slice(3);
  return (
    <>
      <TopNav />
      <div className="px-5 py-5 space-y-4">
        <div className="flex w-full gap-3">
          {top3?.map((item: any, index: any) => (
            <TopRankCard rank={index + 1} data={item} />
          ))}
        </div>
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
