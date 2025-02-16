import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPanding } from "../store/slices/ModelSlice";

import splashScreen from "../assets/splashScreen.svg";
import "../page/search/search.css";
import { useGetAdsPopUpQuery } from "@/utils/helperService";
import AsyncDecryptedImage from "@/utils/asyncDecryptedImage";

const Landing: React.FC = () => {
  const dispatch = useDispatch();
  const [skip, setSkip] = useState(3);
  const [images, setImages] = useState<any>(null);
  const [showSplash, setShowSplash] = useState(true);

  const { data } = useGetAdsPopUpQuery();

  // Load ad data when available
  useEffect(() => {
    if (data?.data) {
      const adData = data.data.splash_screen;
      if (adData) {
        setImages(adData);
      }
    }
  }, [data]);

  // Show splash screen for 3 seconds
  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(splashTimer);
  }, []);

  // Start the skip countdown once splash screen is hidden (ad view)
  useEffect(() => {
    if (!showSplash) {
      const countdown = setInterval(() => {
        setSkip((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            dispatch(setPanding(false));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [showSplash, dispatch]);

  return (
    <>
      {showSplash ? (
        // Splash screen view (no skip button)
        <div className="h-screen w-screen">
          <img
            src={splashScreen}
            className="h-full w-full object-cover"
            alt="Splash Screen"
          />
        </div>
      ) : (
        // Ad view with clickable link and skip button with countdown
        <a target="_blank" rel="noopener noreferrer" href={images?.jump_url}>
          <div className="relative h-screen w-screen">
            <AsyncDecryptedImage
              className="h-full w-full object-cover"
              imageUrl={images?.image}
              alt="Advertisement"
            />
            <div
              onClick={() => dispatch(setPanding(false))}
              style={{
                borderRadius: "52px",
                background: "rgba(0, 0, 0, 0.98)",
                backdropFilter: "blur(2px)",
              }}
              className="absolute top-[2vh] right-[2vh] cursor-pointer"
            >
              <h1 className="text-white text-xs md:text-sm font-[400] py-[4px] px-[12px]">
                跳过广告 <span>{skip}</span>
              </h1>
            </div>
          </div>
        </a>
      )}
    </>
  );
};

export default Landing;
