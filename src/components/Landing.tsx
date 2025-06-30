import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPanding } from "../store/slices/ModelSlice";
import "../page/search/search.css";
import AsyncDecryptedImage from "@/utils/asyncDecryptedImage";
import Splash from '../assets/splashScreen.webp';
interface AdImage {
  image: string;
  jump_url?: string;
}

interface RootState {
  explore: {
    applicationData?: {
      splash_screen?: AdImage;
    };
  };
}

interface LandingProps {
  onComplete: () => void;
}

const Landing: React.FC<LandingProps> = ({ onComplete }) => {
  const dispatch = useDispatch();
  const [skip, setSkip] = useState(3);
  const [images, setImages] = useState<AdImage | null>(null);
  const [adLoaded, setAdLoaded] = useState(true); // Assets are already preloaded

  // Use splash data from Redux state if available
  const adsData = useSelector((state: RootState) => state.explore?.applicationData?.splash_screen);

  // Load ad data from Redux state
  useEffect(() => {
    if (adsData?.image) {
      setImages({
        image: adsData.image,
        jump_url: adsData.jump_url
      });
      setAdLoaded(true);
    }
  }, [adsData]);

  // Show the ad for exactly 3 seconds and start countdown
  useEffect(() => {
    if (adLoaded) {
      const countdown = setInterval(() => {
        setSkip((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            dispatch(setPanding(false));
            // Call onComplete when countdown finishes
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [adLoaded, dispatch, onComplete]);

  // Handle skip button click
  const handleSkip = () => {
    dispatch(setPanding(false));
    onComplete();
  };

  // We're now only showing the ad view since splash is handled by LoadingScreen
  return (
    <div className="max-w-[480px] mx-auto">
      <a target="_blank" rel="noopener noreferrer" href={images?.jump_url}>
        <div className="relative h-screen w-screen max-w-[480px]">
          <AsyncDecryptedImage
            className="h-full max-w-[480px] w-full object-cover"
            imageUrl={images?.image || Splash}
            alt="Advertisement"
          />
        </div>
      </a>
      <div
        onClick={handleSkip}
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
  );
};

export default Landing;
