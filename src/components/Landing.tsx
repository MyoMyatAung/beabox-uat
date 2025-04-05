import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPanding } from "../store/slices/ModelSlice";

import splashScreen from "../assets/splashScreen.png";
import splashLogo from "../assets/splashLogo.png";
import "../page/search/search.css";
import { useGetAdsPopUpQuery } from "@/utils/helperService";
import AsyncDecryptedImage from "@/utils/asyncDecryptedImage";

interface AdImage {
  image: string;
  jump_url?: string;
}

const Landing: React.FC = () => {
  const dispatch = useDispatch();
  const [skip, setSkip] = useState(3);
  const [images, setImages] = useState<AdImage | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [adLoaded, setAdLoaded] = useState(false);

  const { data } = useGetAdsPopUpQuery();

  // Load ad data when available
  useEffect(() => {
    if (data?.data?.splash_screen) {
      setImages(data.data.splash_screen);
    }
  }, [data]);

  // Wait for ad image to fully load before showing ad
  useEffect(() => {
    if (images?.image) {
      const img = new Image();
      img.src = images.image;
      img.onload = () => {
        setAdLoaded(true);
        // After ad is loaded, wait for splash screen minimum time (3 sec)
        setTimeout(() => {
          setShowSplash(false);
        }, 3000);
      };
    }
  }, [images]);

  // Show the ad for exactly 3 seconds AFTER loading & start countdown
  useEffect(() => {
    if (!showSplash && adLoaded) {
      setSkip(3); // Reset countdown when ad starts

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
  }, [showSplash, adLoaded, dispatch]);

  return (
    <>
      {showSplash || !adLoaded ? (
        // Splash screen shown until ad is fully loaded
        <div className="relative h-screen w-screen max-w-[480px] mx-auto">
          <img
            src={splashScreen}
            className="h-full w-full object-cover"
            alt="Splash Screen"
          />
          <div className="absolute inset-0 flex items-center justify-center mb-16">
            <img
              src={splashLogo}
              alt="Splash Logo"
              className="max-w-[200px] w-auto"
            />
          </div>
        </div>
      ) : (
        // Ad view (only shows after image is fully loaded)
        <div className="max-w-[480px] mx-auto">
          <a target="_blank" rel="noopener noreferrer" href={images?.jump_url}>
            <div className="relative h-screen w-screen max-w-[480px]">
              <AsyncDecryptedImage
                className="h-full max-w-[480px] w-full object-cover"
                imageUrl={images?.image || ''}
                alt="Advertisement"
              />
            </div>
          </a>
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
      )}
    </>
  );
};

export default Landing;
