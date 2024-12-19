import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import '../explore.css'

import { Autoplay, Pagination } from "swiper/modules"; // Correct way to import Autoplay
import banner from "../../../assets/explore/banner.png";

interface BannerProps {}

const Banner: React.FC<BannerProps> = () => {
  return (
    <div className="pt-[80px]">
      <Swiper
        modules={[Autoplay, Pagination]}
        pagination={{
          clickable: true,
          renderBullet: (index, className = " text-white") => {
            return `<span class="${className}"></span>`;
          },
        }}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        spaceBetween={50}
        slidesPerView={1}
      >
        <SwiperSlide>
          <img className="w-full" src={banner} alt="Slide 1" />
        </SwiperSlide>
        <SwiperSlide>
          <img className="w-full" src={banner} alt="Slide 2" />
        </SwiperSlide>
        <SwiperSlide>
          <img className="w-full" src={banner} alt="Slide 3" />
        </SwiperSlide>
        <SwiperSlide>
          <img className="w-full" src={banner} alt="Slide 4" />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Banner;
