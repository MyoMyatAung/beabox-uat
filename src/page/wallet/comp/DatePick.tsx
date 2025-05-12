import React, { useRef, useEffect, useState } from "react";
import "swiper/css";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FaCaretDown } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";

// const months = [
//   "January",
//   "February",
//   "March",
//   "April",
//   "May",
//   "June",
//   "July",
//   "August",
//   "September",
//   "October",
//   "November",
//   "December",
// ];
const months = [
  "一月",
  "二月",
  "三月",
  "四月",
  "五月",
  "六月",
  "七月",
  "八月",
  "九月",
  "十月",
  "十一月",
  "十二月",
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
  setTran,
}) => {
  const swiperRef = useRef<any>(null);
  const swiperYrRef = useRef<any>(null);

  // Temporary state to hold selection before confirmation
  const [selectedMonth, setSelectedMonth] = useState(curMon);
  const [selectedYear, setSelectedYear] = useState(curYr);

  const handleSlideChange = (swiper: any) => {
    const activeIndex = swiper.activeIndex;
    setSelectedMonth(months[activeIndex]);
  };

  const handleSlideChangeYr = (swiper: any) => {
    const activeIndex = swiper.activeIndex;
    setSelectedYear(years[activeIndex]);
  };

  const handleDoneClick = () => {
    setTran([]);
    setCurMon(selectedMonth);
    setCurYr(selectedYear);
    setplus(months.indexOf(selectedMonth) + 1);
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
    setSelectedMonth(curMon);
    setSelectedYear(curYr);
  }, [curMon, curYr]);

  return (
    <Drawer handleOnly={true} onOpenChange={resetSwiperPosition}>
      <div className="flex justify-between items-center">
        <DrawerTrigger asChild>
          <div className="bg-[#201c25] w-full flex gap-[4px] items-center px-[20px] py-[8px]">
            <h1 className="text-white text-[14px] font-[500] leading-[20px]">
              {curYr} {curMon}
            </h1>
            <FaCaretDown />
          </div>
        </DrawerTrigger>
      </div>
      <DrawerContent className="border-0 bg-[#121012]">
        <div className="w-full flex flex-col justify-between px-5 py-7 h-[350px]">
          <div className="relative h-[240px]">
            {/* Selection indicator lines */}
            <div className="absolute w-full h-[52px] top-1/2 -translate-y-1/2 border-t border-b border-white/10"></div>
            
            <div className="flex justify-center gap-[60px] h-full">
              <div className="w-[120px] h-full relative">
                <Swiper
                  className="h-full"
                  direction="vertical"
                  spaceBetween={-12}
                  slidesPerView={5}
                  centeredSlides={true}
                  initialSlide={months.indexOf(curMon)}
                  onSlideChange={handleSlideChange}
                  onSwiper={(swiper: any) => (swiperRef.current = swiper)}
                  touchEventsTarget="container"
                >
                  {months.map((mt) => (
                    <SwiperSlide key={mt} className="flex items-center justify-center h-[52px]">
                      {({ isActive }) => (
                        <h1
                          className={`text-center transition-all duration-200 ${
                            isActive
                              ? "text-[20px] text-white font-[500] leading-[52px]"
                              : "text-[20px] text-[#333333] font-[400] leading-[52px]"
                          }`}
                        >
                          {mt}
                        </h1>
                      )}
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              <div className="w-[120px] h-full relative">
                <Swiper
                  className="h-full"
                  direction="vertical"
                  spaceBetween={-12}
                  slidesPerView={5}
                  centeredSlides={true}
                  initialSlide={years.indexOf(curYr)}
                  onSlideChange={handleSlideChangeYr}
                  onSwiper={(swiper: any) => (swiperYrRef.current = swiper)}
                  touchEventsTarget="container"
                >
                  {years.map((yr) => (
                    <SwiperSlide key={yr} className="flex items-center justify-center h-[52px]">
                      {({ isActive }) => (
                        <h1
                          className={`text-center transition-all duration-200 ${
                            isActive
                              ? "text-[20px] text-white font-[500] leading-[52px]"
                              : "text-[20px] text-[#333333] font-[400] leading-[52px]"
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
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-[20px]">
              <DrawerClose asChild>
                <button
                  onClick={() => {
                    const now = new Date();
                    setCurMon(defaultMonth);
                    setCurYr(now.getFullYear());
                    setplus(now.getMonth() + 1);
                  }}
                  className="w-[160px] text-[#888] draw_canccel_btn text-[16px] p-[16px]"
                >
                  取消
                </button>
              </DrawerClose>
              <DrawerClose asChild>
                <button
                  onClick={handleDoneClick}
                  className="w-[160px] text-[#fff] draw_done_btn text-[16px] font-[400] p-[16px]"
                >
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
