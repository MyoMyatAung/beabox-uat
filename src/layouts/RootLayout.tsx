/* eslint-disable @typescript-eslint/no-explicit-any */
import { BottomNav } from "@/components/shared/bottom-nav";
import PopUp from "./PopUp";
import { useEffect, useState } from "react";
import { useGetApplicationAdsQuery } from "@/store/api/explore/exploreApi";
import { useDispatch, useSelector } from "react-redux";
import { setApplicationData, setisLoading } from "@/store/slices/exploreSlice";
import AuthDrawer from "@/components/profile/auth/auth-drawer";
import AlertToast from "@/components/shared/alert-toast";
import { setPlay } from "@/page/home/services/playSlice";
import AlertRedirect from "./AlertRedirect";
import { useGetConfigQuery } from "@/page/home/services/homeApi";

const RootLayout = ({ children }: any) => {
  const [showAd, setShowAd] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false);
  const [deviceType, setDeviceType] = useState<"IOS" | "Android" | "">("");
  const [jumpUrl, setJumpUrl] = useState("");
  
  const { data: config } = useGetConfigQuery({});
  const dispatch = useDispatch();
  
  useEffect(() => {
    const hasSeenAdPopUp = sessionStorage.getItem("hasSeenAdPopUp");
    if (hasSeenAdPopUp) {
      dispatch(setPlay(true));
    }
    if (!hasSeenAdPopUp) {
      setShowAd(true);
      sessionStorage.setItem("hasSeenAdPopUp", "true");
    }
  }, []);

  const { data, isLoading } = useGetApplicationAdsQuery("");

  useEffect(() => {
    if (data?.data) {
      dispatch(setApplicationData(data?.data));
      dispatch(setisLoading(isLoading));
    }
  }, [data, dispatch]);

  // Detect device type and browser
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();

    // Check if it's iOS
    if (userAgent.includes("iphone") || userAgent.includes("ipad") || userAgent.includes("ipod")) {
      setDeviceType("IOS");
      
      // Check if it's a WebView (AppleWebKit but no Safari or Version)
      if (
        userAgent.includes("applewebkit") &&
        !userAgent.includes("safari") &&
        !userAgent.includes("version")
      ) {
        setIsBrowser(false); // It's a WebView
      } else {
        setIsBrowser(true); // It's Safari (regular browser)
      }
    } 
    // Check if it's Android
    else if (userAgent.includes("android")) {
      setDeviceType("Android");
      setIsBrowser(true); // Assume browser for Android
    } 
    // For any other device
    else {
      setIsBrowser(true);
    }
  }, []);

  // Set the jumpUrl based on deviceType when config is loaded
  useEffect(() => {
    if (config?.data?.dialog_config && deviceType) {
      const dialogConfigItem = config.data.dialog_config.find(
        (item: any) => item.device === deviceType
      );
      
      if (dialogConfigItem && dialogConfigItem.jump_url) {
        setJumpUrl(dialogConfigItem.jump_url);
      }
    }
  }, [config, deviceType]);

  const isOpen = useSelector((state: any) => state.profile.isDrawerOpen);

  return (
    <div style={{ height: "calc(100dvh - 95px);" }}>
      {children}
      {/* <RightSideActions /> */}
      {showAd && (
        <PopUp
          setShowAd={setShowAd}
          setShowAlert={setShowAlert}
          isBrowser={isBrowser}
        />
      )}
      {!showAd && showAlert && isBrowser && jumpUrl && (
        <AlertRedirect
          setShowAlert={setShowAlert}
          app_download_link={jumpUrl}
        />
      )}
      {isOpen ? <AuthDrawer /> : <></>}

      <AlertToast />
      <div className="fixed bottom-0 left-0 w-full z-[1600]">
        <BottomNav />
      </div>
    </div>
  );
};

export default RootLayout;
