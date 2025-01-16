import React, { useEffect, useRef, useState } from "react";
// import sp from "../../../assets/explore/sp.png";
import { FaHeart } from "react-icons/fa";
import { useGetExploreListQuery } from "@/store/api/explore/exploreApi";
import InfiniteScroll from "react-infinite-scroll-component";
import { Person } from "@/assets/profile";
import Loader from "../../../page/home/vod_loader.gif";
import { useDispatch, useSelector } from "react-redux";
import { setDetails } from "@/store/slices/exploreSlice";
import { replace, useNavigate, useSearchParams } from "react-router-dom";
import { paths } from "@/routes/paths";

interface LatestPorp {

}

const Latest: React.FC<LatestPorp> = ({}) => {
  // const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const [waterfall, setWaterFall] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetExploreListQuery({ id: 3, page });
  const navigate = useNavigate();
  const scrollPositionRef = useRef<number>(0);
  const contentRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = scrollPositionRef.current;
    }
  }, []);


  useEffect(() => {
    if (data?.data) {
      setWaterFall((prev) => [...prev, ...data.data]);

      const loadedItems =
        data.pagination.current_page * data.pagination.per_page;
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
    setPage((prevPage) => prevPage + 1);
  };

  const showDetailsVod = (file: any) => {
    scrollPositionRef.current = contentRef.current?.scrollTop || 0; 
    dispatch(setDetails(file));
    navigate("/vod_details",{replace : true});
  };
  return (
    <div className=" flex w-full justify-center">
      <div
        className="columns-2 gap-1 relative "
        ref={contentRef}
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
                key={index}
                className="rounded-lg shadow-lg h-fit mb-4 w-[172px] relative"
                style={{ breakInside: "avoid" }}
              >
                <img
                  onClick={() => showDetailsVod(card)}
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
                <div className="flex bg-whit pt-20 justify-center items-center  w-screen absolute bottom-[-20px] left-[-20px]">
                  <p className="py-10" style={{ textAlign: "center" }}>
                    {/* <b>No more yet!</b> */}
                  </p>
                </div>
              }
            >
              <></>
            </InfiniteScroll>
          </>
        )}
      </div>
    </div>
  );
};

export default Latest;
