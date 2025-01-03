import React, { useEffect, useState } from "react";
// import sp from "../../../assets/explore/sp.png";
import { FaHeart } from "react-icons/fa";
import { useGetExploreListQuery } from "@/store/api/explore/exploreApi";
// import Player from "./Player";
import InfiniteScroll from "react-infinite-scroll-component";
import { Person } from "@/assets/profile";
import Loader from "../../../page/home/vod_loader.gif";

const Latest: React.FC = () => {
  const [waterfall, setWaterFall] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetExploreListQuery({ id: 3, page });

  useEffect(() => {
    if (data?.data) {
      setWaterFall((prev) => [...prev, ...data.data]);
  
      const loadedItems = data.pagination.current_page * data.pagination.per_page;
      setHasMore(loadedItems < data.pagination.total);
    } else {
      setHasMore(false);
    }
  }, [data]);
  

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}k`;
    }
    return num;
  };

  const fetchMoreData = () => {
      console.log("gg")
      setPage((prevPage) => prevPage + 1);
  };
console.log(page)
  return (
    <div className=" flex w-full justify-around items-cente">
      <div
        className="columns-2 gap-1 relative"
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
                className="rounded-lg shadow-lg h-fit mb-4 w-[172px] relative bg-whit"
                style={{ breakInside: "avoid" }}
              >
                <img
                  className="w-full object-cover rounded-[6px] bg-white/20"
                  src={card.preview_image}
                  alt=""
                  style={{
                    height: index % 2 === 0 ? "216px" : "272px",
                  }}
                />
                <div className="text-white text-[12px] font-[400] leading-[20px]">
                  {card.title.length > 50
                    ? `${card.title.slice(0, 50)}...`
                    : card.title}
                </div>
                <div className=" z-[999] pt-[6px]  w-full bottom-[30px] text-white text-[14px] font-[400] leading-[30px] flex justify-between items-center ">
                  <div className=" flex justify-center items-center gap-[4px]">
                    {card.user?.avatar ? (
                      <img
                        className=" w-[26px] h-[26px] rounded-full"
                        src={card.user.avatar}
                        alt=""
                      />
                    ) : (
                      <div className="w-[15px] h-[15px] rounded-full bg-[#FFFFFF12] flex justify-center items-center">
                        <Person />
                      </div>
                    )}
                    <h1 className=" text-white text-[12px] font-[500]">
                      {card.user.name}
                    </h1>
                  </div>
                  <span className="flex gap-[5px] items-center">
                    <FaHeart />
                    {formatNumber(card?.like_count)}
                  </span>
                </div>
              </div>
            ))}
            <InfiniteScroll
              className="py-[20px]"
              dataLength={waterfall.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={
                <div className=" flex justify-center w-screen absolute bottom-[-30px] left-[-20px]">
                  <div className="">
                    <img
                      src={Loader}
                      className="w-[100px] h-[100px]"
                      alt="Loading"
                    />
                  </div>
                </div>
              }
              endMessage={
                <div className="flex bg-whit justify-center items-center  w-screen absolute bottom-[-30px] left-[-20px]">
                  <p className="py-10" style={{ textAlign: "center" }}>
                    <b>No more yet!</b>
                  </p>
                </div>
              }
            >
              <></>
            </InfiniteScroll>
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
    </div>
  );
};

export default Latest;
