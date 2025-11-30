import { useEffect, useState, useRef } from "react";
import { useLocation, useSearchParams, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { sethideNew } from "@/page/home/services/hideNewSlice";
import { setShowUserGuide } from "@/store/slices/appSlice";
import { setPlay } from "@/page/home/services/playSlice";
import { motion, AnimatePresence } from "framer-motion";
import { useGetApplicationAdsQuery } from "@/store/api/explore/exploreApi";
import {
  useGetConfigQuery,
  useGetNotificationsQuery,
} from "@/page/home/services/homeApi";
import { useGetUserByReferalQuery } from "@/page/event/eventApi";
import { BottomNav } from "@/components/shared/bottom-nav";
import AuthDrawer from "@/components/profile/auth/auth-drawer";
import RegisterDrawer from "@/components/profile/auth/register-drawer";
import AlertToast from "@/components/shared/alert-toast";
import LoadingScreen from "@/components/LoadingScreen";
import Landing from "@/components/Landing";
import DEventBox from "@/page/event/EventBox";
import { sendNativeEvent, NativeEventType } from "@/utils/nativeBridge";

// Custom hooks
import { useDeviceDetection } from "./hooks/useDeviceDetection";
import { useSessionManagement } from "./hooks/useSessionManagement";
import { useAppInitialization } from "./hooks/useAppInitialization";
import { useDialogConfig } from "./hooks/useDialogConfig";
import { useEventManagement } from "./hooks/useEventManagement";

// Sub-components
import { PopupLayer } from "./components/PopupLayer";
import { EventAnimations } from "./components/EventAnimations";

/**
 * RootLayout Component
 * 
 * This is the root layout component that manages the overall app structure and flow.
 * It handles:
 * - App initialization and onboarding flow
 * - Device detection and configuration
 * - Event management and animations
 * - Popup/modal display priority
 * - Navigation and routing
 * 
 * Business Flow:
 * 1. App loads → Check session state
 * 2. If first visit → Show loading screen → Landing screen → User guide → Ad popup → Notifications
 * 3. If returning user → Skip to main app (faster startup)
 * 4. Manage event animations, popups, and modals based on priority
 * 
 * SOLID Principles Applied:
 * - Single Responsibility: Each hook/component handles one concern
 * - Open/Closed: Extensible via hooks and component composition
 * - Dependency Inversion: Depends on abstractions (hooks) not concrete implementations
 */
const RootLayout = () => {
  // =============================================================================
  // ROUTING AND NAVIGATION
  // =============================================================================
  const dispatch = useDispatch();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const referCode = searchParams.get("refer");
  const isHome = location.pathname === "/";

  // =============================================================================
  // CUSTOM HOOKS - BUSINESS LOGIC SEPARATION
  // =============================================================================
  
  /**
   * Device Detection Hook
   * Detects device type (iOS/Android) and browser environment
   */
  const { isBrowser, deviceType } = useDeviceDetection();
  
  /**
   * Session Management Hook
   * Manages session storage flags for onboarding flow
   */
  const sessionManagement = useSessionManagement();
  const { hasSeenLanding, markLandingSeen, hasClosedAnimation } = sessionManagement;
  
  /**
   * App Initialization Hook
   * Handles initial app state based on session history
   */
  const { isLoading, setIsLoading } = useAppInitialization();

  // =============================================================================
  // APP FLOW STATE
  // =============================================================================
  
  /**
   * Landing Screen State
   * Controls visibility of landing screen animation
   * Business Logic: Skip landing if user has already seen it in this session
   */
  const [showLanding, setShowLanding] = useState(false);
  const [removeSplashScreen, setRemoveSplashScreen] = useState(
    isHome ? hasSeenLanding() : true
  );
  
  /**
   * Reference to skip animation transition
   * Used to prevent animation when user has already seen landing screen
   */
  const shouldSkipAnimationRef = useRef(hasSeenLanding() || !isHome);

  // =============================================================================
  // POPUP STATE MANAGEMENT
  // =============================================================================
  
  /**
   * Popup visibility states
   * Each popup has a priority level (see PopupLayer component for details)
   */
  const [showAd, setShowAd] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showNotiPopUp, setShowNotiPopUp] = useState(false);
  const [showPasswordSetUpPopUp, setShowPasswordSetUpPopUp] = useState(false);

  // =============================================================================
  // EVENT AND REGISTRATION STATE
  // =============================================================================
  
  /**
   * Event Registration State
   * Manages event registration flow for users coming from referral links
   */
  const [event, setEvent] = useState(false);
  const [box, setBox] = useState(false);
  const [isOpenNew, setIsOpenNew] = useState(false);
  const [code, setCode] = useState("");
  const [newData, setnewData] = useState(null);
  const [shownextBox, setshownextBox] = useState(false);

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
  
  /**
   * API Queries
   * - eventData: Referral event data (only fetched if refer code exists)
   * - notiMessage: System notifications (only fetched on home page)
   * - config: App configuration including device-specific dialog settings
   * - currentEventData: Current active events for animations
   */
  const { data: eventData } = useGetUserByReferalQuery(
    { referral_code: referCode },
    { skip: !referCode }
  );
  const { data: notiMessage } = useGetNotificationsQuery({}, { skip: !isHome });
  const { data: config } = useGetConfigQuery({});
  
  // Skip ads query - LoadingScreen handles it
  useGetApplicationAdsQuery("", { skip: true });

  // =============================================================================
  // DIALOG CONFIGURATION HOOK
  // =============================================================================
  
  /**
   * Dialog Configuration Hook
   * Configures download dialog based on device type
   * Business Logic: Different devices may have different app download links
   */
  const { showDialog, jumpUrl } = useDialogConfig(config, deviceType);

  // =============================================================================
  // EVENT MANAGEMENT HOOK
  // =============================================================================
  
  /**
   * Event Management Hook
   * Handles all event-related logic including:
   * - Event status from referral codes
   * - Animation display control
   * - Event details prefetching
   * - Navigation to event pages
   */
  const {
    event: eventFromHook,
    setEvent: setEventFromHook,
    handleAnimationClick,
    handleLuckySpinClick,
  } = useEventManagement(
    eventData,
    box,
    user,
    showAd,
    showAlert,
    isOpen,
    showLanding,
    isHome,
    currentTab,
    hideBar,
    hideNew
  );

  // Sync event state from hook
  useEffect(() => {
    setEvent(eventFromHook);
  }, [eventFromHook]);

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  /**
   * Handle Loading Screen Complete
   * 
   * Business Logic:
   * - Called when loading screen finishes loading all assets
   * - Shows landing screen and marks it as seen in session
   * - This prevents showing landing screen again in the same session
   */
  const handleLoadComplete = () => {
    setIsLoading(false);
    setShowLanding(true);
    markLandingSeen();
  };

  /**
   * Handle Landing Screen Complete
   * 
   * Business Logic:
   * - Called when landing screen animation completes
   * - Removes splash screen after a delay (smooth transition)
   * - Triggers user guide display (onboarding flow)
   */
  const handleLandingComplete = () => {
    setShowLanding(false);
    setTimeout(() => {
      setRemoveSplashScreen(true);
      // Show user guide after landing completes
      dispatch(setShowUserGuide(true));
    }, 1000);
  };

  /**
   * Handle Ad Popup Complete
   * 
   * Business Logic:
   * - Called when ad popup is closed
   * - Shows notification popup next
   * - Controls video play state based on event/dialog state
   * - Notifies native app that home screen has started
   */
  const handleAdComplete = () => {
    setShowAd(false);
    setShowNotiPopUp(true);
    
    // Control video playback
    // Business Logic: Pause video if download dialog should show or event is active
    if ((jumpUrl && showDialog) || event) {
      dispatch(setPlay(false));
    } else {
      dispatch(setPlay(true));
    }

    // Notify native app
    sendNativeEvent(NativeEventType.HOME_STARTED);
  };

  // =============================================================================
  // EFFECT HOOKS - ROUTE-BASED ACTIONS
  // =============================================================================

  /**
   * Reset hideNew state when navigating away from home
   * 
   * Business Logic:
   * - hideNew controls bottom navigation visibility
   * - When not on home page, ensure bottom nav is visible
   * - This provides consistent navigation across the app
   */
  useEffect(() => {
    if (!isHome) {
      dispatch(sethideNew(false));
    }
  }, [location.pathname, dispatch, isHome]);

  // =============================================================================
  // RENDER LOGIC
  // =============================================================================

  return (
    <>
      {/* Loading Screen - Shown on first visit or new session */}
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen
            key="loading-screen"
            onLoadComplete={handleLoadComplete}
          />
        )}
      </AnimatePresence>

      {/* Main App Content - Shown after loading completes */}
      {!isLoading && (
        <>
          {/* Main Content Container with Splash Screen Animation */}
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
            {/* Router Outlet - Renders child routes */}
            <Outlet />

            {/* =================================================================== */}
            {/* EVENT REGISTRATION COMPONENTS */}
            {/* =================================================================== */}
            
            {/* 
              Event Registration Box
              Business Logic:
              - Shown when user comes from referral link with event status
              - Only shown if: event exists, registration box not shown, drawer not open, user not logged in
              - Allows user to register for events via referral codes
            */}
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
                setEvent={setEventFromHook}
              />
            )}

            {/* 
              Registration Drawer
              Business Logic:
              - Shown when user clicks to register from event box
              - Handles user registration with referral code and geetest verification
            */}
            {isOpenNew && (
              <RegisterDrawer
                isOpen={isOpenNew}
                setIsOpen={setIsOpenNew}
                code={referCode}
                geetest_id={code}
              />
            )}

            {/* =================================================================== */}
            {/* POPUP LAYER - MANAGES ALL POPUPS IN PRIORITY ORDER */}
            {/* =================================================================== */}
            <PopupLayer
              showUserGuide={showUserGuide}
              setShowAd={setShowAd}
              showAd={showAd}
              setShowAlert={setShowAlert}
              isBrowser={isBrowser}
              onAdComplete={handleAdComplete}
              showAlert={showAlert}
              jumpUrl={jumpUrl}
              showDialog={showDialog}
              event={event}
              showPasswordSetUpPopUp={showPasswordSetUpPopUp}
              setShowPasswordSetUpPopUp={setShowPasswordSetUpPopUp}
              showNotiPopUp={showNotiPopUp}
              setShowNotiPopUp={setShowNotiPopUp}
              notiMessage={notiMessage}
              isHome={isHome}
              isOpen={isOpen}
            />

            {/* =================================================================== */}
            {/* AUTH DRAWER - PRIORITY 8 */}
            {/* =================================================================== */}
            {/* 
              Authentication Drawer
              Business Logic:
              - Shown when user triggers login/registration from UI
              - Managed by Redux state (profile.isDrawerOpen)
              - Allows user to authenticate or create account
            */}
            {isOpen && <AuthDrawer />}

            {/* =================================================================== */}
            {/* GLOBAL COMPONENTS */}
            {/* =================================================================== */}
            
            {/* Alert Toast - Global notification system */}
            <AlertToast />

            {/* Bottom Navigation - Hidden when hideNew is true */}
            {!hideNew && (
              <div className="fixed bottom-0 left-0 w-full z-[1600]">
                <BottomNav />
              </div>
            )}

            {/* =================================================================== */}
            {/* EVENT ANIMATIONS */}
            {/* =================================================================== */}
            {/* 
              Event Animations
              Business Logic:
              - Shown when: no ad, drawer closed, on home, no event, animation enabled, on tab 2, nav visible, user hasn't closed
              - Displays floating action button with countdown and lucky spin animations
              - Allows user to navigate to event details or lucky wheel
              - User can permanently dismiss animations
            */}
            {!showAd &&
              !isOpen &&
              isHome &&
              !event &&
              showAnimation &&
              currentTab === 2 &&
              !hideBar &&
              !hideNew &&
              !hasClosedAnimation() && (
                <EventAnimations
                  onCountdownClick={handleAnimationClick}
                  onLuckySpinClick={handleLuckySpinClick}
                />
              )}
          </motion.div>

          {/* Landing Screen - Shown before main content on first visit */}
          {!removeSplashScreen && (
            <Landing onComplete={handleLandingComplete} />
          )}
        </>
      )}
    </>
  );
};

export default RootLayout;
