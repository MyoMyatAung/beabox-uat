/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "../explore/explore.css";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules"; // Correct way to import Autoplay
import { useGetApplicationAdsQuery } from "@/store/api/explore/exploreApi";

const Application: React.FC<any> = () => {
  const [ad, setad] = useState([]);
  const [applicationData, setApplicationData] = useState<any>(null);
  const { data, isLoading } = useGetApplicationAdsQuery("");
  useEffect(() => {
    if (data?.data) {
      const cur = data?.data?.carousel;
      setApplicationData(data?.data);
      setad(cur);
    }
  }, [data, ad]);

  return (
    <div className="px-[10px] py-[10px]">
      {!isLoading && applicationData &&
        <>
        <Swiper
          modules={[Autoplay, Pagination]}
          pagination={{}}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          spaceBetween={50}
          slidesPerView={1}
        >
          {applicationData?.carousel?.length > 0 && applicationData?.carousel.map((cc: any) => (
            <SwiperSlide key={cc.id}>
              <a href={cc.url} target="_blank" key={cc.id}>
              <img
                className="w-screen rounded-md h-[174px] xl:w-[600px]"
                src={cc.image}
                alt="Slide 1"
              />
              </a>
            </SwiperSlide>
          ))}
          <div className="swiper-pagination"></div>
        </Swiper>
      <div className="mt-[20px]">
        {
          <div className="grid grid-rows-4 gap-[5px]">
            {applicationData?.header?.length > 0 &&
              applicationData?.header.map((header: any) => (
                <a href={header.url} target="_blank" key={header.id}>
                  <img
                    className=" w-full h-auto rounded-[6px] border-[#222]"
                    src={header.image}
                    alt=""
                  />
                </a>
              ))}
          </div>
        }
      </div>
      <div className="mt-[5px]">
        {applicationData?.application?.length > 0 &&
          applicationData?.application.map((application: any) => (
            <>
              <h1 className=" text-white text-[14px] font-[500] leading-[20px] pb-[12px] pt-5">
                {application.title}
              </h1>
              {!isLoading && (
                <div className=" grid grid-cols-5 gap-[20px]">
                  {application?.apps?.length > 0 &&
                    application?.apps.map((app: any) => (
                      <a
                        key={app.id}
                        href={app.url}
                        target="_blink"
                        className=" flex flex-col justify-center items-center gap-[4px]"
                      >
                        <img
                          className=" w-[56px] h-[53px] rounded-[6px] border-[#222]"
                          src={app.image}
                          alt=""
                        />
                        <h1 className=" text-white text-[10px] font-[400]">
                          {app.title}
                        </h1>
                      </a>
                    ))}
                </div>
              )}
            </>
          ))}
      </div>
      <div className="mt-[20px]">
        {applicationData?.footer?.length > 0 &&
          applicationData?.footer.map((footer: any) => (
            <a href={footer.url} target="_blank" key={footer.id}>
              <img
                className="w-full h-auto rounded-[6px] border-[#222]"
                src={footer.image}
                alt=""
              />
            </a>
          ))}
      </div>
      </>}
    </div>
  );
};

export default Application;
