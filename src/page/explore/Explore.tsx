import React, { useEffect, useRef, useState } from "react";
import Header from "./comp/Header";
import "./explore.css";
import Banner from "./comp/Banner";
import PopApp from "./comp/PopApp";
import Recommand from "./comp/Recommand";
import Latest from "./comp/Latest";
import { Swiper } from "swiper/react";
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
      const tt = data?.data?.tabs.map((t: any) => t.name);
      // const ii = data?.data?.tabs.map((t: any) => t.id);
      // console.log(tt[0]);
      setTabs(tt);
      if (tabs.length > 0) {
        dispatch(setExpHeader(tt[0]));
      }
      if(!exp_header){
        dispatch(setExpHeader(tt[0]));
      }
      // setDyId([...ii, dyId]);
    }
  }, [data?.data?.tabs,exp_header]);

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

      <div className="flex justify-center items-center w-screen overflow-clip">
        <div className="explore_sec w-screen xl:w-[800px] flex flex-col justify-center items-cente px-[10px] pb-[100px] mt-14">
          <Banner />
          <PopApp />
          <div className="mt-[20px] relative">
            <Header activeTab={activeTab} setActiveTab={setActiveTab} />
            <Swiper
              className=""
              allowTouchMove={false}
              // allowSlideNext={false}
              onSlideChange={handleSlideChange}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              slidesPerView={1}
              spaceBetween={1}
              // loop={true}
            >
              {data?.data?.tabs.map((gg: any) => (
                <SwiperSlide>
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
          </div>
        </div>
      </div>
    </>
  );
};

export default Explore;
