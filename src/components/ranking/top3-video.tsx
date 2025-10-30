import TopRankCardVideo from "../create-center/top-rank-card-video";

const Top3Video = ({ rankingData, refetch, onVideoClick }: any) => {
  const top3 = rankingData?.slice(0, 3);

  return (
    <div>
      <div className="flex justify-center items-center gap-3 px-3">
        <div className="flex-1 pt-10">
          <TopRankCardVideo rank={2} data={top3?.length ? top3[1] : ""} onVideoClick={onVideoClick} />
        </div>
        <div className="flex-1">
          <TopRankCardVideo rank={1} data={top3?.length ? top3[0] : ""} onVideoClick={onVideoClick} />
        </div>
        <div className="flex-1 pt-10">
          <TopRankCardVideo rank={3} data={top3?.length ? top3[2] : ""} onVideoClick={onVideoClick} />
        </div>
      </div>
    </div>
  );
};

export default Top3Video;
