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
  const [searchParams, setSearchParams] = useSearchParams();
  const [tabs, setTabs] = useState(["Recommend", "Latest", "Hollywood"]);
  const { data, isLoading } = useGetExploreHeaderQuery("");
  const swiperRef = useRef<any>(null);
  const [show, setshow] = useState<boolean>(false);
  const dispatch = useDispatch();



  // useEffect(() => {
  //   const queryTab = searchParams.get("query");
  //   if (queryTab && tabs.includes(queryTab)) {
  //     setActiveTab(queryTab);
  //   }
  // }, [searchParams, tabs]);

  useEffect(() => {
    if (data?.data?.tabs) {
      const tt = data?.data?.tabs.map((t: any) => t.title);
      setTabs([...tt, "Hollywood"]);
    }
  }, [data]);

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

  // useEffect(() => {
  //   const queryTab = searchParams.get("query");
  //   const formattedTab = formatQueryToTab(queryTab); // Converts `rec` to `Recommend`, etc.
  //   if (formattedTab && tabs.includes(formattedTab)) {
  //     setActiveTab(formattedTab);
  //   }
  // }, [searchParams, tabs]);

  // // Convert query values to tab names
  // const formatQueryToTab = (query: string | null) => {
  //   if (!query) return null;
  //   const map: Record<string, string> = {
  //     rec: "Recommend",
  //     latest: "Latest",
  //     hollywood: "Hollywood",
  //   };
  //   return map[query.toLowerCase()] || null;
  // };

  // // Convert tab names to query values
  // const tabToQuery = (tab: string) => {
  //   const map: Record<string, string> = {
  //     Recommend: "rec",
  //     Latest: "latest",
  //     Hollywood: "hollywood",
  //   };
  //   return map[tab] || "";
  // };

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
                {exp_header === "Recommend" && (
                  <div className="">
                    <Recommand title="Chinese Drama" />
                    <Recommand title="Latest Drama" />
                  </div>
                )}
              </SwiperSlide>
              <SwiperSlide>
                {exp_header === "Latest" && (
                  <div className="">
                    {/* <Latest /> */}
                    <Recommand title="Chinese Drama" />
                    <Recommand title="Latest Drama" />
                  </div>
                )}
              </SwiperSlide>
              <SwiperSlide>
                {exp_header === "Hollywood" && (
                  <div className="">
                    <Latest />
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
