import TopRankCard from "../create-center/top-rank-card";

const Top3 = ({ rankingData, refetch }: any) => {
  const top3 = rankingData?.slice(0, 3);

  // console.log(top3);

  return (
    <div>
      {/* <TopRankCard /> */}
      {top3?.length ? (
        <div className="flex justify-center items-center gap-3 px-3">
          <div className="flex-1 pt-10">
            <TopRankCard
              rank={2}
              refetch={refetch}
              data={top3?.length ? top3[1] : ""}
            />
          </div>
          <div className="flex-1 ">
            <TopRankCard
              rank={1}
              refetch={refetch}
              data={top3?.length ? top3[0] : ""}
            />
          </div>
          <div className="flex-1 pt-10">
            <TopRankCard
              rank={3}
              refetch={refetch}
              data={top3?.length ? top3[2] : ""}
            />
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center gap-3 px-3">
          <div className="flex-1 pt-10">
            <TopRankCard
              rank={2}
              refetch={refetch}
              data={top3?.length ? top3[1] : ""}
            />
          </div>
          <div className="flex-1 ">
            <TopRankCard
              rank={1}
              refetch={refetch}
              data={top3?.length ? top3[0] : ""}
            />
          </div>
          <div className="flex-1 pt-10">
            <TopRankCard
              rank={3}
              refetch={refetch}
              data={top3?.length ? top3[2] : ""}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Top3;
