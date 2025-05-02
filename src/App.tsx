/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import Routing from "./routes/Routing";
import { useDispatch, useSelector } from "react-redux";
import { setPanding } from "./store/slices/ModelSlice";
import ErrorToast from "./page/home/services/ErrorToast";

import { Toaster } from "./components/ui/toaster";
import { useGetApplicationAdsQuery } from "./store/api/explore/exploreApi";
import { initDeviceInfoListener } from "./lib/deviceInfo";
import guide from './assets/guide.webp';

const App = () => {
  const { panding } = useSelector((state: any) => state.model);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data } = useGetApplicationAdsQuery("");

  const [isMobileBrowser, setIsMobileBrowser] = useState(false);
  const dispatch = useDispatch();
  const [showInAppBrowserAlert, setShowInAppBrowserAlert] = useState(false);

  useEffect(() => {
    // Function to check if the user is on a mobile browser
    const checkIfMobileBrowser = () => {
      const userAgent = navigator.userAgent;
      const isAndroid = /Android/i.test(userAgent); // Check only for Android

      setIsMobileBrowser(isAndroid);
    };

    // Function to adjust the height of the video element
    const adjustVideoHeight = () => {
      const videoElement = document.querySelector(".video") as HTMLElement | null;
      const videoElement1 = document.querySelector(".video1") as HTMLElement | null;
      const videoFooter = document.querySelector(".videoFooter") as HTMLElement | null;
      
      if (videoElement && isMobileBrowser) {
        // Adjusted height for mobile browsers
        videoElement.style.height = "calc(100dvh - 64px)";
      }
      
      if (videoFooter && isMobileBrowser) {
        // Adjusted height for mobile browsers
        videoFooter.style.bottom = "40px";
      }

      if (videoElement1 && isMobileBrowser) {
        // Adjusted height for mobile browsers
        videoElement1.style.height = "calc(100dvh - 0px)";
      }
    };

    // Check if the user is on a mobile browser
    checkIfMobileBrowser();

    // Adjust the height initially
    adjustVideoHeight();

    // Add a resize event listener to handle viewport changes
    window.addEventListener("resize", adjustVideoHeight);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", adjustVideoHeight);
    };
  }, [isMobileBrowser]);

  useEffect(() => {
    const isAndroid = /Android/i.test(navigator.userAgent);
    if (isAndroid) {
      document.body.classList.add("android");
      document.body.classList.remove("not-android");
    } else {
      document.body.classList.add("not-android");
      document.body.classList.remove("android");
    }
  }, []);

  // Now we check if landing has been seen this session or not
  useEffect(() => {
    const hasSeenLanding = sessionStorage.getItem("hasSeenLanding");
    if (!hasSeenLanding) {
      dispatch(setPanding(true));
    }
  }, [dispatch]);

  useEffect(() => {
    // Initialize device info listener
    initDeviceInfoListener();
  }, []);

  const sendNativeEvent = (message: string) => {
    if (
      (window as any).webkit &&
      (window as any).webkit.messageHandlers &&
      (window as any).webkit.messageHandlers.jsBridge
    ) {
      (window as any).webkit.messageHandlers.jsBridge.postMessage(message);
    }
  };

  useEffect(() => {
    if (panding) {
      sendNativeEvent("beabox_ads_started");
    } else {
      sendNativeEvent("beabox_home_started");
    }
  }, [panding]);

  const detectInAppBrowser = () => {
    const ua = navigator.userAgent.toLowerCase();
    return {
      inWeChat: ua.indexOf('micromessenger') !== -1,
      inAlipay: ua.indexOf('alipayclient') !== -1,
      inWeibo: ua.indexOf('weibo') !== -1,
      inQQ: ua.indexOf('qq/') !== -1,
      inDouyin: ua.includes('douyin'),
      inToutiao: ua.includes('newsarticle')
    };
  };

  useEffect(()=>{
    const browserInfo = detectInAppBrowser();
    if (browserInfo.inWeChat || browserInfo.inAlipay || browserInfo.inWeibo || browserInfo.inQQ) {
      setShowInAppBrowserAlert(true);
    } 
  },[]);

  return (
    <>
      {!showInAppBrowserAlert && 
      <>
        <Routing />
        <Toaster />
        <ErrorToast />
      </>}
      {showInAppBrowserAlert && (
            <div className="fixed w-full h-screen bg-white z-[3000] top-0 left-0">
            <div className="w-full z-[1300] absolute h-full flex justify-center items-center">
              <div className="text-[14px] bg-white rounded-lg text-center relative max-w-md w-full">
                <div className="relative w-full">
                  <img
                    src={guide}
                    alt=""
                    className="w-full h-dvh object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
          )}
    </>
  );
};

export default App;
