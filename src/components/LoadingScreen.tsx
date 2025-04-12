import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setApplicationData, setisLoading } from "@/store/slices/exploreSlice";
import { setPlay } from "@/page/home/services/playSlice";
import { useGetAdsPopUpQuery } from "@/utils/helperService";
import { useGetAdsNoticeQuery } from "@/store/api/explore/exploreApi";
import { useGetApplicationAdsQuery } from "@/store/api/explore/exploreApi";
import { useGetConfigQuery } from "@/page/home/services/homeApi";
import splashVideo from '@/assets/splash.mp4';
import logo from '@/assets/b_logo.webp';

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
  const [currentQuote, setCurrentQuote] = useState("");

  // Quotes collection
  const quotes = [
    "愿兄弟胸怀壮志，前程似锦。",
    "愿兄弟风雨兼程，未来可期。",
    "愿兄弟策马扬鞭，傲立天地间。",
    "愿兄弟壮志凌云，笑看人生路。",
    "愿兄弟初心不改，一往无前。",
    "愿兄弟脚踏实地，步步高升。",
    "愿兄弟仗剑天涯，傲然前行。",
    "愿兄弟豪情万丈，功成名就。",
    "愿兄弟心怀山海，追梦无悔。",
    "愿兄弟锐意进取，志在四方。",
    "愿兄弟壮怀激烈，大展宏图。",
    "愿兄弟豪迈前行，一路高歌。",
    "愿兄弟踏浪逐风，直挂云帆。",
    "愿兄弟乘势而起，开创辉煌。",
    "愿兄弟奋勇前进，未来无限。",
    "愿兄弟志存高远，前程坦荡。",
    "愿兄弟怀揣梦想，昂首前行。",
    "愿兄弟逐梦天涯，所向披靡。",
    "愿兄弟志在千里，扬帆起航。",
    "愿兄弟笑对风云，敢为人先。",
    "愿兄弟心怀坦荡，行稳致远。",
    "愿兄弟一路披荆斩棘，直抵梦想。",
    "愿兄弟斗志昂扬，功业长青。",
    "愿兄弟踏歌而行，未来辉煌。",
    "愿兄弟不忘初心，所愿皆成。",
    "愿兄弟志气如虹，名扬四海。",
    "愿兄弟快意人生，乘风而上。",
    "愿兄弟昂扬斗志，笑看风云。",
    "愿兄弟江湖纵横，精彩无限。",
    "愿兄弟自律笃行，终成大器。"
  ];
  
  // API queries
  const { data: adsPopUpData, isLoading: adsPopUpLoading } = useGetAdsPopUpQuery();
  const { data: adsNoticeData, isLoading: adsNoticeLoading } = useGetAdsNoticeQuery("");
  const { data: applicationAdsData, isLoading: applicationAdsLoading } = useGetApplicationAdsQuery("");
  const { data: configData, isLoading: configLoading } = useGetConfigQuery({});

  // Choose a single random quote when component mounts
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(quotes[randomIndex]);
    // No interval for quote rotation anymore
  }, []);

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
    <div className="fixed inset-0 flex flex-col items-center justify-center z-[9999] font-['Noto_Sans_SC',sans-serif]">
      <div className="w-full h-full relative overflow-hidden">
        {/* Video Background */}
        <video 
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src={splashVideo} type="video/mp4" />
        </video>
        
        {/* Blur Overlay */}
        <div className="absolute inset-0 backdrop-blur-md"></div>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        
        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full">
          {/* Logo */}
          <img 
            className="w-[140px] mb-3 animate-[slideDown_1s_ease_forwards]" 
            src={logo}
            alt="App Logo"
          />
          
          {/* Quote Container */}
          <div className="text-center px-6 mb-6">
            <p className="my-1.5 text-lg leading-normal text-white text-opacity-95">
              真正的享受，来自于克制后的自由，
            </p>
            <p className="my-1.5 text-lg leading-normal text-white text-opacity-95">
              {currentQuote}
            </p>
          </div>
          
          {/* Progress Bar */}
          <div className="w-4/5 text-center">
            <div className="w-full h-1.5 bg-white bg-opacity-15 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#de62f5] to-[#a848ec] transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="mt-2 text-sm text-white text-opacity-80">
              正在为您加载最优线路 <span className="text-[#de62f5] font-bold ml-1">{progress}%</span>
            </div>
          </div>
          
          {/* Footer Text */}
          <div className="absolute bottom-4 w-full text-center text-xs text-white text-opacity-60 px-4">
            本软件不适合未成年人使用，如果您未满18岁请立刻离开。<br/>
            © 笔盒@2025 ｜ 联系邮箱：zhaohui@beabox.net
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen; 