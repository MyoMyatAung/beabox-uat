/* eslint-disable @typescript-eslint/no-explicit-any */
import { BottomNav } from "@/components/shared/bottom-nav";
import PopUp from "./PopUp";
import { useEffect, useState, useRef } from "react";
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
import AnimationLoader from "@/components/shared/animation-loader";
import countdownAnimation from "@/lotties/Animation.json";
import luckySpinAnimation from "@/lotties/SpinWheel.json";
import fabAnimation from "@/lotties/Welfare.json";
import {
  useGetCurrentEventQuery,
  useLazyGetEventDetailsQuery,
} from "@/store/api/events/eventApi";
import CloseSvg from "@/assets/icons/Close.svg";
import { RootState } from "@/store/store";
import { useNavigate, useLocation } from "react-router-dom";
import { setIsDrawerOpen } from "@/store/slices/profileSlice";
import {
  setEventDetail,
  setAnimation,
  setDuration,
} from "@/store/slices/eventSlice";
import { useSearchParams } from "react-router-dom";
import { useGetUserByReferalQuery } from "@/page/event/eventApi";
import EventBox from "@/page/event/EventBox";
import RegisterDrawer from "@/components/profile/auth/register-drawer";
import { EventDetail } from "@/@types/lucky_draw";
import DEventBox from "@/page/event/dragon/DEventBox";
import { motion, AnimatePresence } from "framer-motion";
import { useLuckySpinManager } from "./useLuckySpinManager";

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
  const [userHasClosedAnimation, setUserHasClosedAnimation] = useState(
    sessionStorage.getItem("animationClosed") === "true"
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

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
  const user = useSelector((state: any) => state.persist.user);
  const currentTab = useSelector((state: any) => state.home.currentTab);
  const hideBar = useSelector((state: RootState) => state.hideBarSlice.hideBar);
  const [showEvent, setShowEvent] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // const [showLuckySpin, setShowLuckySpin] = useState(false);
  const [luckySpinWebUrl, setLuckySpinWebUrl] = useState("");
  const { data: eventData } = useGetUserByReferalQuery(
    { referral_code: referCode }, // or safely cast if you're confident it's a string
    { skip: !referCode }
  );

  useEffect(() => {
    if (eventData?.data?.event?.status && !box && !user) {
      setEvent(eventData?.data?.event?.status);
    }
  }, [eventData, event]);

  const { data: config } = useGetConfigQuery({});

  // Skip the API query since LoadingScreen handles it
  useGetApplicationAdsQuery("", { skip: true });

  const { data: currentEventData } = useGetCurrentEventQuery("");
  const [triggerGetEventDetails] = useLazyGetEventDetailsQuery();
  const showAnimation = useSelector(
    (state: RootState) => state.event.isShowAnimation
  );
  const currentDuration = useSelector(
    (state: RootState) => state.event.event_start_time
  );

  const isOpen = useSelector((state: any) => state.profile.isDrawerOpen);

  const [cachedEventDetails, setCachedEventDetails] = useState<{
    data: EventDetail;
  } | null>(null);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const { showLuckySpin, openLuckySpin, closeLuckySpin } =
    useLuckySpinManager();
  const isFetchingRef = useRef(false);

  console.log("currentEventData is=>", luckySpinWebUrl);

  useEffect(() => {
    // dev
    // const webUrl = "http://192.168.100.105:5001/";
    // const webUrl = 'https://bespoke-piroshki-8ed2b8.netlify.app/';
    // prod
    const webUrl = currentEventData?.data.filter((x: any) => x.type === 'spin-wheel')[0]?.web_url;
    setLuckySpinWebUrl(webUrl);
    if (showAd && showAlert && isOpen && !showLanding) {
      dispatch(setAnimation(false));
    } else {
      if (currentEventData?.data && !userHasClosedAnimation) {
        if (
          currentEventData?.status === true &&
          !showAd &&
          // !showAlert &&
          !isOpen
        ) {
          const timeout = setTimeout(() => {
            dispatch(setAnimation(true));
          }, 5000);
          return () => clearTimeout(timeout);
        } else {
          dispatch(setAnimation(false));
        }
      }
      if (userHasClosedAnimation) {
        dispatch(setAnimation(false));
      }
    }
  }, [
    currentEventData?.status,
    dispatch,
    showAd,
    showLanding,
    showAlert,
    userHasClosedAnimation,
  ]);

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

  // Preload the lucky draw component and prefetch event details
  useEffect(() => {
    const shouldPreload =
      !showAd &&
      !showAlert &&
      !isOpen &&
      location.pathname === "/" &&
      !event &&
      showAnimation &&
      currentTab === 2;

    if (shouldPreload) {
      // Preload the component
      import("@/page/events/Luckydraw");

      // Prefetch event details
      const prefetchEventDetails = async () => {
        const eventId = currentEventData?.data?.filter(
          (x: any) => x.type === "event"
        )[0]?.id;
        if (!eventId || isFetchingRef.current) return;

        try {
          isFetchingRef.current = true;
          setIsFetchingDetails(true);
          const eventDetails = await triggerGetEventDetails(eventId).unwrap();
          console.log("eventDetails is=>", eventDetails);
          setCachedEventDetails(eventDetails);
          // Don't dispatch to Redux yet, wait for click
        } catch (error) {
          console.error("Failed to prefetch event details:", error);
        } finally {
          setIsFetchingDetails(false);
          isFetchingRef.current = false;
        }
      };

      prefetchEventDetails();
    }
  }, [
    showAd,
    showAlert,
    isOpen,
    location.pathname,
    event,
    showAnimation,
    currentTab,
    currentEventData?.data?.id,
  ]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        if (event?.data?.type === "back_pressed") {
          closeLuckySpin();
          // window.history.pushState("", "/");
          // setShowLuckySpin(false);
          // sessionStorage.removeItem("showLuckySpin");
          return;
        }
        if (event?.data?.type === "withdraw") {
          navigate("wallet/withdraw");
          localStorage.setItem("showLuckySpin", "true");
          return;
        }
        if (event?.data?.type === "red_envelope") {
          // navigate("wallet/withdraw");
          handleAnimationClick();
          localStorage.setItem("showLuckySpin", "true");
          return;
        }
        if (event?.data?.type === "login") {
          console.log("Login message received from iframe");
          dispatch(setIsDrawerOpen(true));
          return;
        }
        sessionStorage.setItem("showLuckySpin", "false");
      } catch (error) {
        console.error("Error handling message from iframe:", error);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  // useEffect(() => {
  //   const shouldShowLuckySpin =
  //     sessionStorage.getItem("showLuckySpin") === "true";
  //   if (shouldShowLuckySpin) {
  //     setShowLuckySpin(true);
  //   }
  // }, [location.pathname]);

  const handleAnimationClick = async () => {
    // if (!user?.token) {
    //   dispatch(setIsDrawerOpen(true));
    //   return;
    // }
    const eventId = currentEventData?.data?.filter(
      (x: any) => x.type === "event"
    )[0]?.id;
    if (!eventId) return;

    // Immediately use cached data if available
    if (cachedEventDetails) {
      dispatch(setEventDetail(cachedEventDetails.data));
      if (cachedEventDetails.data?.event_start_time) {
        dispatch(setDuration(cachedEventDetails.data.event_start_time));
      }
      navigate(`/events/lucky-draw/${eventId}`);

      // Refresh in background
      try {
        const freshEventDetails = await triggerGetEventDetails(
          eventId
        ).unwrap();
        dispatch(setEventDetail(freshEventDetails.data));
        if (freshEventDetails.data?.event_start_time) {
          dispatch(setDuration(freshEventDetails.data.event_start_time));
        }
      } catch (error) {
        console.error("Failed to refresh event details:", error);
      }
      return;
    }

    // If no cached data, fetch synchronously
    try {
      const eventDetails = await triggerGetEventDetails(eventId).unwrap();
      dispatch(setEventDetail(eventDetails.data));
      if (eventDetails.data?.event_start_time) {
        dispatch(setDuration(eventDetails.data.event_start_time));
      }
      navigate(`/events/lucky-draw/${eventId}`);
    } catch (error) {
      console.error("Failed to fetch event details:", error);
    }
  };

  // useEffect(() => {
  //   if (location.pathname !== "/detail") {
  //     setShowLuckySpin(false);
  //     sessionStorage.removeItem("showLuckySpin");
  //   }
  // }, [location.pathname]);

  // useEffect(() => {
  //   const handleBackNavigation = () => {
  //     // When user goes back, check if we should hide the lucky spin
  //     if (showLuckySpin) {
  //       window.history.pushState("", "/");
  //       window.history.back();
  //       setShowLuckySpin(false);
  //       sessionStorage.removeItem("showLuckySpin");
  //     }
  //   };

  //   // Add event listener for popstate (triggered by back navigation)
  //   window.addEventListener("popstate", handleBackNavigation);

  //   // Clean up the event listener when component unmounts
  //   return () => {
  //     window.removeEventListener("popstate", handleBackNavigation);
  //   };
  // }, [showLuckySpin]);

  const handleLuckySpinClick = () => {
    // if (!user?.token) {
    //   dispatch(setPlay(false));
    //   dispatch(setIsDrawerOpen(true));
    //   return;
    // }
    // dispatch(setPlay(false));
    // window.history.pushState({ fake: true }, "", "/detail");
    // setShowLuckySpin(true);
    // dispatch(setPlay(false));
    openLuckySpin();
    // Push a new state to history when opening the lucky spin
    // window.history.pushState({ showLuckySpin: true }, "", "/detail");
    // // setShowLuckySpin(true);
    // sessionStorage.setItem("showLuckySpin", "true");
  };

  // const sendTokenEvent = () => {
  //   console.log("sendTokenEvent called with user token:", user?.token);
  //   if (user?.token) {
  //     console.log("winn");
  //     const access_token = {
  //       type: "access_token",
  //       data: { access_token: user?.token },
  //     };
  //     if (iframeRef.current?.contentWindow) {
  //       iframeRef.current.contentWindow.postMessage(
  //         access_token,
  //         luckySpinWebUrl
  //       );
  //     }
  //   }
  // };

  // Remove the eslint-disable comment and fix the hook
  useEffect(() => {
    const sendTokenEvent = () => {
      if (user?.token && showLuckySpin) {
        const access_token = {
          type: "access_token",
          data: { access_token: user?.token },
        };
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage(
            access_token,
            luckySpinWebUrl
          );
        }
      }
    };

    sendTokenEvent();
  }, [user?.token, showLuckySpin]);

  // // eslint-disable-next-line react-hooks/rules-of-hooks
  // useEffect(() => {
  //   sendTokenEvent();
  // }, [user?.token]);

  // if (showLuckySpin) {
  //   sendTokenEvent();
  // }

  // If loading, show loading screen
  if (isLoading) {
    return <LoadingScreen onLoadComplete={handleLoadComplete} />;
  }

  // After loading, show Landing
  if (showLanding) {
    return <Landing onComplete={handleLandingComplete} />;
  }

  return (
    <>
      <div
        style={{
          height: "calc(100dvh - 95px);",
          display: !showLuckySpin ? "block" : "none",
        }}
      >
        {children}

        {event && !box && !isOpenNew && !user && (
          <DEventBox
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
            geetest_id={code}
          />
        )}

        {showAd && !event && (
          <PopUp
            setShowAd={setShowAd}
            setShowAlert={setShowAlert}
            isBrowser={isBrowser}
            onComplete={handleAdComplete}
          />
        )}
        {!showAd &&
          showAlert &&
          isBrowser &&
          jumpUrl &&
          showDialog &&
          !event && (
            <AlertRedirect
              event={event}
              setShowAlert={setShowAlert}
              app_download_link={jumpUrl}
            />
          )}

        <AlertToast />
        <div className="fixed bottom-0 left-0 w-full z-[1600]">
          <BottomNav />
        </div>

        {!showAd &&
          // !showAlert &&
          !isOpen &&
          location.pathname === "/" &&
          !event &&
          showAnimation &&
          currentTab === 2 &&
          !hideBar &&
          !userHasClosedAnimation && (
            <>
              <AnimatePresence>
                {showEvent && (
                  <>
                    <motion.div
                      key="countdown"
                      className="fixed bottom-[22rem] left-2 z-[9999] rounded-full p-2"
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 100, opacity: 0 }}
                      transition={{
                        type: "spring",
                        damping: 20,
                        stiffness: 300,
                      }}
                    >
                      <div className="relative">
                        <AnimationLoader
                          animationData={countdownAnimation}
                          width={110}
                          onClick={handleAnimationClick}
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      key="luckySpin"
                      className="fixed bottom-[19rem] left-4 z-[9999] rounded-full p-2"
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 100, opacity: 0 }}
                      transition={{
                        type: "spring",
                        damping: 20,
                        stiffness: 300,
                        delay: 0.1,
                      }}
                    >
                      <div className="relative">
                        <AnimationLoader
                          animationData={luckySpinAnimation}
                          width={85}
                          height={100}
                          onClick={handleLuckySpinClick}
                        />
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
              <div className="fixed bottom-[12rem] left-1 z-[9999] rounded-full p-2">
                <div className="relative">
                  <button
                    className="absolute top-1 right-2 bg-red rounded-full w-5 h-5 flex items-center justify-center text-black z-[10000]"
                    onClick={() => {
                      dispatch(setAnimation(false));
                      setUserHasClosedAnimation(true);
                      sessionStorage.setItem("animationClosed", "true");
                    }}
                  >
                    <img src={CloseSvg} />
                  </button>
                  <AnimationLoader
                    animationData={fabAnimation}
                    width={100}
                    height={100}
                    onClick={() => setShowEvent(!showEvent)}
                  />
                </div>
              </div>
            </>
          )}
      </div>
      {isOpen ? <AuthDrawer /> : <></>}
      <div
        className="h-dvh w-screen fixed top-0 left-0 z-[999]"
        style={{ display: showLuckySpin ? "block" : "none" }}
      >
        <iframe
          ref={iframeRef}
          src={luckySpinWebUrl}
          className="w-full h-full border-0"
          style={{ display: showLuckySpin ? "block" : "none" }}
          title="Spin Game"
        />
        {/* {/* {isOpen ? <AuthDrawer /> : <></>} */}
      </div>
    </>
  );
};

export default RootLayout;
