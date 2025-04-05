/* eslint-disable @typescript-eslint/no-explicit-any */
import { BottomNav } from "@/components/shared/bottom-nav";
import PopUp from "./PopUp";
import { useEffect, useState } from "react";
import { useGetApplicationAdsQuery } from "@/store/api/explore/exploreApi";
import { useDispatch, useSelector } from "react-redux";
import { setApplicationData, setisLoading } from "@/store/slices/exploreSlice";
import RegisterForm from "@/components/profile/auth/register-form";
import LoginForm from "@/components/profile/auth/login-form";
import AuthDrawer from "@/components/profile/auth/auth-drawer";
import AlertToast from "@/components/shared/alert-toast";
import { setPlay } from "@/page/home/services/playSlice";
import AlertRedirect from "./AlertRedirect";
import { useGetConfigQuery } from "@/page/home/services/homeApi";

const RootLayout = ({ children }: any) => {
  const [showAd, setShowAd] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false);
  const { data: conig } = useGetConfigQuery({});
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

  const app_download_link = conig?.data?.app_download_link;

  useEffect(() => {
    if (data?.data) {
      const cur = data?.data?.carousel;
      dispatch(setApplicationData(data?.data));
      dispatch(setisLoading(isLoading));
      // setApplicationData(data?.data);
      // setad(cur);
    }
  }, [data, dispatch]);

  // Detect if it's a browser (not an iOS app)
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();

    // Check if the device is an iPhone or iPad in a WebView or a regular browser
    if (userAgent.includes("iphone") || userAgent.includes("ipad")) {
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
    } else {
      // For non-iOS devices, just assume it's a regular browser if it's mobile or desktop
      setIsBrowser(true);
    }
  }, []);

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
      {!showAd && showAlert && isBrowser && app_download_link && (
        <AlertRedirect
          setShowAlert={setShowAlert}
          app_download_link={app_download_link}
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
