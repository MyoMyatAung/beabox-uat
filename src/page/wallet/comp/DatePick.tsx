import React, { useRef, useEffect } from "react";
import "swiper/css";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FaCaretDown } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const currentYear = new Date().getFullYear();
const defaultMonth = months[new Date().getMonth()];
const defaultYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

const DatePick: React.FC<any> = ({
  curMon,
  curYr,
  setCurMon,
  setCurYr,
  setplus,
}) => {
  const swiperRef = useRef<any>(null);
  const swiperYrRef = useRef<any>(null);

  const handleSlideChange = (swiper: any) => {
    const activeIndex = swiper.activeIndex;
    setplus(activeIndex + 1);
    const activeMonth = months[activeIndex];
    setCurMon(activeMonth);
  };

  const handleSlideChangeYr = (swiper: any) => {
    const activeIndex = swiper.activeIndex;
    const activeYear = years[activeIndex];
    setCurYr(activeYear);
  };

  const resetSwiperPosition = () => {
    if (swiperRef.current) {
      const monthIndex = months.indexOf(curMon);
      swiperRef.current.slideTo(monthIndex, 0);
    }
    if (swiperYrRef.current) {
      const yearIndex = years.indexOf(curYr);
      swiperYrRef.current.slideTo(yearIndex, 0);
    }
  };

  useEffect(() => {
    resetSwiperPosition();
  }, [curMon, curYr]);

  return (
    <Drawer handleOnly={true} onOpenChange={resetSwiperPosition}>
      <div className="flex justify-between items-center">
        <DrawerTrigger asChild>
          <div className="bg-white/5 w-full flex gap-[4px] items-center px-[20px] py-[8px]">
            <h1 className="text-white text-[14px] font-[500] leading-[20px]">
              {curYr} {curMon}
            </h1>
            <FaCaretDown />
          </div>
        </DrawerTrigger>
      </div>
      <DrawerContent className="border-0 bg-[#121012]">
        <div className="w-full flex flex-col justify-between px-5 py-7 h-[320px] overflow-hidden">
          <div className="flex relative h-[50px] mt-[40px] justify-around items-center border border-white/20 border-x-black">
            <div className="fixed z-[99] left-20 top-14">
              <Swiper
                className="h-[80px]"
                direction="vertical"
                spaceBetween={1}
                slidesPerView={2}
                centeredSlides={true}
                initialSlide={months.indexOf(curMon)}
                onSlideChange={handleSlideChange}
                onSwiper={(swiper: any) => (swiperRef.current = swiper)}
              >
                {months.map((mt) => (
                  <SwiperSlide key={mt}>
                    {({ isActive }) => (
                      <h1
                        className={`py-[16px] font-[400] ${
                          isActive
                            ? "text-[20px] text-white"
                            : "text-[16px] text-[#888] "
                        }`}
                      >
                        {mt}
                      </h1>
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="fixed z-[99] right-20 top-14">
              <Swiper
                className="h-[80px]"
                direction="vertical"
                spaceBetween={1}
                slidesPerView={2}
                centeredSlides={true}
                initialSlide={years.indexOf(curYr)}
                onSlideChange={handleSlideChangeYr}
                onSwiper={(swiper: any) => (swiperYrRef.current = swiper)}
              >
                {years.map((yr) => (
                  <SwiperSlide key={yr}>
                    {({ isActive }) => (
                      <h1
                        className={`py-[16px] font-[400] ${
                          isActive
                            ? "text-[20px] text-white"
                            : "text-[16px] text-[#888] "
                        }`}
                      >
                        {yr}
                      </h1>
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-[20px]">
              {/* <DrawerClose asChild> */}
              <button
                onClick={() => {
                  const now = new Date();
                  setCurMon(defaultMonth)
                  setCurYr(now.getFullYear()); // Get current year
                  setplus(now.getMonth() + 1);
                }}
                className={`w-[160px] text-[#888] text-[16px] draw_canccel_btn p-[16px]`}
              >
                {/* Cancel */}
                取消
              </button>
              {/* </DrawerClose> */}
              <DrawerClose asChild>
                <button
                  className={`w-[160px] text-[#fff] text-[16px] font-[400] draw_done_btn p-[16px]`}
                >
                  {/* Done */}
                  完毕
                </button>
              </DrawerClose>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default DatePick;
