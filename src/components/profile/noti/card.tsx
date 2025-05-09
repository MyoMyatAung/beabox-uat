import Balance from "@/assets/profile/balance1.png";
import System from "@/assets/profile/system.png";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

const Card = ({ type, item }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-[#1E1C28] p-3 rounded-[12px]">
      <div className="flex gap-2 items-center">
        <img
          src={type ? System : Balance}
          className="w-10 h-10 rounded-full"
          alt=""
        />
        <p className="text-[14px]">{item?.title}</p>
        {item?.is_read ? (
          <></>
        ) : (
          <div className="w-2 h-2 rounded-full bg-[#FF0004]"></div>
        )}
      </div>
      <div className="mt-3">
        <p
          className={`text-[14px] text-[#888] leading-4 ${
            !isExpanded && "line-clamp-2"
          }`}
        >
          {item?.message}
        </p>
        {/* <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[10px] text-[#888]"
        >
          {isExpanded ? "Hide" : "See more"}
        </button> */}
      </div>
      <div className="w-full h-[1px] bg-[#444] my-3"></div>
      <div className="flex items-center justify-between">
        <p className="text-[14px]">进入首页</p>
        <ChevronRight size={14} />
      </div>
    </div>
  );
};

export default Card;
