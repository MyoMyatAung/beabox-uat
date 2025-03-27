import TopRankCard from "../create-center/top-rank-card";

const Top3 = ({ rankingData }: any) => {
  const top3 = rankingData?.slice(0, 3);

  return (
    <div>
      {/* <TopRankCard /> */}
      {top3?.length ? (
        <div className="flex justify-center items-center gap-2 px-1.5">
          <div className="flex-1 pt-10">
            <TopRankCard rank={2} data={top3[1]} />
          </div>
          <div className="flex-1 ">
            <TopRankCard rank={1} data={top3[0]} />
          </div>
          <div className="flex-1 pt-10">
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
