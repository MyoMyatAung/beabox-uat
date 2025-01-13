import React, { useEffect, useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/pagination";
import "./ss.css";
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { Carousel } from "react-responsive-carousel";

// import { Autoplay, Pagination } from "swiper/modules";
import { useGetExploreHeaderQuery } from "@/store/api/explore/exploreApi";

const Banner: React.FC = () => {
  const [ad, setAd] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0); // Track the active slide index
  const { data, isLoading } = useGetExploreHeaderQuery("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (data?.data) {
      const cur = data?.data?.ads?.carousel;
      setAd(cur);
    }
  }, [data]);

  const handleOnChange = (index: any) => {
    setSelectedIndex(index);
  };

  return (
    <>
      <div className="py-[20px] relative">
        {isLoading ? (
          <div className="w-full h-[194px] bg-white/20 rounded-md animate-pulse"></div>
        ) : (
          <>
            <Carousel
              showThumbs={false}
              showArrows={false}
              showStatus={false}
              showIndicators={false}
              className=" bg-transparent"
              autoPlay={true}
              infiniteLoop={true}
              centerMode
              centerSlidePercentage={90}
              selectedItem={selectedIndex}
              onChange={handleOnChange}
            >
              {ad.map((cc: any, index: number) => (
                <div
                  key={index}
                  className={` justify-center h-[172px] items-center px-[8px] flex flex-col relative bg-black`}
                  // href={cc.url}
                  // target="_blank"
                >
                  <img
                    className={`rounded-md transition-all duration-300
                   ${
                     selectedIndex == index
                       ? "w-[332px] h-[162px]" // Active slide size
                       : "w-[290px] h-[148px]" // Non-active slide size
                   }
                  `}
                    src={cc.image}
                    alt="Slide"
                  />
                </div>
              ))}
            </Carousel>
            {/* Custom Dots */}
            <ul className="flex items-center gap-[10px] w-screen justify-center mt-2 absolute bottom-0">
              {ad.map((_, dotIndex) => (
                <li
                  key={dotIndex}
                  className={`w-[6px] h-[6px] rounded-full ${
                    selectedIndex === dotIndex ? "bg-white" : "bg-[#888]"
                  }`}
                  onClick={() => handleOnChange(dotIndex)}
                  role="button"
                  tabIndex={0}
                ></li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
};

export default Banner;
