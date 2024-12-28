import React, { useEffect, useState } from "react";
import sp from "../../../assets/explore/sp.png";
import { FaHeart } from "react-icons/fa";
import { useGetExploreListQuery } from "@/store/api/explore/exploreApi";
import Player from "./Player";

const Latest: React.FC = () => {
  const { data, isLoading } = useGetExploreListQuery({ id: 3 });
  const [waterfall, setWaterFall] = useState<any>();

  useEffect(() => {
    if (data?.data) {
      setWaterFall(data.data);
    }
  }, [data]);
  console.log(waterfall);

  return (
    <>
      <div
        className="columns-2 gap-2 px-[10px]"
        style={{
          columnGap: "20px",
        }}
      >
        {isLoading ? (
          <>
            <div className="rounded-lg shadow-lg bg-white/20 animate-pulse mb-4 w-[172px] h-[220px]"></div>
            <div className="rounded-lg shadow-lg bg-white/20 animate-pulse mb-4 w-[172px] h-[220px]"></div>
            <div className="rounded-lg shadow-lg bg-white/20 animate-pulse mb-4 w-[172px] h-[220px]"></div>
            <div className="rounded-lg shadow-lg bg-white/20 animate-pulse mb-4 w-[172px] h-[220px]"></div>
          </>
        ) : (
          <>
            {waterfall?.map((card: any, index: number) => (
              <div
                key={card.id}
                className="rounded-lg shadow-lg h-fit mb-4 w-[172px] relative"
                style={{ breakInside: "avoid" }}
              >
                <img
                  className="w-full object-cover rounded-[6px] bg-white/20"
                  src={card.preview_image}
                  alt=""
                  style={{
                    height: index % 2 === 0 ? "220px" : "272px",
                  }}
                />
                <div className="absolute z-[999]  w-[172px] bottom-[30px] text-white text-[14px] font-[400] leading-[30px] flex justify-between px-[10px] mb-2 -ml-1">
                  <span className="flex gap-[5px] items-center">
                    <FaHeart />
                    {card?.like_count}
                  </span>
                  <span>00:54</span>
                </div>
                <div className="text-white text-[15px] font-[400] leading-[30px]">
                  {card.title.length > 20
                    ? `${card.title.slice(0, 18)}...`
                    : card.title}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      {/* {waterfall?.map((wt: any) => (
        <Player
          src={wt?.files[0].resourceURL}
          thumbnail={
            wt?.files[0].thumbnail ||
            "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg"
          }
        />
      ))} */}
    </>
  );
};

export default Latest;
