import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "../explore.css";

import { Autoplay, Pagination } from "swiper/modules"; // Correct way to import Autoplay
import { useGetExploreHeaderQuery } from "@/store/api/explore/exploreApi";

interface BannerProps {}

const Banner: React.FC<BannerProps> = () => {
  const [ad, setad] = useState([]);
  const data = useGetExploreHeaderQuery("");
  useEffect(() => {
    if (data?.data) {
      const cur = data?.data?.data?.ads?.carousel;
      setad(cur);
    }
  }, [data, ad]);
  const spanP =
    "<div> <span className=' absolute z-[99] bg-white w-[10px] h-[10px]'></span> </div>";
  return (
    <div className="pt-[80px]">
      <Swiper
        modules={[Autoplay, Pagination]}
        pagination={{
         
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        spaceBetween={50}
        slidesPerView={1}
      >
        {ad.map((cc: any) => (
          <SwiperSlide key={cc.id}>
            <img
              className="w-screen h-[174px] xl:w-[600px]"
              src={cc.image}
              alt="Slide 1"
            />
          </SwiperSlide>
        ))}
                <div className="swiper-pagination"></div>

      </Swiper>
    </div>
  );
};

export default Banner;
