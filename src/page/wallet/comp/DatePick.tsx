import React, { useState } from "react";
import "swiper/css";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import "../wallet.css";
import { FaCaretDown } from "react-icons/fa";
import { Swiper } from "swiper/react";
import { SwiperSlide } from "swiper/react";

interface DatePickProps {}

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

const years = Array.from({ length: 10 }, (_, i) => 2024 - i);

const DatePick: React.FC<DatePickProps> = ({}) => {
  const [lang, setLang] = useState("English");
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Drawer>
      <div className="flex justify-between items-center">
        <DrawerTrigger asChild>
          <div className=" bg-white/5 w-full flex gap-[4px] items-center px-[20px] py-[8px]">
            <h1 className=" text-white text-[14px] font-[500] leading-[20px]">
              2024 December
            </h1>
            <FaCaretDown />
          </div>
        </DrawerTrigger>
      </div>
      <DrawerContent className="border-0 bg-[#121012]">
        <div className="w-full flex flex-col justify-between px-5 py-7 h-[320px] overflow-hidde">
          <div className="flex h-[50px] mt-[40px] justify-around items-center border border-white/20 border-x-black">
            <div className=" fixed z-[99] left-20 top-14">
              <Swiper
                className="h-[100px] "
                direction="vertical"
                spaceBetween={1}
                slidesPerView={2}
                centeredSlides={true}
                initialSlide={11}
              >
                {months.map((mt) => (
                  <SwiperSlide>
                    <h1 className=" py-[16px] text-white text-[20px] font-[400]">
                      {mt}
                    </h1>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className=" fixed z-[99] right-20 top-[60px]">
            <Swiper
                className="h-[100px] "
                direction="vertical"
                spaceBetween={1}
                slidesPerView={2}
                centeredSlides={true}
                initialSlide={0}
              >
                {years.map((mt) => (
                  <SwiperSlide>
                    <h1 className=" py-[10px] text-white text-[20px] font-[400]">
                      {mt}
                    </h1>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-[20px]">
              <DrawerClose asChild>
                <button
                  className={`w-[150px] text-[#888] text-[16px] draw_canccel_btn p-[16px]`}
                >
                  Cancel
                </button>
              </DrawerClose>
              <DrawerClose asChild>
                <button
                  className={`w-[150px] text-[#fff] text-[16px] font-[400] draw_done_btn p-[16px]`}
                >
                  Done
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
