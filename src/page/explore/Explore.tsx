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

const Explore = () => {
  const [activeTab, setActiveTab] = useState("Recommend");
  const [tabs, setTabs] = useState(["Recommend", "Latest", "Hollywood"]);
  const { data, isLoading } = useGetExploreHeaderQuery("");
  const swiperRef = useRef<any>(null);
  const [show, setshow] = useState<boolean>(false);

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
    <>
      {/* {show && <VodDetails  />} */}

      <div className="flex justify-center items-center w-screen overflow-clip	">
        <div className="explore_sec w-screen xl:w-[800px] flex flex-col justify-center items-cente px-[10px] pb-[100px] mt-14">
          <Banner />
          <PopApp />
          <div className="mt-[20px] relative">
            <Header activeTab={activeTab} setActiveTab={setActiveTab} />
            <Swiper
              className=""
              onSlideChange={handleSlideChange}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              slidesPerView={1}
              spaceBetween={10}
              loop={true}
            >
              <SwiperSlide>
                {activeTab === "Recommend" && (
                  <div className="">
                    <Recommand  title="Chinese Drama" />
                    <Recommand  title="Latest Drama" />
                  </div>
                )}
              </SwiperSlide>
              <SwiperSlide>
                {activeTab === "Latest" && (
                  <div className="">
                    <Latest  />
                  </div>
                )}
              </SwiperSlide>
              <SwiperSlide>
                {activeTab === "Hollywood" && (
                  <div className="">
                    <Latest  />
                  </div>
                )}
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
    </>
  );
};

export default Explore;
