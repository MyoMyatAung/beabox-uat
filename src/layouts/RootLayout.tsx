/* eslint-disable @typescript-eslint/no-explicit-any */
import { BottomNav } from "@/components/shared/bottom-nav";
import PopUp from "./PopUp";
import { useEffect, useState } from "react";
import { useGetApplicationAdsQuery } from "@/store/api/explore/exploreApi";
import { useSelector, useDispatch } from "react-redux";
import AuthDrawer from "@/components/profile/auth/auth-drawer";
import AlertToast from "@/components/shared/alert-toast";
import AlertRedirect from "./AlertRedirect";
import { useGetConfigQuery } from "@/page/home/services/homeApi";
import LoadingScreen from "@/components/LoadingScreen";
import Landing from "@/components/Landing";
import { setPlay } from "@/page/home/services/playSlice";
import UserFeed from "@/components/UserFeed";
import { useSearchParams } from "react-router-dom";
import { useGetUserByReferalQuery } from "@/page/event/eventApi";
import EventBox from "@/page/event/EventBox";
import EventResultBox from "@/page/event/EventResultBox";
import EventCaptcha from "@/page/event/EventCaptcha";
import RegisterDrawer from "@/components/profile/auth/register-drawer";

// Function to check if the app is running in a WebView
function isWebView() {
  return (
    (window as any).webkit &&
    (window as any).webkit.messageHandlers &&
    (window as any).webkit.messageHandlers.jsBridge
  );
}

const RootLayout = ({ children }: any) => {
  const [showAd, setShowAd] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false);
  const [deviceType, setDeviceType] = useState<"IOS" | "Android" | "">("");
  const [jumpUrl, setJumpUrl] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLanding, setShowLanding] = useState(false);
  const dispatch = useDispatch();
  const isFirstTime = localStorage.getItem("isFirstTimeUser");
  const [event, setEvent] = useState(false);
  const [shownextBox, setshownextBox] = useState(false);

  const [userPers, setUserPers] = useState(false);
  const [searchParams] = useSearchParams();
  const referCode = searchParams.get("refer");
  const [box, setBox] = useState(false);
  const [isOpenNew, setIsOpenNew] = useState(false);
  const [code, setCode] = useState("");
  const [newData, setnewData] = useState(null);

  const { data: eventData } = useGetUserByReferalQuery(
    { referral_code: referCode }, // or safely cast if you're confident it's a string
    { skip: !referCode }
  );

  useEffect(() => {
    if (eventData?.data?.event?.status && !box) {
      setEvent(eventData?.data?.event?.status);
    }
  }, [eventData, event]);

  // console.log(" here ", event, eventData);
  const { data: config } = useGetConfigQuery({});

  // Skip the API query since LoadingScreen handles it
  useGetApplicationAdsQuery("", { skip: true });

  // Check if ads have already been seen in this session
  useEffect(() => {
    const hasSeenAdPopUp = sessionStorage.getItem("hasSeenAdPopUp");
    const hasSeenLanding = sessionStorage.getItem("hasSeenLanding");

    if (hasSeenAdPopUp && hasSeenLanding) {
      // User has already seen ads in this session, skip loading and ads
      dispatch(setPlay(true));
      sendNativeEvent("beabox_home_started");
    } else {
      // User hasn't seen ads in this session, show loading screen
      setIsLoading(true);
      sendNativeEvent("beabox_ads_started");
    }
  }, [dispatch]);

  // Native event sending function
  const sendNativeEvent = (message: string) => {
    if (isWebView()) {
      (window as any).webkit.messageHandlers.jsBridge.postMessage(message);
    }
  };

  // Detect device type and browser
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();

    // Set isBrowser based on WebView detection
    setIsBrowser(!isWebView());

    // Determine device type
    if (
      userAgent.includes("iphone") ||
      userAgent.includes("ipad") ||
      userAgent.includes("ipod")
    ) {
      setDeviceType("IOS");
    } else if (userAgent.includes("android")) {
      setDeviceType("Android");
    }
  }, []);

  // Set the jumpUrl based on deviceType when config is loaded
  useEffect(() => {
    if (config?.data?.dialog_config && deviceType) {
      const dialogConfigItem = config.data.dialog_config.find(
        (item: any) => item.device === deviceType
      );

      if (dialogConfigItem) {
        if (dialogConfigItem.jump_url) {
          setJumpUrl(dialogConfigItem.jump_url);
        }

        // Set showDialog based on dialogConfigItem.show_dialog
        const shouldShowDialog =
          dialogConfigItem.show_dialog === 1 ||
          dialogConfigItem.show_dialog === true ||
          dialogConfigItem.show_dialog === "1" ||
          dialogConfigItem.show_dialog === "true";
        setShowDialog(shouldShowDialog);
      }
    }
  }, [config, deviceType]);

  // Handle when loading screen completes
  const handleLoadComplete = () => {
    setIsLoading(false);
    setShowLanding(true); // Show Landing screen after loading
    // Mark that landing screen has been shown in this session
    sessionStorage.setItem("hasSeenLanding", "true");
  };

  // Handle when Landing screen completes
  const handleLandingComplete = () => {
    setShowLanding(false);
    // if (!isFirstTime) {
    //   setUserPers(true);
    // }

    setShowAd(true); // Show PopUp after Landing
  };

  // Handle when all ads are completed
  const handleAdComplete = () => {
    setShowAd(false);
    // Ensure video plays after ads are completed

    if ((jumpUrl && showDialog) || event) {
      dispatch(setPlay(false));
    } else {
      dispatch(setPlay(true));
    }

    sendNativeEvent("beabox_home_started");
  };

  useEffect(() => {
    if (event) {
      dispatch(setPlay(false));
    }
  }, [event]);

  const isOpen = useSelector((state: any) => state.profile.isDrawerOpen);

  // If loading, show loading screen
  if (isLoading) {
    return <LoadingScreen onLoadComplete={handleLoadComplete} />;
  }

  // After loading, show Landing
  if (showLanding) {
    return <Landing onComplete={handleLandingComplete} />;
  }

  // if (userPers) {
  //   return (
  //     <UserFeed setUserPers={setUserPers} config={config} />
  //   );
  // }

  return (
    <div style={{ height: "calc(100dvh - 95px);" }}>
      {children}

      {event && !box && !isOpenNew && !showAd && (
        <EventBox
          setshownextBox={setshownextBox}
          shownextBox={shownextBox}
          eventData={eventData}
          setBox={setBox}
          referCode={referCode}
          isOpen={isOpenNew}
          setIsOpen={setIsOpenNew}
          setCode={setCode}
          newData={newData}
          setnewData={setnewData}
          setEvent={setEvent}
        />
      )}
      {isOpenNew && (
        <RegisterDrawer
          isOpen={isOpenNew}
          setIsOpen={setIsOpenNew}
          code={referCode}
        />
      )}
      {/* {box && (
        <EventCaptcha />
        // <EventResultBox
        //   eventData={eventData}
        //   setBox={setBox}
        //   setEvent={setEvent}
        // />
      )} */}

      {showAd && (
        <PopUp
          setShowAd={setShowAd}
          setShowAlert={setShowAlert}
          isBrowser={isBrowser}
          onComplete={handleAdComplete}
        />
      )}
      {!showAd && showAlert && isBrowser && jumpUrl && showDialog && (
        <AlertRedirect
          event={event}
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
