import React, { useEffect, useRef, useState } from "react";
import Header from "./comp/Header";
import "./explore.css";
import Banner from "./comp/Banner";
import PopApp from "./comp/PopApp";
import Recommand from "./comp/Recommand";
import Latest from "./comp/Latest";
import { Swiper } from "swiper/react";
import "../home/home.css";
import "swiper/css";
import { SwiperSlide } from "swiper/react";
import { useGetExploreHeaderQuery } from "@/store/api/explore/exploreApi";
import VodDetails from "./comp/VodDetails";
import { useLocation, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setExpHeader } from "@/store/slices/exploreSlice";
import VideoFeed from "../home/components/VideoFeed";

const Explore = () => {
  const [activeTab, setActiveTab] = useState("Recommend");
  const [page, setPage] = useState(1);

  const [list, setList] = useState<any[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [showVideoFeed, setShowVideoFeed] = useState(false);
  const [showVideoFeedTopic, setShowVideoFeedTopic] = useState(false);

  const { exp_header } = useSelector((state: any) => state.explore);
  // console.log(exp_header);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedList, setSelectedList] = useState<any[]>([]);
  const [tabs, setTabs] = useState<any[]>([]);
  const [dyId, setDyId] = useState<any>("");
  const { data, isLoading } = useGetExploreHeaderQuery("");
  const swiperRef = useRef<any>(null);
  const [show, setshow] = useState<boolean>(false);
  const dispatch = useDispatch();
  const scroll = window.scrollY;
  // console.log(scroll);

  useEffect(() => {
    if (data?.data?.tabs) {
      const tt = data?.data?.tabs?.map((t: any) => t.name);
      // const ii = data?.data?.tabs.map((t: any) => t.id);
      // console.log(tt[0]);
      setTabs(tt);
      // console.log(tt)
      if (tabs.length > 0) {
        if (tt) {
          dispatch(setExpHeader(tt[0]));
        }
      }
      if (!exp_header) {
        if (tt) {
          dispatch(setExpHeader(tt[0]));
        }
      }
      // setDyId([...ii, dyId]);
    }
  }, [data?.data, exp_header]);
  // console.log(exp_header)

  useEffect(() => {
    if (scroll >= 500) {
      window.scrollTo(0, 500);
    }

    // window.scrollTo({ top: 0, behavior: "smooth" });
  }, [exp_header]);

  // useEffect(() => {
  //   window.scrollTo(0, 5);
  // }, []);

  // useEffect(() => {
  //   setList([]); // Reset list when switching tabs
  // }, [exp_header,tabs]);

  useEffect(() => {
    if (swiperRef.current) {
      const index = tabs?.indexOf(exp_header);
      if (index >= 0) {
        swiperRef.current.slideTo(index);
      }
    }
  }, [exp_header, tabs]);

  const handleSlideChange = (swiper: any) => {
    const newActiveTab = tabs[swiper.activeIndex] || exp_header; // Fallback to current activeTab
    // setActiveTab(newActiveTab);
    dispatch(setExpHeader(newActiveTab));
    // setSearchParams({ query: tabToQuery(newActiveTab) }); // Convert tab to query value
  };
  // console.log(selectedMovieId, selectedList, showVideoFeedTopic);
  // console.log(list)
  return (
    <>
      {showVideoFeed && selectedMovieId && (
        <div className="z-[999999] h-screen fixed top-0 overflow-y-scroll left-0 w-full">
          <VideoFeed
            search={false}
            setPage={setPage}
            setVideos={setList}
            videos={list}
            currentActiveId={selectedMovieId}
            setShowVideoFeed={setShowVideoFeed}
            query={"搜索影片"}
          />
        </div>
      )}

      {showVideoFeedTopic && selectedMovieId && (
        <div className="z-[999999] h-screen fixed top-0 overflow-y-scroll left-0 w-full">
          <VideoFeed
            search={false}
            setPage={setPage}
            setVideos={setSelectedList}
            videos={selectedList}
            currentActiveId={selectedMovieId}
            setShowVideoFeed={setShowVideoFeedTopic}
            query={"搜索影片"}
          />
        </div>
      )}

      <div className="flex max-w-[1024px home-main bg-[#16131C] justify-center items-center min-h-screen overflow-clip">
        <div className="explore_sec w-full flex flex-col justify-center items-cente px-[10px pb-[100px] mt-14">
          <Banner />
          <PopApp />
          <div className="mt-[20px] relative">
            <Header activeTab={activeTab} setActiveTab={setActiveTab} />
            {isLoading ? (
              <div className=" flex flex-col w-full">
                <div className="py-[12px]">
                  <div className=" w-full h-[20px] rounded-lg shadow-lg bg-white/20 animate-pulse mb-4"></div>
                </div>
                <div className=" w-full grid grid-cols-2 justify-center items-center  gap-[12px]">
                  <div className="rounded-lg shadow-lg bg-white/20 animate-pulse mb-4 max-w-full h-[312px]"></div>
                  <div className="rounded-lg shadow-lg bg-white/20 animate-pulse mb-4 max-w-full h-[312px]"></div>
                  <div className="rounded-lg shadow-lg bg-white/20 animate-pulse mb-4 max-w-full h-[312px]"></div>
                  <div className="rounded-lg shadow-lg bg-white/20 animate-pulse mb-4 max-w-full h-[312px]"></div>
                </div>
              </div>
            ) : (
              <Swiper
                className=""
                allowTouchMove={false}
                // allowSlideNext={false}
                onSlideChange={handleSlideChange}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                slidesPerView={1}
                spaceBetween={10}
                centeredSlides={true}
                // loop={true}
              >
                {data?.data?.tabs?.map((gg: any, index: any) => (
                  <SwiperSlide className=" w-full" key={gg.id}>
                    {exp_header === gg.name && (
                      <div className=" min-h-screen text-white">
                        {gg.type === "topic" ? (
                          <Recommand
                            selectedList={selectedList}
                            setSelectedList={setSelectedList}
                            list_id={gg.id}
                            title="Chinese Drama"
                            setShowVideoFeedTopic={setShowVideoFeedTopic}
                            setSelectedMovieId={setSelectedMovieId}
                          />
                        ) : (
                          <Latest
                            page={page}
                            setPage={setPage}
                            exp_header={exp_header}
                            setSelectedMovieId={setSelectedMovieId}
                            setShowVideoFeed={setShowVideoFeed}
                            list_id={gg.id}
                            waterfall={list}
                            setWaterFall={setList}
                          />
                        )}
                      </div>
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Explore;
