import React, { useEffect, useState } from "react";
import header from "../assets/explore/Header.png";
import { useGetAdsNoticeQuery } from "@/store/api/explore/exploreApi";
import "../page/explore/explore.css";
import ImageWithPlaceholder from "@/page/explore/comp/imgPlaceHolder.tsx";
import Notice from "./Notice";
import { useGetAdsPopUpQuery } from "@/utils/helperService";
import AsyncDecryptedImage from "@/utils/asyncDecryptedImage";

interface PopUpProps {
  setShowAd: any;
}

const PopUp: React.FC<PopUpProps> = ({ setShowAd }) => {
  const [multiStart, setMultiStart] = useState([]);
  const [ad, setAd] = useState([]);
  const [start, setStart] = useState<any>();
  const [showStart, setShowStart] = useState(true);
  const [showAppContent, setShowAppContent] = useState(false);
  const [showNotice, setShowNotice] = useState(false);
  const [NotList, setNotList] = useState<any>();

  const { data, isLoading } = useGetAdsPopUpQuery();
  const { data: notice, isLoading: noticeLoading } = useGetAdsNoticeQuery("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);
  // console.log(data?.data)

  useEffect(() => {
    if (data?.data?.popup_application) {
      setAd(data.data.popup_application.apps);
      // setStart(data?.data.app_start_popup);
      setMultiStart(data?.data?.index_popup);
    }
    if (notice?.data) {
      setNotList(notice?.data);
    }
  }, [data, notice]);
  // console.log(multiStart);

  const handleStartClose = () => {
    setShowStart(false);
    setShowAppContent(true);
  };

  const handleAppClose = () => {
    setShowAppContent(false);
    // setShowNotice(true);
    setShowAd(false);
  };

  const handleNoticeClose = () => {
    setShowNotice(false);
    setShowAd(false);
  };

  const handleClose = () => {
    if (currentIndex < multiStart.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      handleStartClose();
    }
  };

  const currentImage: any = multiStart[currentIndex];
  // console.log(ad);

  return (
    <div className="h-screen bg-transparent w-screen flex flex-col gap-[20px] justify-center items-center fixed top-0 z-[9999]">
      {/* Start Image */}
      {isLoading ? (
        <div className=" w-[268px] h-[397px] bg-white/20 animate-pulse"></div>
      ) : (
        <>
          {showStart && currentImage && (
            <div className="w-[330px] flex flex-col gap-0 justify-center items-center">
              <a
                className="flex justify-center items-center index_start_popup_img"
                target="_blank"
                href={currentImage.jump_url}
              >
                <ImageWithPlaceholder
                  src={currentImage?.image}
                  alt="start"
                  width="100%"
                  height="100%"
                  className="w-[260px] h-[390px] object-cover"
                />
              </a>
              <div
                onClick={handleClose}
                className="initial_popup_ad_box_close p-[9px] mt-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="23"
                  viewBox="0 0 24 23"
                  fill="none"
                >
                  <path
                    d="M17.75 5.75L6.25 17.25"
                    stroke="white"
                    strokeWidth="1.49593"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.25 5.75L17.75 17.25"
                    stroke="white"
                    strokeWidth="1.49593"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          )}
        </>
      )}

      {/* apps */}
      {!showStart && showAppContent && (
        <div className="w-[330px] flex flex-col gap-0 justify-center items-center">
          <img src={header} alt="" />
          <div className="initial_popup_ad_box w-full h-[304px] overflow-hidde p-[10px]">
            {isLoading ? (
              <div className="grid grid-cols-4 gap-[20px]">
                {/* Loading placeholders */}
                {[...Array(8)]?.map((_, index) => (
                  <div
                    key={index}
                    className="w-[56px] h-[53px] rounded-md bg-white/20 animate-pulse"
                  ></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-[10px] h-[304px overflow-scroll scrollbar-hide">
                {ad?.map((app: any) => (
                  <a
                    key={app.id}
                    href={app.url}
                    target="_blank"
                    className="flex h-[75px] flex-col justify-center items-center gap-[4px]"
                  >
                    {/* <AsyncDecryptedImage
                      className="w-[56px] h-[53px] rounded-[6px] border-[#222]"
                      imageUrl={app.image}
                      alt=""
                    /> */}
                    <ImageWithPlaceholder
                      src={app.image}
                      width={""}
                      height={""}
                      alt="start"
                      className="w-[56px] h-[53px] rounded-[6px] border-[#222]"
                    />
                    <h1 className="text-white text-[10px] font-[400]">
                      {app.title}
                    </h1>
                  </a>
                ))}
              </div>
            )}
          </div>
          <div
            onClick={handleAppClose}
            className="initial_popup_ad_box_close p-[9px] mt-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="23"
              viewBox="0 0 24 23"
              fill="none"
            >
              <path
                d="M17.75 5.75L6.25 17.25"
                stroke="white"
                strokeWidth="1.49593"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.25 5.75L17.75 17.25"
                stroke="white"
                strokeWidth="1.49593"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      )}
      {!showStart && !showAppContent && showNotice && NotList && (
        <Notice handleNoticeClose={handleNoticeClose} notice={NotList} />
      )}
    </div>
  );
};

export default PopUp;
