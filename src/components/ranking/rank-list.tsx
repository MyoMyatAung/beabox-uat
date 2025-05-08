import { useGetTopListQuery } from "@/store/api/createCenterApi";
import RankingCard from "../create-center/ranking-card";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { paths } from "@/routes/paths";
import r1 from "@/assets/createcenter/r1.png";
import r2 from "@/assets/createcenter/r2.png";
import r3 from "@/assets/createcenter/r3.png";

const RankList = () => {
  const { data } = useGetTopListQuery("");
  console.log(data);
  return (
    <div className="bg-[#24222C] p-5 rounded-[20px]">
      <div className="flex items-center justify-between pb-5">
        <p className="text-[16px]">顶级创作者</p>
        <Link
          to={paths.ranking}
          className="flex items-center justify-center gap-1 bg-[#FFFFFF1F] rounded-full px-2 py-1"
        >
          <span className="text-[12px]">查看更多</span>
          <ChevronRight size={10} />
        </Link>
      </div>
      {data?.data?.map((item: any) => (
        <div className="flex items-center gap-3" key={item?.id}>
          {(item?.rank == 1 && <img src={r1} className="w-[25px]" />) ||
            (item?.rank == 2 && <img src={r2} className="w-[25px]" />) ||
            (item?.rank == 3 && <img src={r3} className="w-[25px]" />) || (
              <p className="text-[16px] font-semibold w-[25px] text-center">{item?.rank}</p>
            )}

          <RankingCard data={item} />
        </div>
      ))}
    </div>
  );
};

export default RankList;
