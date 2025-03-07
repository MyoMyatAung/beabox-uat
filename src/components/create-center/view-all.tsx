import viewyellow from "@/assets/createcenter/viewyellow.png";
import { ChevronRight } from "lucide-react";

const ViewAll = () => {
  return (
    <div className="px-5">
      <img
        src={viewyellow}
        className="h-[152px] w-full"
        alt=""
      />
      <div className="bg-[#6A320033] flex items-center justify-between py-3 px-3 rounded-b-[20px]">
        <p className="text-[14px] text-[#FFC56B]">
          Start Earning as an creator
        </p>
        <button className="text-[14px] flex items-center gap-1 bg-[#FFFFFF1F] px-2 py-1 rounded-full">
          <span>View All</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default ViewAll;
