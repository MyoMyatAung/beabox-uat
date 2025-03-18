import viewyellow from "@/assets/createcenter/viewyellow.png";
import { paths } from "@/routes/paths";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  useGetConfigQuery,
  useGetTopCreatorQuery,
} from "@/store/api/createCenterApi";
import TopRankCard2 from "./top-rank-card2";
import topgp from "@/assets/createcenter/topgp.png";

const ViewAll = () => {
  const navigate = useNavigate();
  // const [keyword, setKeyword] = useState("");
  // const [isload, setIsload] = useState(false);
  // const { data, isLoading, refetch } = useGetTopCreatorQuery(keyword);
  // const { data: newData } = useGetConfigQuery({});
  // const tags = newData?.data?.creator_center_ranking_filter;
  // console.log(tags);
  // let top3 = data?.data?.slice(0, 3);
  // let otherrank = data?.data?.slice(3);

  // useEffect(() => {
  //   if (tags) setKeyword(tags[0]?.keyword);
  // }, [newData, tags]);

  // useEffect(() => {
  //   refetch();
  //   setIsload(false);
  // }, [refetch, keyword]);

  return (
    <div
      onClick={() => navigate(paths.ranking)}
      className="vabg relative w-full h-[246px] flex justify-between items-center flex-col rounded-[20px]"
    >
      <div className="absolute w-full h-[246px] rounded-[20px] top-0 left-0 bg-[#000000A3] z-10"></div>
      <div className="w-full py-1 px-2">
        <button className="text-[12px] text-white z-20 flex items-center gap-1 ml-auto">
          <span className="text-white z-50">查看全部</span>
          <ChevronRight size={14} className="text-white z-50" />
        </button>
      </div>
      <div className="w-full px-2 z-50">
        <p className="text-[24px] font-extrabold leading-6 z-50">
          Creator <br />
          <span className="bg-gradient-to-r bg-clip-text text-transparent from-[#FFB2E0] to-[#CD3EFF]">
            Ranking
          </span>
        </p>
      </div>
      <div className="w-full px-2 z-50">
        <img src={topgp} className="object-contain" alt="" />
      </div>
      <div className="w-full px-2 z-50 mx-auto pb-2">
        <p className="text-[#FFFFFF99] text-[12px] z-50">
          Creator becomes shining stars , start as an creator.
        </p>
      </div>
    </div>
    // <div onClick={() => navigate(paths.ranking)} className="px-5">
    //   <img src={viewyellow} className="h-[152px] w-full" alt="" />
    //   <div className="bg-[#6A320033] flex items-center justify-between py-3 px-3 rounded-b-[20px]">
    //     <p className="text-[14px] text-[#FFC56B]">
    //       Start Earning as an creator
    //     </p>
    //     <button className="text-[14px] flex items-center gap-1 bg-[#FFFFFF1F] px-2 py-1 rounded-full">
    //       <span>View All</span>
    //       <ChevronRight size={14} />
    //     </button>
    //   </div>
    // </div>
  );
};

export default ViewAll;
