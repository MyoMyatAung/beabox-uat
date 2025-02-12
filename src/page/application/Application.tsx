/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSelector } from "react-redux";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import ImageWithPlaceholder from "../explore/comp/imgPlaceHolder.tsx";

const Application: React.FC<any> = () => {
  const [ad, setAd] = useState([]);
  const { applicationData, isLoading } = useSelector((state: any) => state.explore);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  useEffect(() => {
    setAutoPlay(true); // Activate autoPlay once on mount
  }, []);

  const handleOnChange = (index: number) => {
    setSelectedIndex(index);
  };

  // Update carousel only when applicationData changes
  useEffect(() => {
    if (applicationData) {
      setAd(applicationData.carousel);
    }
  }, [applicationData]);

  return (
    <SkeletonTheme
      baseColor="rgba(255, 255, 255, 0.2)"
      highlightColor="rgba(255, 255, 255, 0.2)"
    >
      <div className="px-[10px] py-[10px]">
        {isLoading && (
          <>
            {/* Skeleton for Carousel */}
            <Skeleton height={174} className="rounded-md w-screen xl:w-[600px]" />

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
                        <Skeleton height={53} width={56} className="rounded-[6px]" />
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
            {/* Carousel Section */}
            <Carousel
              showThumbs={false}
              showArrows={false}
              showStatus={false}
              showIndicators={false}
              autoPlay={autoPlay}
              infiniteLoop={true}
              centerMode={true}
              centerSlidePercentage={87}
              selectedItem={selectedIndex}
              onChange={handleOnChange}
              interval={3000} // autoplay interval
            >
              {ad.map((cc: any, index: number) => (
                <a
                  href={cc.url}
                  target="_blank"
                  key={index}
                  className="justify-center h-[172px] items-center px-[8px] flex flex-col relative bg-[#16131C]"
                >
                  <img
                    className={`rounded-[12px] transition-all duration-300 ${
                      selectedIndex === index
                        ? "w-[332px] h-[162px]" // Active slide size
                        : "w-[290px] h-[148px]" // Non‑active slide size
                    }`}
                    src={cc.image}
                    alt={`Slide ${index + 1}`}
                  />
                </a>
              ))}
            </Carousel>
            {/* Custom Dots */}
            <ul className="flex justify-center items-center gap-[4px] w-full mt-2">
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

            {/* Header Section */}
            <div className="mt-[20px]">
              <div className="grid grid-rows-4 gap-[5px]">
                {applicationData?.header?.length > 0 &&
                  applicationData?.header
                    .map((header: any) => (
                      <a href={header.url} target="_blank" key={header.id}>

                        <ImageWithPlaceholder
                        className="rounded-md"
                          alt="Header Image"
                          width="100%"
                          height={44}
                          src={header.image}
                        />
                      </a>
                    ))}
              </div>
            </div>

            {/* Application Section */}
            <div className="mt-[5px]">
              {applicationData?.application?.length > 0 &&
                applicationData?.application.map((appSection: any) => (
                  <div key={appSection.id}>
                    {appSection?.apps?.length > 0 && (
                      <h1 className="text-white text-[14px] font-[500] leading-[20px] pb-[12px] pt-5">
                        {appSection.title}
                      </h1>
                    )}
                    <div className="grid grid-cols-5 gap-[20px]">
                      {appSection?.apps?.map((app: any) => (
                        <a
                          key={app.id}
                          href={app.url}
                          target="_blank"
                          className="flex flex-col justify-center items-center gap-[4px]"
                        >
                          <img
                            className="w-[52px] h-[52px] rounded-[6px] border-[#222]"
                            src={app.image}
                            alt={app.title}
                          />
                          <h1 className="text-white text-[10px] font-[400]">
                            {app.title}
                          </h1>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
            </div>

            {/* Footer Section */}
            <div className="mt-[20px] mb-[80px]">
              {applicationData?.footer?.length > 0 &&
                applicationData?.footer.map((footer: any) => (
                  <a href={footer.url} target="_blank" key={footer.id}>
                    <ImageWithPlaceholder
                      className="mt-[5px] rounded-md"
                      alt="Footer Image"
                      width={"100%"}
                      height={"100%"}
                      src={footer.image}
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
