import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation, useSearchParams, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setPlay } from "@/page/home/services/playSlice";
import { sethideNew } from "@/page/home/services/hideNewSlice";
import {
  setEventDetail,
  setAnimation,
  setDuration,
} from "@/store/slices/eventSlice";
import { setShowUserGuide } from "@/store/slices/appSlice";
import { motion, AnimatePresence } from "framer-motion";
import { useGetApplicationAdsQuery } from "@/store/api/explore/exploreApi";
import {
  useGetConfigQuery,
  useGetNotificationsQuery,
} from "@/page/home/services/homeApi";
import {
  useGetCurrentEventQuery,
  useLazyGetEventDetailsQuery,
} from "@/store/api/events/eventApi";
import { useGetUserByReferalQuery } from "@/page/event/eventApi";
import { BottomNav } from "@/components/shared/bottom-nav";
import AuthDrawer from "@/components/profile/auth/auth-drawer";
import RegisterDrawer from "@/components/profile/auth/register-drawer";
import AlertToast from "@/components/shared/alert-toast";
import AnimationLoader from "@/components/shared/animation-loader";
import LoadingScreen from "@/components/LoadingScreen";
import Landing from "@/components/Landing";
import ImmersiveUserGuide from "@/components/ImmersiveUserGuide";
import PopUp from "./PopUp";
import AlertRedirect from "./AlertRedirect";
import PasswordSetUpPopUp from "./PasswordSetUpPopUp";
import NotiPopUp from "./NotiPopUp";
import DEventBox from "@/page/event/EventBox";

import countdownAnimation from "@/lotties/Animation.json";
import luckySpinAnimation from "@/lotties/SpinWheel.json";
import fabAnimation from "@/lotties/Welfare.json";
import CloseSvg from "@/assets/icons/Close.svg";
import { isIOSWebView } from "@/lib/deviceInfo";
import { EventDetail } from "@/@types/lucky_draw";

const APP_CONFIG = {
  ANIMATION_DELAY: 5000,
  SPLASH_DELAY: 1000,
  ANIMATION_SIZES: {
    COUNTDOWN: { width: 110 },
    LUCKY_SPIN: { width: 85, height: 100 },
    FAB: { width: 100, height: 100 },
  },
  ANIMATION_POSITIONS: {
    COUNTDOWN: "bottom-[calc(22rem+16px)] left-2",
    LUCKY_SPIN: "bottom-[calc(19rem+16px)] left-4",
    FAB: "bottom-[calc(12rem+16px)] left-1",
  },
  SPRING_CONFIG: {
    type: "spring",
    damping: 20,
    stiffness: 300,
  },
} as const;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

// Function to check if the app is running in a WebView
function isWebView() {
  return (
    (window as any).webkit &&
    (window as any).webkit.messageHandlers &&
    (window as any).webkit.messageHandlers.jsBridge
  );
}

function sendNativeEvent(message: string) {
  if (isWebView()) {
    (window as any).webkit.messageHandlers.jsBridge.postMessage(message);
  }
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const RootLayout = () => {
  // =============================================================================
  // ROUTING AND NAVIGATION
  // =============================================================================
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const referCode = searchParams.get("refer");

  // =============================================================================
  // DEVICE AND BROWSER DETECTION STATE
  // =============================================================================
  const [isBrowser, setIsBrowser] = useState(false);
  const [deviceType, setDeviceType] = useState<"IOS" | "Android" | "">("");

  // =============================================================================
  // APP FLOW AND LOADING STATE
  // =============================================================================
  const isHome = location.pathname === "/";
  // Treat session flags as booleans
  const hasSeenAdPopUp = !!sessionStorage.getItem("hasSeenAdPopUp");
  const hasSeenLanding = !!sessionStorage.getItem("hasSeenLanding");

  const [isLoading, setIsLoading] = useState(false);
  const [showLanding, setShowLanding] = useState(false);
  // If user has already seen the landing screen on home, skip showing it again
  const [removeSplashScreen, setRemoveSplashScreen] = useState(
    isHome ? hasSeenLanding : true
  );
  // =============================================================================
  // AD AND POPUP STATE
  // =============================================================================
  const [showAd, setShowAd] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showNotiPopUp, setShowNotiPopUp] = useState(false);
  const [jumpUrl, setJumpUrl] = useState("");
  const [showPasswordSetUpPopUp, setShowPasswordSetUpPopUp] = useState(false);

  // =============================================================================
  // EVENT AND ANIMATION STATE
  // =============================================================================
  const [event, setEvent] = useState(false);
  const [showEvent, setShowEvent] = useState(false);
  const [shownextBox, setshownextBox] = useState(false);
  const [userHasClosedAnimation, setUserHasClosedAnimation] = useState(
    sessionStorage.getItem("animationClosed") === "true"
  );

  // =============================================================================
  // USER GUIDE STATE
  // =============================================================================

  // =============================================================================
  // REGISTRATION AND AUTH STATE
  // =============================================================================
  const [box, setBox] = useState(false);
  const [isOpenNew, setIsOpenNew] = useState(false);
  const [code, setCode] = useState("");
  const [newData, setnewData] = useState(null);

  // =============================================================================
  // REDUX STATE SELECTORS
  // =============================================================================
  const user = useSelector((state: any) => state.persist.user);
  const currentTab = useSelector((state: any) => state.home.currentTab);
  const hideBar = useSelector((state: RootState) => state.hideBarSlice.hideBar);
  const hideNew = useSelector((state: RootState) => state.hideNewSlice.hideNew);
  const isOpen = useSelector((state: any) => state.profile.isDrawerOpen);
  const showAnimation = useSelector(
    (state: RootState) => state.event.isShowAnimation
  );
  const showUserGuide = useSelector(
    (state: RootState) => state.app.showUserGuide
  );
  // =============================================================================
  // API QUERIES
  // =============================================================================
  const { data: eventData } = useGetUserByReferalQuery(
    { referral_code: referCode },
    { skip: !referCode }
  );
  const { data: notiMessage } = useGetNotificationsQuery({}, { skip: !isHome });
  const { data: config } = useGetConfigQuery({});
  const { data: currentEventData } = useGetCurrentEventQuery("");
  const [triggerGetEventDetails] = useLazyGetEventDetailsQuery();

  // Skip the API query since LoadingScreen handles it
  useGetApplicationAdsQuery("", { skip: true });

  // =============================================================================
  // EVENT CACHING STATE
  // =============================================================================
  const [cachedEventDetails, setCachedEventDetails] = useState<{
    data: EventDetail;
  } | null>(null);
  const [, setIsFetchingDetails] = useState(false);
  const isFetchingRef = useRef(false);
  // When landing has already been seen (or we're not on home), skip the intro transition animation
  const shouldSkipAnimationRef = useRef(hasSeenLanding || !isHome);

  // =============================================================================
  // EFFECT HOOKS - INITIALIZATION AND SESSION MANAGEMENT
  // =============================================================================

  // Initialize app based on session state
  useEffect(() => {
    // This would only be need if want to skip initial loading and ads
    if (hasSeenAdPopUp && hasSeenLanding) {
      dispatch(setPlay(true));
      sendNativeEvent("beabox_home_started");
    } else {
      setIsLoading(true);
      sendNativeEvent("beabox_ads_started");
    }
  }, [dispatch]);

  // =============================================================================
  // EFFECT HOOKS - DEVICE DETECTION AND CONFIG
  // =============================================================================

  // Detect device type and browser environment
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();

    setIsBrowser(!isWebView());

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

  // Configure app dialog based on device type
  useEffect(() => {
    if (config?.data?.dialog_config && deviceType) {
      const dialogConfigItem = config.data.dialog_config.find(
        (item: any) => item.device === deviceType
      );

      if (dialogConfigItem) {
        if (dialogConfigItem.jump_url) {
          setJumpUrl(dialogConfigItem.jump_url);
        }

        const shouldShowDialog =
          dialogConfigItem.show_dialog === 1 ||
          dialogConfigItem.show_dialog === true ||
          dialogConfigItem.show_dialog === "1" ||
          dialogConfigItem.show_dialog === "true";
        setShowDialog(shouldShowDialog);
      }
    }
  }, [config, deviceType]);

  // =============================================================================
  // EFFECT HOOKS - EVENT MANAGEMENT
  // =============================================================================

  // Handle event status from referral data
  useEffect(() => {
    if (eventData?.data?.event?.status && !box && !user) {
      setEvent(eventData?.data?.event?.status);
    }
  }, [eventData, event, box, user]);

  // Control play state based on event
  useEffect(() => {
    if (event) {
      dispatch(setPlay(false));
    }
  }, [event, dispatch]);

  // Control animation display logic
  useEffect(() => {
    if (showAd && showAlert && isOpen && !showLanding) {
      dispatch(setAnimation(false));
    } else {
      if (currentEventData?.data && !userHasClosedAnimation) {
        if (currentEventData?.status === true && !showAd && !isOpen) {
          const timeout = setTimeout(() => {
            dispatch(setAnimation(true));
          }, APP_CONFIG.ANIMATION_DELAY);
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
    currentEventData?.data,
    dispatch,
    showAd,
    showLanding,
    showAlert,
    isOpen,
    userHasClosedAnimation,
  ]);

  // =============================================================================
  // HANDLER FUNCTIONS
  // =============================================================================

  const handleLoadComplete = () => {
    setIsLoading(false);
    setShowLanding(true);
    sessionStorage.setItem("hasSeenLanding", "true");
  };

  const handleLandingComplete = () => {
    setShowLanding(false);
    setTimeout(() => {
      setRemoveSplashScreen(true);

      // Show ImmersiveUserGuide on every app mount, then ads
      dispatch(setShowUserGuide(true));
    }, 1000);
  };

  const handleAdComplete = () => {
    setShowAd(false);
    setShowNotiPopUp(true);
    if ((jumpUrl && showDialog) || event) {
      dispatch(setPlay(false));
    } else {
      dispatch(setPlay(true));
    }

    sendNativeEvent("beabox_home_started");
  };

  // Event animation handlers
  const handleAnimationClick = async () => {
    const eventId = currentEventData?.data?.filter(
      (x: any) => x.type === "event"
    )[0]?.id;
    if (!eventId) return;

    if (cachedEventDetails) {
      navigate(`/events/lucky-draw/${eventId}`);

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

  const handleLuckySpinClick = () => {
    navigate("/lucky");
  };

  // =============================================================================
  // EFFECT HOOKS - PERFORMANCE OPTIMIZATION
  // =============================================================================

  // Prefetch event details for better UX
  useEffect(() => {
    const prefetchEventDetails = async () => {
      const eventId = currentEventData?.data?.filter(
        (x: any) => x.type === "event"
      )[0]?.id;
      if (!eventId || isFetchingRef.current) return;

      try {
        isFetchingRef.current = true;
        setIsFetchingDetails(true);
        const eventDetails = await triggerGetEventDetails(eventId).unwrap();
        setCachedEventDetails(eventDetails);
        dispatch(setEventDetail(eventDetails.data));
        if (eventDetails.data?.event_start_time) {
          dispatch(setDuration(eventDetails.data.event_start_time));
        }
      } catch (error) {
        console.error("Failed to prefetch event details:", error);
      } finally {
        setIsFetchingDetails(false);
        isFetchingRef.current = false;
      }
    };

    if (isHome && currentEventData?.data) {
      prefetchEventDetails();
    }
  }, [
    currentEventData?.data,
    location.pathname,
    dispatch,
    triggerGetEventDetails,
  ]);

  // Preload lucky draw component for better performance
  useEffect(() => {
    const shouldPreload =
      !showAd &&
      !showAlert &&
      !isOpen &&
      isHome &&
      !event &&
      showAnimation &&
      currentTab === 2;

    if (shouldPreload) {
      import("@/page/events/Luckydraw");
    }
  }, [
    showAd,
    showAlert,
    isOpen,
    location.pathname,
    event,
    showAnimation,
    currentTab,
  ]);

  // Debug: Log notifications when on home page
  useEffect(() => {
    if (!isHome) {
      dispatch(sethideNew(false));
    }
  }, [location.pathname, dispatch]);

  // =============================================================================
  // RENDER LOGIC
  // =============================================================================

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen
            key="loading-screen"
            onLoadComplete={handleLoadComplete}
          />
        )}
      </AnimatePresence>
      {!isLoading && (
        <>
          <motion.div
            className="fixed inset-0 z-50 overflow-y-auto w-screen"
            style={{ height: "100dvh" }}
            initial={
              shouldSkipAnimationRef.current || !isHome
                ? { clipPath: "inset(0% 0 0% 0)", translateY: "0" }
                : { clipPath: "inset(50% 0 50% 0)", translateY: "-14px" }
            }
            animate={
              removeSplashScreen
                ? {
                  clipPath: !showLanding
                    ? "inset(0% 0 0% 0)"
                    : "inset(50% 0 50% 0)",
                  translateY: !showLanding ? "0" : "-14px",
                }
                : {
                  clipPath: "inset(50% 0 50% 0)",
                  translateY: "-14px",
                }
            }
            transition={
              shouldSkipAnimationRef.current || !removeSplashScreen || !isHome
                ? { duration: 0 }
                : { duration: 1, ease: "easeOut" }
            }
          >
            <Outlet />

            {/* =================================================================== */}
            {/* EVENT AND REGISTRATION COMPONENTS */}
            {/* =================================================================== */}

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

            {/* =================================================================== */}
            {/* USER GUIDE - PRIORITY 5 */}
            {/* =================================================================== */}

            {showUserGuide && !event && isHome && (
              <ImmersiveUserGuide
                setShowUserGuide={(value: boolean) =>
                  dispatch(setShowUserGuide(value))
                }
                setShowAd={setShowAd}
              />
            )}

            {/* =================================================================== */}
            {/* AD POPUP - PRIORITY 6 */}
            {/* =================================================================== */}

            <AnimatePresence mode="wait">
              {showAd && !event && isHome && (
                <PopUp
                  setShowAd={setShowAd}
                  setShowAlert={setShowAlert}
                  isBrowser={isBrowser}
                  onComplete={handleAdComplete}
                />
              )}
            </AnimatePresence>

            {/* =================================================================== */}
            {/* ALERT REDIRECT - PRIORITY 7 */}
            {/* =================================================================== */}

            <AnimatePresence>
              {!showAd &&
                showAlert &&
                isBrowser &&
                jumpUrl &&
                showDialog &&
                !event &&
                isHome && (
                  <AlertRedirect
                    key="alert-redirect"
                    event={event}
                    setShowAlert={setShowAlert}
                    app_download_link={jumpUrl}
                  />
                )}
            </AnimatePresence>

            {/* =================================================================== */}
            {/* AUTH DRAWER - PRIORITY 8 */}
            {/* =================================================================== */}

            {isOpen && <AuthDrawer />}

            {/* =================================================================== */}
            {/* GLOBAL COMPONENTS */}
            {/* =================================================================== */}

            <AlertToast />

            {!hideNew && (
              <div className="fixed bottom-0 left-0 w-full z-[1600]">
                <BottomNav />
              </div>
            )}

            {/* =================================================================== */}
            {/* EVENT ANIMATIONS */}
            {/* =================================================================== */}

            {!showAd &&
              !isOpen &&
              isHome &&
              !event &&
              showAnimation &&
              currentTab === 2 &&
              !hideBar &&
              !hideNew &&
              !userHasClosedAnimation && (
                <>
                  <AnimatePresence>
                    {showEvent && (
                      <>
                        {/* Countdown Animation */}
                        <motion.div
                          key="countdown"
                          className={`fixed ${APP_CONFIG.ANIMATION_POSITIONS.COUNTDOWN} z-[9999] rounded-full p-2`}
                          initial={{ y: 100, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 100, opacity: 0 }}
                          transition={APP_CONFIG.SPRING_CONFIG}
                        >
                          <div className="relative">
                            <AnimationLoader
                              animationData={countdownAnimation}
                              {...APP_CONFIG.ANIMATION_SIZES.COUNTDOWN}
                              onClick={handleAnimationClick}
                            />
                          </div>
                        </motion.div>

                        {/* Lucky Spin Animation */}
                        <motion.div
                          key="luckySpin"
                          className={`fixed ${APP_CONFIG.ANIMATION_POSITIONS.LUCKY_SPIN} z-[9999] rounded-full p-2`}
                          initial={{ y: 100, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 100, opacity: 0 }}
                          transition={{
                            ...APP_CONFIG.SPRING_CONFIG,
                            delay: 0.1,
                          }}
                        >
                          <div className="relative">
                            <AnimationLoader
                              animationData={luckySpinAnimation}
                              {...APP_CONFIG.ANIMATION_SIZES.LUCKY_SPIN}
                              onClick={handleLuckySpinClick}
                            />
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>

                  {/* FAB Animation with Close Button */}
                  <div
                    className={`fixed ${APP_CONFIG.ANIMATION_POSITIONS.FAB} z-[9999] rounded-full p-2`}
                  >
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
                        {...APP_CONFIG.ANIMATION_SIZES.FAB}
                        onClick={() => setShowEvent(!showEvent)}
                      />
                    </div>
                  </div>
                </>
              )}

            {/* =================================================================== */}
            {/* PASSWORD SETUP - PRIORITY 9 (iOS WebView only) */}
            {/* =================================================================== */}

            {!showAd &&
              !showUserGuide &&
              !showAlert &&
              !isOpen &&
              isIOSWebView() &&
              isHome && (
                <PasswordSetUpPopUp
                  showPasswordSetUpPopUp={showPasswordSetUpPopUp}
                  setShowPasswordSetUpPopUp={setShowPasswordSetUpPopUp}
                />
              )}

            {/* =================================================================== */}
            {/* NOTIFICATION POPUP - PRIORITY 10 */}
            {/* =================================================================== */}

            {console.log('NOTIFICATION POPUP', showNotiPopUp)}
            {!showAd &&
              !showUserGuide &&
              // !showAlert &&
              !showPasswordSetUpPopUp &&
              showNotiPopUp && (
                <NotiPopUp notiMessage={notiMessage?.data} closeNotiPopUp={() => setShowNotiPopUp(false)} />
              )}
          </motion.div>

          {!removeSplashScreen && (
            <Landing onComplete={handleLandingComplete} />
          )}
        </>
      )}
    </>
  );
};

export default RootLayout;
