import React, { useEffect } from "react";
import sp from "../../../assets/explore/sp.png";
import { FaHeart } from "react-icons/fa";

const Latest: React.FC = () => {
  // Dummy data for demonstration
  const cards = [
    { id: 1, image: sp, title: "记录生活的美好瞬间" },
    { id: 2, image: sp, title: "记录生活的美好瞬间" },
    { id: 3, image: sp, title: "记录生活的美好瞬间" },
    { id: 4, image: sp, title: "记录生活的美好瞬间" },
    { id: 5, image: sp, title: "记录生活的美好瞬间" },
    { id: 6, image: sp, title: "记录生活的美好瞬间" },
    { id: 7, image: sp, title: "记录生活的美好瞬间" },
    { id: 7, image: sp, title: "记录生活的美好瞬间" },
  ];

  return (
    <div className="container grid grid-cols-2 justify-center content-center gap-[10px]">
      {cards.map((card, index) => (
        <div key={card.id} className={`rounded-lg  shadow-lg h-fit relative py-[10px]`}>
          <img
            className={` w-[172px] h-[272px] object-cover rounded-[6px] bg-gray-300
            //  ${index % 2 === 0 ? "h-[220px]" : "h-[272px]"}
            `}
            src={card.image}
            alt=""
          />
          <div className=" text-white text-[15px] font-[400] leading-[30px]">
            {card.title}
          </div>
          {/* counts */}
          <div className=" w-full absolute bottom-[30px] text-white text-[14px] font-[400] leading-[30px] flex justify-between px-[10px] mb-2 -ml-1">
            <span className=" flex gap-[5px] items-center">
              <FaHeart />
              819.1K
            </span>
            <span>00:54</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Latest;
