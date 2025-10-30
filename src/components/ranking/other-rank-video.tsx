import { RankingCardVideo } from "../create-center/ranking-card";
import { useSelector } from "react-redux";

const OtherRankVideo = ({ data, refetch, onVideoClick }: any) => {
  const list = data?.slice(3);

  return (
    <>
      {list?.map((item: any) => (
        <div className="flex items-center gap-3" key={item?.id}>
          <p className="text-[16px] font-semibold w-8">{item?.rank}</p>
          <RankingCardVideo
            data={item}
            refetch={refetch}
            onVideoClick={onVideoClick}
          />
        </div>
      ))}
    </>
  );
};

export default OtherRankVideo;
