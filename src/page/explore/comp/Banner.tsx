import React, { useEffect, useState } from "react";
import "./ss.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { useGetExploreHeaderQuery } from "@/store/api/explore/exploreApi";
import ImageWithPlaceholder from "@/page/search/comp/imgPlaceholder";

const Banner: React.FC = () => {
  const [ad, setAd] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { data, isLoading } = useGetExploreHeaderQuery("");

  useEffect(() => {
    if (data?.data) {
      const cur = data?.data?.ads?.carousel;
      setAd(cur || []);
    }
  }, [data]);

  const handleOnChange = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <div className="py-[20px] relative">
      {isLoading ? (
        <div className="w-full h-[194px] bg-white/20 rounded-md animate-pulse"></div>
      ) : (
        ad.length > 0 && ( // Only render when ads are available
          <>
            <Carousel
              showThumbs={false}
              showArrows={false}
              showStatus={false}
              showIndicators={false}
              autoPlay={true}
              infiniteLoop={true}
              centerMode
              centerSlidePercentage={87}
              selectedItem={selectedIndex}
              onChange={handleOnChange}
              interval={3000} // Set autoplay interval
            >
              {ad.map((cc: any, index: number) => (
                <div
                  key={index}
                  className={`justify-center h-[172px] items-center px-[8px] flex flex-col relative bg-black`}
                >
               
                    <ImageWithPlaceholder
                      src={cc.image}
                      alt={`Slide ${index + 1}`}
                      width={"100%"}
                      className={`rounded-md hidden transition-all duration-300  ${
                        selectedIndex === index
                          ? "w-[332px] h-[162px]" // Active slide size
                          : "w-[290px] h-[148px]" // Non-active slide size
                      }`}
                      height={"100%"}
                    />
                  {/* <img
                    className={`rounded-md hidden transition-all duration-300  ${
                      selectedIndex === index
                        ? "w-[332px] h-[162px]" // Active slide size
                        : "w-[290px] h-[148px]" // Non-active slide size
                    }`}
                    src={cc.image}
                    alt={`Slide ${index + 1}`}
                  /> */}
                </div>
              ))}
            </Carousel>
            {/* Custom Dots */}
            <ul className="flex justify-center items-center gap-[10px] w-full  mt-2 absolute bottom-0 left-0">
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
        )
      )}
    </div>
  );
};

export default Banner;
