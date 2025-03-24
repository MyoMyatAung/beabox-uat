import RankingCard from "../create-center/ranking-card";

const OtherRank = ({ rankingData }: any) => {
  const otherrank = rankingData?.slice(3);

  return (
    <div className="px-5 py-5 space-y-4">
      {otherrank?.map((item: any, index: any) => (
        <div className="flex items-center gap-3" key={item?.id}>
          <p className="text-[16px] font-semibold w-8">{index + 4}</p>
          <RankingCard data={item} />
        </div>
      ))}
    </div>
  );
};

export default OtherRank;
