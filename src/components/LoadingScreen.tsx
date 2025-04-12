import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setApplicationData, setisLoading } from "@/store/slices/exploreSlice";
import { setPlay } from "@/page/home/services/playSlice";
import { useGetAdsPopUpQuery } from "@/utils/helperService";
import { useGetAdsNoticeQuery } from "@/store/api/explore/exploreApi";
import { useGetApplicationAdsQuery } from "@/store/api/explore/exploreApi";
import { useGetConfigQuery } from "@/page/home/services/homeApi";

// Types for our data
interface AdImage {
  image: string;
  jump_url?: string;
  id?: string | number;
}

interface IndexPopupItem extends AdImage {
  id: string | number;
}

interface AppItem extends AdImage {
  id: string | number;
  title: string;
  url: string;
}

interface LoadingScreenProps {
  onLoadComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadComplete }) => {
  const dispatch = useDispatch();
  
  // States for tracking progress
  const [progress, setProgress] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const [allDataLoaded, setAllDataLoaded] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  
  // API queries
  const { data: adsPopUpData, isLoading: adsPopUpLoading } = useGetAdsPopUpQuery();
  const { data: adsNoticeData, isLoading: adsNoticeLoading } = useGetAdsNoticeQuery("");
  const { data: applicationAdsData, isLoading: applicationAdsLoading } = useGetApplicationAdsQuery("");
  const { data: configData, isLoading: configLoading } = useGetConfigQuery({});

  // Set a minimum display time of 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  // Process and preload images when data is available
  useEffect(() => {
    // Only proceed if all API data has been fetched
    if (adsPopUpLoading || adsNoticeLoading || applicationAdsLoading || configLoading) {
      setProgress(25); // Set to 25% when APIs are still loading
      return;
    }
    
    setProgress(50); // Set to 50% when APIs finish loading
    
    // Save application ads data to Redux
    if (applicationAdsData?.data) {
      // Make sure to save all necessary data to Redux
      const dataToSave = {
        ...applicationAdsData.data
      };
      
      // If splash screen exists in adsPopUpData, add it to applicationData
      if (adsPopUpData?.data?.splash_screen) {
        dataToSave.splash_screen = adsPopUpData.data.splash_screen;
      }
      
      dispatch(setApplicationData(dataToSave));
      dispatch(setisLoading(applicationAdsLoading));
    }
    
    // Collect all image URLs to preload
    const imagesToLoad: string[] = [];
    
    // Add popup images
    if (adsPopUpData?.data) {
      // Splash screen image - this is used by Landing component
      if (adsPopUpData.data.splash_screen?.image) {
        imagesToLoad.push(adsPopUpData.data.splash_screen.image);
      }
      
      // Index popup images
      if (adsPopUpData.data.index_popup && adsPopUpData.data.index_popup.length > 0) {
        adsPopUpData.data.index_popup.forEach((item: IndexPopupItem) => {
          if (item.image) {
            imagesToLoad.push(item.image);
          }
        });
      }
      
      // App images
      if (adsPopUpData.data.popup_application?.apps && adsPopUpData.data.popup_application.apps.length > 0) {
        adsPopUpData.data.popup_application.apps.forEach((app: AppItem) => {
          if (app.image) {
            imagesToLoad.push(app.image);
          }
        });
      }
    }
    
    // Set total images count
    setTotalImages(imagesToLoad.length);
    
    // Preload all images
    if (imagesToLoad.length > 0) {
      imagesToLoad.forEach((imageUrl) => {
        const img = new Image();
        img.onload = () => {
          setImagesLoaded((prev) => {
            const newCount = prev + 1;
            // Update progress based on loaded images (from 50% to 100%)
            const newProgress = 50 + Math.floor((newCount / imagesToLoad.length) * 50);
            setProgress(newProgress);
            return newCount;
          });
        };
        img.onerror = () => {
          // Count failed loads too, so we don't stall on 404 images
          setImagesLoaded((prev) => {
            const newCount = prev + 1;
            const newProgress = 50 + Math.floor((newCount / imagesToLoad.length) * 50);
            setProgress(newProgress);
            return newCount;
          });
        };
        img.src = imageUrl;
      });
    } else {
      // No images to load
      setProgress(100);
      setAllDataLoaded(true);
    }
  }, [
    adsPopUpData, 
    adsNoticeData, 
    applicationAdsData, 
    configData,
    adsPopUpLoading, 
    adsNoticeLoading, 
    applicationAdsLoading, 
    configLoading,
    dispatch
  ]);
  
  // Check if everything is loaded
  useEffect(() => {
    if (totalImages > 0 && imagesLoaded >= totalImages) {
      setAllDataLoaded(true);
    }
  }, [imagesLoaded, totalImages]);
  
  // Complete loading when both data is loaded and minimum time has elapsed
  useEffect(() => {
    if (allDataLoaded && minTimeElapsed) {
      // Set play state to true in Redux
      dispatch(setPlay(true));
      // Store that the user has seen the popup for this session
      sessionStorage.setItem("hasSeenAdPopUp", "true");
      // Notify parent component that loading is complete
      onLoadComplete();
    }
  }, [allDataLoaded, minTimeElapsed, dispatch, onLoadComplete]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black z-[9999]">
      <div className="flex flex-col items-center">
        <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-white mt-4 text-lg font-semibold">
          Loading... {progress}%
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen; 