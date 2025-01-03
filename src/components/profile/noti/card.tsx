import Balance from "@/assets/profile/balance.png";
import System from "@/assets/profile/system.png";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

const Card = ({ type }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-[#1E1C28] p-3 rounded-[12px]">
      <div className="flex gap-2 items-center">
        <img
          src={type ? System : Balance}
          className="w-10 h-10 rounded-full"
          alt=""
        />
        <p className="text-[14px]">🎄 Holiday Cheer is Here! 🎅</p>
      </div>
      <div className="mt-3">
        <p
          className={`text-[10px] text-[#888] leading-4 ${
            !isExpanded && "line-clamp-2"
          }`}
        >
          ✨It's the most wonderful time of the year! 🎉 Join us this Christmas
          season for exciting events, exclusive offers, and festive surprises.
          🎄 Let's make this holiday unforgettable with joy, laughter, and love.
          Stay tuned for more updates and spread the holiday cheer! 🌟" Merry
          Christmas and Happy Holidays! 🎅
        </p>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[10px] text-[#888]"
        >
          {isExpanded ? "Hide" : "See more"}
        </button>
      </div>
      <div className="w-full h-[1px] bg-[#444] my-3"></div>
      <div className="flex items-center justify-between">
        <p className="text-[14px]">View More</p>
        <ChevronRight size={14} />
      </div>
    </div>
  );
};

export default Card;
