import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "./ss.css";

import { Autoplay, Pagination } from "swiper/modules";
import { useGetExploreHeaderQuery } from "@/store/api/explore/exploreApi";

const Banner: React.FC = () => {
  const [ad, setAd] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0); // Track the active slide index
  const { data, isLoading } = useGetExploreHeaderQuery("");

  useEffect(() => {
    if (data?.data) {
      const cur = data?.data?.ads?.carousel;
      setAd(cur);
    }
  }, [data]);

  return (
    <div className="py-[20px] relative">
      {isLoading ? (
        <div className="w-full h-[194px] bg-white/20 rounded-md animate-pulse"></div>
      ) : (
        <Swiper
          modules={[Autoplay, Pagination]}
          pagination={{
            el: ".custom-pagination",
            clickable: true,
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          spaceBetween={"1px"}
          slidesPerView={1}
          centeredSlides={true}
          loop={true}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)} // Use realIndex to handle loop
        >
          {ad.map((cc: any, index: number) => (
            <SwiperSlide key={cc.id}>
              <a
                className="flex justify-center items-center"
                href={cc.url}
                target="_blank"
              >
                <img
                  className={`rounded-md transition-all duration-300
                   ${
                    activeIndex === index
                      ? "w-screen h-[162px]" // Active slide size
                      : "w-screen h-[162px]" // Non-active slide size
                  }
                  `}
                  src={cc.image}
                  alt="Slide"
                />
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Custom Pagination */}
      {!isLoading && (
        <div className="custom-pagination mt-4 flex justify-center"></div>
      )}
    </div>
  );
};

export default Banner;
