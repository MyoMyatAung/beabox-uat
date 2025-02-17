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
  const [adLoaded, setAdLoaded] = useState(false);
  const [showAd, setShowAd] = useState(false);

  const { data } = useGetAdsPopUpQuery();

  // Load ad data when available
  useEffect(() => {
    if (data?.data?.splash_screen) {
      setImages(data.data.splash_screen);
    }
  }, [data]);

  // Show splash screen for exactly 3 seconds
  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // ✅ Splash time fixed to 3 seconds

    return () => clearTimeout(splashTimer);
  }, []);

  // Wait for ad image to fully load before showing ad
  useEffect(() => {
    if (!showSplash && images?.image) {
      const img = new Image();
      img.src = images.image;
      img.onload = () => {
        setAdLoaded(true);
      };
    }
  }, [showSplash, images]);

  // Show the ad for exactly 3 seconds AFTER loading & start countdown
  useEffect(() => {
    if (adLoaded) {
      setShowAd(true);
      setSkip(3); // ✅ Reset countdown when ad starts

      const countdown = setInterval(() => {
        setSkip((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            dispatch(setPanding(false));
            setShowAd(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000); 

      return () => clearInterval(countdown);
    }
  }, [adLoaded, dispatch]);

  return (
    <>
      {showSplash ? (
        // Splash screen view (3 seconds, no skip)
        <div className="h-screen w-screen">
          <img
            src={splashScreen}
            className="h-full w-full object-cover"
            alt="Splash Screen"
          />
        </div>
      ) : showAd ? (
        // Ad view (only shows after image is fully loaded)
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
      ) : (
        <div className="h-screen w-screen">
          <img
            src={splashScreen}
            className="h-full w-full object-cover"
            alt="Splash Screen"
          />
        </div>
      )}
    </>
  );
};

export default Landing;
