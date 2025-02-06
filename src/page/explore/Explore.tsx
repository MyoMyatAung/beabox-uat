import React, { useEffect, useRef, useState } from "react";
import Header from "./comp/Header";
import "./explore.css";
import Banner from "./comp/Banner";
import PopApp from "./comp/PopApp";
import Recommand from "./comp/Recommand";
import Latest from "./comp/Latest";
import { Swiper } from "swiper/react";
import '../home/home.css'
import "swiper/css";
import { SwiperSlide } from "swiper/react";
import { useGetExploreHeaderQuery } from "@/store/api/explore/exploreApi";
import VodDetails from "./comp/VodDetails";
import { useLocation, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setExpHeader } from "@/store/slices/exploreSlice";

const Explore = () => {
  const [activeTab, setActiveTab] = useState("Recommend");
  const { exp_header } = useSelector((state: any) => state.explore);
  // console.log(exp_header);
  const [searchParams, setSearchParams] = useSearchParams();
  const [tabs, setTabs] = useState<any[]>([]);
  const [dyId, setDyId] = useState<any>("");
  const { data, isLoading } = useGetExploreHeaderQuery("");
  const swiperRef = useRef<any>(null);
  const [show, setshow] = useState<boolean>(false);
  const dispatch = useDispatch();

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
  // console.log(data?.data?.tabs);

  return (
    <>
      {/* {show && <VodDetails  />} */}

      <div className="flex max-w-[1024px] home-main w-full bg-[#16131C] justify-center items-center min-h-screen overflow-clip">
        <div className="explore_sec w-screen xl:w-[800px] flex flex-col justify-center items-cente px-[10px] pb-[100px] mt-14">
          <Banner />
          <PopApp />
          <div className="mt-[20px] relative">
            <Header activeTab={activeTab} setActiveTab={setActiveTab} />
            {isLoading ? (
              <div className=" min-h-screen bg-white/20 rounded-md animate-pulse p-2">
                {" "}
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
                  <SwiperSlide className=" w-full" key={index}>
                    {exp_header === gg.name && (
                      <div className=" min-h-screen text-white">
                        {gg.type === "topic" ? (
                          <Recommand list_id={gg.id} title="Chinese Drama" />
                        ) : (
                          <Latest list_id={gg.id} />
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
