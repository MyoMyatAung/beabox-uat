import TopRankCard from "../create-center/top-rank-card";

const Top3 = ({ rankingData }: any) => {
  const top3 = rankingData?.slice(0, 3);

  return (
    <div>
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
  );
};

export default Top3;
