import React from "react";
import "../wallet.css";
import { ChevronRight } from "lucide-react";
import transit from "../../../assets/wallet/ transit.png";

interface TransitProps {}

const Transit: React.FC<TransitProps> = ({}) => {
  const transition = [
    {
      id: 1,
      title: "Recharge Points",
      cost: 100000,
      time: "2023-10-8, 9: 00 : 00",
    },
    {
      id: 2,
      title: "Reacted to Mr Beast Video",
      cost: 1000,
      time: "2023-10-8, 9: 00 : 00",
    },
    {
      id: 1,
      title: "Recharge Points",
      cost: 10000000,
      time: "2023-10-8, 9: 00 : 00",
    },
    {
      id: 1,
      title: "Reacted to Khaby Lame Video",
      cost: 1000,
      time: "2023-10-8, 9: 00 : 00",
    },
  ];
  return (
    <div className=" py-[20px]">
      {/* header */}
      <div className="transit_header px-[20px] py-[10px] flex justify-between">
        <h1 className=" text-white text-[14px] font-[500] leading-normal">
          Transitions
        </h1>
        <div className=" flex transit_view_all pl-[10px] py-[2px] pr-[2px]">
          <span className=" capitalize">view all</span>
          <ChevronRight />
        </div>
      </div>
      <div className=" py-[12px] px-[16px]">
        {transition.map((ts) => (
          <div key={ts.id} className=" transit_list py-[20px] flex justify-between">
            <div className=" flex gap-[12px] items-center">
              <div className="bitcoin_border p-3">
                <img className=" w-[26px] h-[26px]" src={transit} alt="" />
              </div>
              <div className=" flex flex-col gap-[4px]">
                <span className=" text-white text-[14px] font-[500] leading-[20px]">
                  {ts.title}
                </span>
                <span className=" text-[#777] text-[12px] font-[400] leading-[20px]">
                  {ts.time}
                </span>
              </div>
            </div>
            <div className="">
            <span>{ts.cost < 9999 ? "-" : "+"} {ts.cost}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Transit;
