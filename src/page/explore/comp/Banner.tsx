// import React, { useEffect, useRef, useState } from "react";
// import "./ss.css";
// import "react-responsive-carousel/lib/styles/carousel.min.css";
// import { Carousel } from "react-responsive-carousel";
// import { useGetExploreHeaderQuery } from "@/store/api/explore/exploreApi";
// import ImageWithPlaceholder from "@/page/search/comp/imgPlaceholder";

// const Banner: React.FC = () => {
//   const [ad, setAd] = useState([]);
//   const [selectedIndex, setSelectedIndex] = useState(0);
//   const { data, isLoading } = useGetExploreHeaderQuery("");

//   useEffect(() => {
//     if (data?.data) {
//       const cur = data?.data?.ads?.carousel;
//       setAd(cur || []);
//     }
//   }, [data]);

//   const handleOnChange = (index: number) => {
//     setSelectedIndex(index);
//   };
//   return (
//     <div className="py-[20px] relative">
//       {isLoading ? (
//         <div className="w-full h-[194px] bg-white/20 rounded-md animate-pulse"></div>
//       ) : (
//         ad.length > 0 && ( // Only render when ads are available
//           <>
//             <Carousel
//               showThumbs={false}
//               showArrows={false}
//               showStatus={false}
//               showIndicators={false}
//               autoPlay={true}
//               infiniteLoop={true}
//               centerMode
//               centerSlidePercentage={87}
//               selectedItem={selectedIndex}
//               onChange={handleOnChange}
//               interval={3000} // Set autoplay interval
//             >
//               {ad.map((cc: any, index: number) => (
//                 <a
//                 href={cc.url}
//                 target="_blink"
//                   key={index}
//                   className={`justify-center h-[172px] items-center px-[8px] flex flex-col relative bg-[#16131C]`}
//                 >
//                   {/* <ImageWithPlaceholder
//                     ref={imgRef}
//                     src={"cc.image"}
//                     alt={`Slide ${index + 1}`}
//                     width={"100%"}
//                     className={`rounded-md hidden transition-all duration-300  ${
//                       selectedIndex === index
//                         ? "w-[332px] h-[162px]" // Active slide size
//                         : "w-[290px] h-[148px]" // Non-active slide size
//                     }`}
//                     height={"100%"}
//                   /> */}
//                   <img
//                     className={`rounded-[12px] hidden transition-all duration-300  ${
//                       selectedIndex === index
//                         ? "w-[332px] h-[162px]" // Active slide size
//                         : "w-[290px] h-[148px]" // Non-active slide size
//                     }`}
//                     src={cc.image}
//                     alt={`Slide ${index + 1}`}
//                   />
//                 </a>
//               ))}
//             </Carousel>
//             {/* Custom Dots */}
//             <ul className="flex justify-center items-center gap-[4px] w-full  mt-2 absolute bottom-0 left-0">
//               {ad.map((_, dotIndex) => (
//                 <li
//                   key={dotIndex}
//                   className={`w-[6px] h-[6px] rounded-full ${
//                     selectedIndex === dotIndex ? "bg-white" : "bg-[#888]"
//                   }`}
//                   onClick={() => handleOnChange(dotIndex)}
//                   role="button"
//                   tabIndex={0}
//                 ></li>
//               ))}
//             </ul>
//           </>
//         )
//       )}
//     </div>
//   );
// };

// export default Banner;

import React, { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/autoplay"; // Import Swiper autoplay styles
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules"; // Import Swiper's autoplay module
import { useGetExploreHeaderQuery } from "@/store/api/explore/exploreApi";

const Banner: React.FC = () => {
  const [ad, setAd] = useState([]);
  const { data, isLoading } = useGetExploreHeaderQuery("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [spaceBetween, setSpaceBetween] = useState(150);

  useEffect(() => {
    const updateSpace = () => {
      const width = window.innerWidth;
      if (width >= 390) {
        setSpaceBetween(100);
      } else {
        setSpaceBetween(120);
      }
    };

    updateSpace();
    window.addEventListener("resize", updateSpace);
    return () => window.removeEventListener("resize", updateSpace);
  }, []);

  const handleOnChange = (swiper: any) => {
    setSelectedIndex(swiper.realIndex);
  };

  useEffect(() => {
    if (data?.data) {
      const cur = data?.data?.ads?.carousel;
      setAd(cur || []);
    }
  }, [data]);

  const loopCondition = selectedIndex === ad.length;
  // console.log(" this is mf", selectedIndex, loopCondition);

  return (
    <div className="py-[20px] relative">
      {isLoading ? (
        <div className="w-full h-[194px] bg-white/20 rounded-md animate-pulse"></div>
      ) : (
        ad.length > 0 && (
          <Swiper
            className=""
            slidesPerView={1.5}
            spaceBetween={spaceBetween}
            centeredSlides={true}
            loop={true}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            modules={[Autoplay]}
            onSlideChange={handleOnChange}
          >
            {ad.map((cc: any, index: number) => (
              <SwiperSlide className=" w-full rounded-[12px]" key={index}>
                <a
                  href={cc.url}
                  target="_blank"
                  className={`flex rounded-[12px] justify-center w-full items-center px-[8px] flex-col relative transition-all duration-300 `}
                >
                  <div className=" w-[332px] h-[162px] px-2 overflow-hidden rounded-[12px]">
                    <img
                      className={`object-cove w-full h-full transition-all rounded-[12px] duration-300 ${
                        selectedIndex === index
                          ? "p-0 m-0 opacity-100"
                          : "p-2 opacity-70 "
                      }`}
                      src={cc.image}
                      alt={`Slide ${index + 1}`}
                    />
                  </div>
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        )
      )}
      {/* Custom Dots */}
      <ul className="flex justify-center items-center gap-[4px] w-full  mt-2 absolute bottom-0 left-0">
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
    </div>
  );
};
export default Banner;
