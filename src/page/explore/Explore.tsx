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

const Explore = () => {
  const [activeTab, setActiveTab] = useState("Recommend");
  const [tabs, setTabs] = useState(["Recommend", "Latest", "Hollywood"]);
  const { data, isLoading } = useGetExploreHeaderQuery("");
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    if (data?.data?.tabs) {
      const tt = data?.data?.tabs.map((t: any) => t.title);
      setTabs([...tt, "Hollywood"]);
    }
  }, [data]);

  useEffect(() => {
    if (swiperRef.current) {
      const index = tabs?.indexOf(activeTab);
      if (index >= 0) {
        swiperRef.current.slideTo(index);
      }
    }
  }, [activeTab, tabs]);

  const handleSlideChange = (swiper: any) => {
    const newActiveTab = tabs[swiper.activeIndex] || activeTab; // Fallback to current activeTab
    setActiveTab(newActiveTab);
  };

  return (
    <div className=" flex justify-center items-center">
    <div className="explore_sec w-screen xl:w-[800px] flex flex-col justify-center items-cente px-[10px] pb-[100px]">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <Banner />
      <div className="mt-[20px]">
        <Swiper
          onSlideChange={handleSlideChange}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          slidesPerView={1}
          spaceBetween={50}
          loop={true}
        >
          <SwiperSlide>
            {activeTab === "Recommend" && (
              <div className="">
                <PopApp />
                <Recommand title="Chinese Drama" />
                <Recommand title="Latest Drama" />
              </div>
            )}
          </SwiperSlide>
          <SwiperSlide>
            {activeTab === "Latest" && (
              <div className="">
                <PopApp />
                <Latest />
              </div>
            )}
          </SwiperSlide>
          <SwiperSlide>
            {activeTab === "Hollywood" && (
              <div className=" h-screen">Hollywood Content</div>
            )}
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
    </div>
  );
};

export default Explore;
