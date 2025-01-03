import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "../explore.css";

import { Autoplay, Pagination } from "swiper/modules"; // Correct way to import Autoplay
import { useGetExploreHeaderQuery } from "@/store/api/explore/exploreApi";

interface BannerProps {}

const Banner: React.FC<BannerProps> = () => {
  const [ad, setad] = useState([]);
  const paginationRef = useRef<HTMLButtonElement | null>(null);
  const { data, isLoading } = useGetExploreHeaderQuery("");
  useEffect(() => {
    if (data?.data) {
      const cur = data?.data?.ads?.carousel;
      setad(cur);
    }
  }, [data, ad]);
  return (
    <div className="py-[20px] relative">
      {isLoading ? (
        <div className=" w-full h-[174px] bg-white/20 rounded-md animate-pulse"></div>
      ) : (
        <Swiper
          modules={[Autoplay, Pagination]}
          pagination={{
            // el: paginationRef.current,
          }}
          // navigation
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          spaceBetween={50}
          slidesPerView={1}
        >
          {ad.map((cc: any) => (
            <SwiperSlide key={cc.id}>
              <a href={cc.url} target="_blank" key={cc.id}>
                <img
                  className="w-screen h-[174px] xl:w-[600px] rounded-md"
                  src={cc.image}
                  alt="Slide 1"
                />
              </a>
            </SwiperSlide>
          ))}
          {/* <div ref={paginationRef} className="swiper-pagination  "></div> */}
        </Swiper>
      )}
    </div>
  );
};

export default Banner;
