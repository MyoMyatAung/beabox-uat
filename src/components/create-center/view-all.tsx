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
import viewall from "@/assets/createcenter/viewall.png";
const ViewAll = () => {
  const navigate = useNavigate();

  return (
    <img
      src={viewall}
      className="w-full h-auto"
      alt=""
      onClick={() => navigate(paths.ranking)}
    />
    // <div
    //   onClick={() => navigate(paths.ranking)}
    //   className="vabg relative w-full h-[221px] flex justify-between items-center flex-col rounded-[20px]"
    // >
    //   <div className="absolute w-full h-[221px] rounded-[20px] top-0 left-0 bg-[#000000A3] z-10"></div>
    //   <div className="flex justify-between items-start w-full p-5">
    //     <div className="w-full px-2 z-50">
    //       <p className="text-[24px] font-extrabold leading-6 z-50">
    //         创作者 <br />
    //         <span className="bg-gradient-to-r bg-clip-text text-transparent from-[#FFB2E0] to-[#CD3EFF]">
    //           排名
    //         </span>
    //       </p>
    //     </div>
    //     <div className="w-full py-1 px-2">
    //       <button className="text-[14px] text-white z-20 flex items-center gap-1 ml-auto">
    //         <span className="text-white z-50">查看全部</span>
    //         <ChevronRight size={14} className="text-white z-50" />
    //       </button>
    //     </div>
    //   </div>
    //   <div className="w-full px-2 z-50 absolute -bottom-5 pb-10">
    //     <img src={topgp} className="object-contain w-[240px] mx-auto" alt="" />
    //     <p className="text-[#FFFFFF99] text-center text-[14px] z-50 pt-3">
    //       创作者成为闪亮之星，从创作者开始。
    //     </p>
    //   </div>
    // </div>
  );
};

export default ViewAll;
