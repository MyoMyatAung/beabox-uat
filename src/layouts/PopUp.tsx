import React, { useEffect, useState } from "react";
import header from "../assets/explore/Header.png";
import {
  useGetAdsNoticeQuery,
  useGetAdsPopUpQuery,
} from "@/store/api/explore/exploreApi";
import "../page/explore/explore.css";
import ImageWithPlaceholder from "@/page/search/comp/imgPlaceholder";
import Notice from "./Notice";

interface PopUpProps {
  setShowAd: any;
}

const PopUp: React.FC<PopUpProps> = ({ setShowAd }) => {
  const [ad, setAd] = useState([]);
  const [start, setStart] = useState<any>();
  const [showStart, setShowStart] = useState(true);
  const [showAppContent, setShowAppContent] = useState(false);
  const [showNotice, setShowNotice] = useState(false);
  const [NotList, setNotList] = useState<any>();

  const { data, isLoading } = useGetAdsPopUpQuery("");
  const { data: notice, isLoading: noticeLoading } = useGetAdsNoticeQuery("");

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  useEffect(() => {
    if (data?.data?.popup_application) {
      setAd(data.data.popup_application.apps);
      setStart(data?.data.app_start_popup);
    }
    if (notice?.data) {
      setNotList(notice?.data);
    }
  }, [data,notice]);

  const handleStartClose = () => {
    setShowStart(false);
    setShowAppContent(true);
  };

  const handleAppClose = () => {
    setShowAppContent(false);
    setShowNotice(true);
   
  };

  const handleNoticeClose = () => {
    setShowNotice(false)
     setShowAd(false);
  }

  return (
    <div className="h-screen bg-black/80 w-screen flex flex-col gap-[20px] justify-center items-center fixed top-0 z-[9999]">
      {/* Start Image */}
      {isLoading ? (
        <div className=" w-[268px] h-[397px] bg-white/20 animate-pulse"></div>
      ) : (
        <>
          {showStart && start && (
            <div className="w-[330px] flex flex-col gap-0 justify-center items-center">
              <a
                className="flex justify-center items-center"
                target="_blank"
                href={start.jump_url}
              >
                <ImageWithPlaceholder
                  src={start.image}
                  alt="start"
                  width="100%"
                  height="100%"
                  className="w-[260px] h-[390px] object-cover"
                />
              </a>
              <div
                onClick={handleStartClose}
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
                {[...Array(8)].map((_, index) => (
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
                    <img
                      className="w-[56px] h-[53px] rounded-[6px] border-[#222]"
                      src={app.image}
                      alt=""
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
      {!showStart && !showAppContent && showNotice && <Notice handleNoticeClose={handleNoticeClose} notice={NotList} />}
    </div>
  );
};

export default PopUp;
