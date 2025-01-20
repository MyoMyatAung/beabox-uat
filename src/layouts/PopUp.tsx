import React, { useEffect, useState } from "react";
import header from "../assets/explore/Header.png";
import { useGetAdsPopUpQuery } from "@/store/api/explore/exploreApi";
import "../page/explore/explore.css";
interface PopUpProps {
  setShowAd: any;
}

const PopUp: React.FC<PopUpProps> = ({ setShowAd }) => {
  const [ad, setad] = useState([]);
  // const { data, isLoading } = useGetExploreHeaderQuery("");
  // const { data, isLoading } = useGetApplicationAdsQuery("");
  const { data, isLoading } = useGetAdsPopUpQuery("");
  console.log(data);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "visible";
    };
  }, []);

  useEffect(() => {
    if (data?.data?.popup_application) {
      // const flattenedApps = data.data.application.flatMap((dd: any) => dd.apps);
      setad(data.data.popup_application.apps);
    }
  }, [data]);
  console.log(ad)

  return (
    <div className=" h-screen bg-black/80 w-screen flex flex-col gap-[20px] justify-center items-center fixed top-0 z-[9999]">
      <div className="w-[330px] flex flex-col gap-0 justify-center items-center ">
        <img src={header} alt="" />
        <div className="initial_popup_ad_box w-full  h-[304px] overflow-hidden p-[10px]">
          {isLoading ? (
            <div className="grid grid-cols-4 gap-[20px]">
              <div className="w-[56px] h-[53px] rounded-md bg-white/20 animate-pulse"></div>
              <div className="w-[56px] h-[53px] rounded-md bg-white/20 animate-pulse"></div>
              <div className="w-[56px] h-[53px] rounded-md bg-white/20 animate-pulse"></div>
              <div className="w-[56px] h-[53px] rounded-md bg-white/20 animate-pulse"></div>
              <div className="w-[56px] h-[53px] rounded-md bg-white/20 animate-pulse"></div>
              <div className="w-[56px] h-[53px] rounded-md bg-white/20 animate-pulse"></div>
              <div className="w-[56px] h-[53px] rounded-md bg-white/20 animate-pulse"></div>
              <div className="w-[56px] h-[53px] rounded-md bg-white/20 animate-pulse"></div>
            </div>
          ) : (
            <div className=" grid grid-cols-4 gap-[10px] h-[304px overflow-scroll scrollbar-hide">
              {ad?.map((app: any) => (
                <a
                  key={app.id}
                  href={app.url}
                  target="_blink"
                  className=" flex h-[75px] flex-col justify-center items-center gap-[4px]"
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
        </div>
      </div>
      {/* close btn */}
      <div
        onClick={() => setShowAd(false)}
        className="initial_popup_ad_box_close p-[9px]"
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
            stroke-width="1.49593"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M6.25 5.75L17.75 17.25"
            stroke="white"
            stroke-width="1.49593"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default PopUp;
