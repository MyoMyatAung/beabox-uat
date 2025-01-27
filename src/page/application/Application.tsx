/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "../explore/explore.css";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
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
    <SkeletonTheme
      baseColor="rgba(255, 255, 255, 0.2)"
      highlightColor="rgba(255, 255, 255, 0.2)"
    >
      <div className="px-[10px] py-[10px]">
        {isLoading && (
          <>
            {/* Skeleton for Carousel */}
            <Skeleton
              height={174}
              className="rounded-md w-screen xl:w-[600px]"
            />

            {/* Skeleton for Header */}
            <div className="mt-[20px] grid grid-rows-4 gap-[5px]">
              {[...Array(4)].map((_, index) => (
                <Skeleton key={index} height={44} className="rounded-[6px]" />
              ))}
            </div>

            {/* Skeleton for Application Sections */}
            <div className="mt-[5px]">
              {[...Array(2)].map((_, sectionIndex) => (
                <div key={sectionIndex}>
                  <Skeleton height={20} width={150} className="mt-5" />
                  <div className="grid grid-cols-5 gap-[20px] mt-[12px]">
                    {[...Array(5)].map((_, appIndex) => (
                      <div
                        key={appIndex}
                        className="flex flex-col items-center gap-[4px]"
                      >
                        <Skeleton
                          height={53}
                          width={56}
                          className="rounded-[6px]"
                        />
                        <Skeleton height={10} width={40} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Skeleton for Footer */}
            <div className="mt-[20px] mb-[80px]">
              {[...Array(2)].map((_, index) => (
                <Skeleton key={index} height={80} className="rounded-[6px]" />
              ))}
            </div>
          </>
        )}

        {!isLoading && applicationData && (
          <>
            <Swiper
              modules={[Autoplay, Pagination]}
              pagination={{
                el: ".custom-pagination",
                clickable: true,
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              spaceBetween={50}
              slidesPerView={1}
            >
              {applicationData?.carousel?.length > 0 &&
                applicationData?.carousel.map((cc: any) => (
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
              <div className="custom-pagination mt-4 flex justify-center"></div>
            </Swiper>

            <div className="mt-[20px]">
              {
                <div className="grid grid-rows-4 gap-[5px]">
                  {applicationData?.header?.length > 0 &&
                    applicationData?.header
                      .slice()
                      .reverse()
                      .map((header: any) => (
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
                    {application?.apps?.length > 0 && (
                      <h1 className=" text-white text-[14px] font-[500] leading-[20px] pb-[12px] pt-5">
                        {application.title}
                      </h1>
                    )}
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
                                className=" w-[52px] h-[52px] rounded-[6px] border-[#222]"
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

            <div className="mt-[20px] mb-[80px]">
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
          </>
        )}
      </div>
    </SkeletonTheme>
  );
};

export default Application;
