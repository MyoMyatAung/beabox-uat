/**
 * ImmersiveUserGuide Component
 * 
 * PURPOSE:
 * ========
 * This component provides an interactive onboarding experience for users.
 * It guides users through app features using a multi-stage tutorial flow
 * and manages scroll restrictions to ensure users view the Ad Popup.
 * 
 * BUSINESS LOGIC:
 * ===============
 * 1. First-Time Users:
 *    - Stage 1 (INITIAL): Show fullscreen/audio controls on the right side
 *    - User scrolls → Stage 2 (CLR_SCREEN_INFO): Show clear screen instruction
 *    - User clicks fullscreen → Stage 3 (SCROLL_INFO): Show scroll instruction (5s timeout)
 *    - Finish → Show Ad Popup
 * 
 * 2. Returning Users:
 *    - Stage (RETURN_USER_STALE): Show fullscreen control only
 *    - User clicks fullscreen → Finish → Show Ad Popup
 * 
 * 3. Scroll Restriction (NEW):
 *    - When guide is active, limit scrolling to second video (index 1)
 *    - After user reaches second video, trigger Ad Popup
 *    - After Ad Popup closes, unlock unlimited scrolling
 * 
 * SOLID PRINCIPLES APPLIED:
 * =========================
 * S - Single Responsibility: Each hook handles one specific concern
 * O - Open/Closed: Easy to extend stages without modifying core logic
 * L - Liskov Substitution: Callbacks follow consistent interfaces
 * I - Interface Segregation: Separate interfaces for different concerns
 * D - Dependency Inversion: Depends on hooks (abstractions) not implementations
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

// Assets
import HandPointer from "@/assets/handpointer.gif";
import ArrowUp from "@/assets/arrow_up.png";
import ArrowDown from "@/assets/arrow_down.png";

// Utilities & Actions
import { cn } from "@/lib/utils";
import { sethideNew } from "@/page/home/services/hideNewSlice";
import { sethideBar } from "@/page/home/services/hideBarSlice";
import { setFirstTimeUser } from "@/store/slices/appSlice";
import { setMute } from "@/page/home/services/muteSlice";
import {
  enableScrollRestriction,
  markSecondVideoReached,
} from "@/store/slices/scrollRestrictionSlice";
import { useUserActionTracker, UserAction } from "@/hooks/useUserActionTracker";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/**
 * Guide stages enum
 * Represents the different states of the user guide flow
 */
const STAGES = {
  INITIAL: "initial",                   // Initial state - show controls
  SCROLL_INFO: "scroll_info",           // Show scroll instructions
  CLR_SCREEN_INFO: "clr_screen_info",   // Show clear screen info
  RETURN_USER_STALE: "return_user_stale", // Returning user state
  FINISH: "finish",                     // Fade out and complete
} as const;

type StageType = (typeof STAGES)[keyof typeof STAGES];

/**
 * Props interface for ImmersiveUserGuide
 */
interface ImmersiveUserGuideProps {
  /** Callback to hide/show the user guide */
  setShowUserGuide: (show: boolean) => void;
  /** Callback to show/hide the Ad Popup */
  setShowAd: (show: boolean) => void;
}

/**
 * Redux state selector types
 */
interface RootState {
  hideNewSlice: { hideNew: boolean };
  app: { isFirstTimeUser: boolean };
  muteSlice: { mute: boolean };
}

// =============================================================================
// CUSTOM HOOKS - SEPARATION OF CONCERNS
// =============================================================================

/**
 * Hook: useStageManager
 * 
 * PURPOSE: Manages the current stage and stage transitions
 * RESPONSIBILITY: Stage state management and progression logic
 * 
 * @param isFirstTimeUser - Whether this is the user's first visit
 * @returns Current stage and stage transition functions
 */
const useStageManager = (isFirstTimeUser: boolean) => {
  const [currentStage, setCurrentStage] = useState<StageType>(STAGES.INITIAL);

  /**
   * Transition to next stage based on current stage and user type
   */
  const transitionToNextStage = useCallback((fromStage: StageType) => {
    if (isFirstTimeUser) {
      switch (fromStage) {
        case STAGES.INITIAL:
          return STAGES.CLR_SCREEN_INFO;
        case STAGES.CLR_SCREEN_INFO:
          return STAGES.SCROLL_INFO;
        default:
          return STAGES.FINISH;
      }
    } else {
      return STAGES.FINISH;
    }
  }, [isFirstTimeUser]);

  return {
    currentStage,
    setCurrentStage,
    transitionToNextStage,
  };
};

/**
 * Hook: useVideoController
 * 
 * PURPOSE: Controls video mute/unmute functionality
 * RESPONSIBILITY: Video audio state management
 * 
 * @param dispatch - Redux dispatch function
 * @param mute - Current mute state
 * @returns Functions to control video audio
 */
const useVideoController = (dispatch: any, mute: boolean) => {
  /**
   * Unmute all videos on the page
   * Business Logic: Called when user interacts with guide to enable audio
   */
  const unmuteAllVideos = useCallback(() => {
    // Update Redux state
    dispatch(setMute(false));

    // Directly unmute all video elements on the page
    const videoElements = document.querySelectorAll("video");
    videoElements.forEach((video) => {
      video.muted = false;
      // Try to play with audio if paused
      if (video.paused) {
        video.play().catch((error) => {
          console.log("Auto-play with audio failed:", error);
        });
      }
    });
  }, [dispatch]);

  /**
   * Toggle audio mute state for all videos
   * Business Logic: Allows user to control audio during guide
   */
  const handleAudioToggle = useCallback(() => {
    const newMuteState = !mute;
    dispatch(setMute(newMuteState));

    // Directly toggle all video elements on the page
    const videoElements = document.querySelectorAll("video");
    videoElements.forEach((video) => {
      video.muted = newMuteState;
      // If unmuting and video is paused, try to play
      if (!newMuteState && video.paused) {
        video.play().catch((error) => {
          console.log("Auto-play with audio failed:", error);
        });
      }
    });
  }, [dispatch, mute]);

  return {
    unmuteAllVideos,
    handleAudioToggle,
  };
};

/**
 * Hook: useScrollRestrictionManager
 * 
 * PURPOSE: Manages scroll restriction state in Redux
 * RESPONSIBILITY: Enables/disables scroll restriction based on guide state
 * 
 * BUSINESS LOGIC:
 * - When guide is active, enable scroll restriction in Redux
 * - When guide finishes, keep restriction until Ad Popup closes
 * - Track when user reaches second video
 * 
 * @param dispatch - Redux dispatch function
 * @param currentStage - Current guide stage
 * @param setShowAd - Callback to show Ad Popup
 * @param setShowUserGuide - Callback to hide user guide
 * @returns Functions to manage scroll restriction
 */
const useScrollRestrictionManager = (
  dispatch: any,
  currentStage: StageType,
  setShowAd: (show: boolean) => void,
  setShowUserGuide: (show: boolean) => void
) => {
  const [hasReachedSecondVideo, setHasReachedSecondVideo] = useState(false);

  /**
   * Enable scroll restriction when guide becomes active
   * Business Logic: Restrict scrolling during entire guide flow
   */
  useEffect(() => {
    const isActiveStage = currentStage !== STAGES.FINISH;
    if (isActiveStage) {
      dispatch(enableScrollRestriction());
    }
  }, [dispatch, currentStage]);

  /**
   * Handle video index change from Home component
   * Business Logic: Trigger Ad Popup when user reaches second video
   * 
   * @param videoIndex - Current visible video index
   */
  const handleVideoIndexChange = useCallback((videoIndex: number) => {
    // If user has reached second video (index 1) and hasn't triggered Ad yet
    if (videoIndex >= 1 && !hasReachedSecondVideo) {
      setHasReachedSecondVideo(true);
      
      // Mark in Redux
      dispatch(markSecondVideoReached());
      
      // Hide user guide and show Ad Popup after a short delay
      setTimeout(() => {
        setShowUserGuide(false);
        setShowAd(true);
      }, 500);
    }
  }, [hasReachedSecondVideo, setShowAd, setShowUserGuide, dispatch]);

  return {
    hasReachedSecondVideo,
    handleVideoIndexChange,
  };
};

/**
 * Hook: useGuideVisibility
 * 
 * PURPOSE: Manages guide visibility and animation states
 * RESPONSIBILITY: Show/hide logic and animation control
 * 
 * @param hideNew - Global hideNew state from Redux
 * @param currentStage - Current guide stage
 * @returns Visibility state and setters
 */
const useGuideVisibility = (hideNew: boolean, currentStage: StageType) => {
  const [showGuide, setShowGuide] = useState(true);
  const [isHidden, setIsHidden] = useState(false);

  // Hide guide temporarily when hideNew changes
  useEffect(() => {
    if (!hideNew) {
      setShowGuide(false);
      const timer = setTimeout(() => {
        setShowGuide(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hideNew]);

  // Reset isHidden when stage changes away from FINISH
  useEffect(() => {
    if (currentStage !== STAGES.FINISH) {
      setIsHidden(false);
    }
  }, [currentStage]);

  return {
    showGuide,
    isHidden,
    setIsHidden,
  };
};

/**
 * Hook: useScrollInfoTimeout
 * 
 * PURPOSE: Manages the timeout for scroll info stage
 * RESPONSIBILITY: Auto-progress from SCROLL_INFO stage after 5 seconds
 * 
 * @returns Timeout ref and utility functions
 */
const useScrollInfoTimeout = () => {
  const scrollInfoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearScrollInfoTimeout = useCallback(() => {
    if (scrollInfoTimeoutRef.current) {
      clearTimeout(scrollInfoTimeoutRef.current);
      scrollInfoTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearScrollInfoTimeout();
    };
  }, [clearScrollInfoTimeout]);

  return {
    scrollInfoTimeoutRef,
    clearScrollInfoTimeout,
  };
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * ImmersiveUserGuide Component
 * 
 * Main component that orchestrates the onboarding flow using custom hooks.
 * Each hook handles a specific responsibility following SRP.
 */
const ImmersiveUserGuide: React.FC<ImmersiveUserGuideProps> = ({
  setShowUserGuide,
  setShowAd,
}) => {
  console.log("ImmersiveUserGuide: Component mounted");

  // =============================================================================
  // REDUX STATE
  // =============================================================================
  const dispatch = useDispatch();
  const hideNew = useSelector((state: RootState) => state.hideNewSlice.hideNew);
  const { isFirstTimeUser } = useSelector((state: RootState) => state.app);
  const mute = useSelector((state: RootState) => state.muteSlice.mute);

  // =============================================================================
  // CUSTOM HOOKS - BUSINESS LOGIC SEPARATION
  // =============================================================================
  
  // Stage management
  const { currentStage, setCurrentStage, transitionToNextStage } = useStageManager(isFirstTimeUser);
  
  // Video control (mute/unmute)
  const { unmuteAllVideos, handleAudioToggle } = useVideoController(dispatch, mute);
  
  // Scroll restriction logic (NEW FEATURE)
  // Manages Redux state for scroll restriction that Home component will enforce
  const {
    hasReachedSecondVideo,
    handleVideoIndexChange,
  } = useScrollRestrictionManager(dispatch, currentStage, setShowAd, setShowUserGuide);
  
  // Guide visibility management
  const { showGuide, isHidden, setIsHidden } = useGuideVisibility(hideNew, currentStage);
  
  // Scroll info timeout management
  const { scrollInfoTimeoutRef, clearScrollInfoTimeout } = useScrollInfoTimeout();

  // =============================================================================
  // LOCAL STATE FOR USER INTERACTION TRACKING
  // =============================================================================
  const touchStartY = useRef<number>(0);
  const wheelDeltaY = useRef<number>(0);
  const SCROLL_THRESHOLD = 50;

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================

  /**
   * Handle guide completion
   * Business Logic: 
   * - Fade out guide after 1 second
   * - Show Ad Popup if user hasn't reached second video yet
   * - If user already reached second video, Ad was already shown
   */
  const handleGuideComplete = useCallback(() => {
    setTimeout(() => {
      setShowUserGuide(false);
      
      // Only show Ad if user hasn't reached second video yet
      // (If they reached it, Ad was already triggered)
      if (!hasReachedSecondVideo) {
        setShowAd(true);
      }
    }, 1000);
  }, [setShowUserGuide, setShowAd, hasReachedSecondVideo]);

  /**
   * Handle fullscreen button click
   * Business Logic: 
   * - Exit clear screen mode
   * - Unmute videos
   * - Progress through stages based on user type
   */
  const handleFullScreen = useCallback(() => {
    // Show UI elements (exit clear screen mode)
    dispatch(sethideBar(false));
    dispatch(sethideNew(false));
    
    // Enable audio
    unmuteAllVideos();

    // Stage progression logic
    if (isFirstTimeUser) {
      // Mark user as no longer first-time
      dispatch(setFirstTimeUser(false));
      
      if (currentStage === STAGES.INITIAL || currentStage === STAGES.CLR_SCREEN_INFO) {
        // Clear any existing timeout
        clearScrollInfoTimeout();
        
        // Transition to scroll info stage with 5-second auto-complete
        setTimeout(() => {
          setCurrentStage(STAGES.SCROLL_INFO);
          
          // Auto-complete after 5 seconds
          scrollInfoTimeoutRef.current = setTimeout(() => {
            setCurrentStage(STAGES.FINISH);
            handleGuideComplete();
            scrollInfoTimeoutRef.current = null;
          }, 5000);
        }, 300);
      } else {
        // Already past initial stages, finish immediately
        setCurrentStage(STAGES.FINISH);
        handleGuideComplete();
      }
    } else {
      // Returning user - finish immediately
      if (currentStage === STAGES.RETURN_USER_STALE) {
        setShowUserGuide(false);
      } else {
        handleGuideComplete();
      }
      setCurrentStage(STAGES.FINISH);
    }
  }, [
    dispatch,
    unmuteAllVideos,
    isFirstTimeUser,
    currentStage,
    clearScrollInfoTimeout,
    scrollInfoTimeoutRef,
    setCurrentStage,
    handleGuideComplete,
    setShowUserGuide,
  ]);

  /**
   * Handle user interaction with guide overlay
   * Business Logic:
   * - Only respond to clicks on the overlay itself (not buttons)
   * - In SCROLL_INFO stage, clicking overlay completes the guide
   */
  const handleUserInteraction = useCallback((
    e: React.MouseEvent | React.TouchEvent | React.WheelEvent
  ) => {
    // Only handle clicks on the overlay itself
    if (e.target === e.currentTarget) {
      if (currentStage === STAGES.SCROLL_INFO && !isHidden) {
        clearScrollInfoTimeout();
        setCurrentStage(STAGES.FINISH);
        handleGuideComplete();
      }
    }
  }, [currentStage, isHidden, clearScrollInfoTimeout, setCurrentStage, handleGuideComplete]);

  // =============================================================================
  // USER ACTION TRACKING - DETECT SCROLLING IN INITIAL STAGE
  // =============================================================================
  
  /**
   * Track user scroll/touch actions to detect when they start scrolling
   * Business Logic:
   * - Only track in INITIAL stage
   * - When user scrolls, unmute videos and progress to next stage
   * - Different handling for first-time vs returning users
   */
  useUserActionTracker((action: UserAction) => {
    // Only track in INITIAL stage
    if (currentStage !== STAGES.INITIAL) return;

    let shouldTrigger = false;

    // Detect different types of scroll actions
    if (action.type === "touch") {
      touchStartY.current = action.y || 0;
    } else if (action.type === "touchend") {
      shouldTrigger =
        Math.abs((action.y || 0) - touchStartY.current) >= SCROLL_THRESHOLD;
      touchStartY.current = 0;
    } else if (action.type === "scroll") {
      shouldTrigger = Math.abs(action.deltaY || 0) >= SCROLL_THRESHOLD;
    } else if (action.type === "wheel") {
      wheelDeltaY.current += Math.abs(action.deltaY || 0);
      if (wheelDeltaY.current >= SCROLL_THRESHOLD) {
        shouldTrigger = true;
        wheelDeltaY.current = 0;
      }
    }

    // When scroll detected, progress to next stage
    if (shouldTrigger) {
      // Unmute audio when user starts scrolling
      unmuteAllVideos();
      
      // Progress stage based on user type
      const nextStage = transitionToNextStage(STAGES.INITIAL);
      setCurrentStage(nextStage);
      
      // For returning users, show UI and complete guide
      if (!isFirstTimeUser) {
        setTimeout(() => {
          dispatch(sethideBar(false));
          dispatch(sethideNew(false));
        }, 500);
        handleGuideComplete();
      }
    }
  }, currentStage === STAGES.INITIAL && !isHidden);

  // =============================================================================
  // SCROLL RESTRICTION MONITORING
  // =============================================================================
  
  /**
   * Monitor video container to track current video index
   * Business Logic: Detect when user reaches second video to trigger Ad Popup
   * 
   * Note: The actual scroll restriction is enforced by the Home component
   * reading from Redux state. This observer just tracks user progress.
   */
  useEffect(() => {
    // Only monitor during active guide stages
    if (currentStage === STAGES.FINISH || hasReachedSecondVideo) return;

    const videoContainer = document.querySelector('.app__videos');
    if (!videoContainer) return;

    /**
     * Intersection Observer to track which video is currently visible
     * When second video becomes visible, trigger Ad Popup
     */
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const videoElement = entry.target;
            const allVideos = Array.from(videoContainer.querySelectorAll('.video'));
            const videoIndex = allVideos.indexOf(videoElement as Element);
            
            if (videoIndex >= 0) {
              handleVideoIndexChange(videoIndex);
            }
          }
        });
      },
      {
        root: videoContainer,
        threshold: 0.6, // Trigger when 60% of video is visible
      }
    );

    // Observe all video elements
    const videoElements = videoContainer.querySelectorAll('.video');
    videoElements.forEach((video) => observer.observe(video));

    return () => {
      observer.disconnect();
    };
  }, [currentStage, hasReachedSecondVideo, handleVideoIndexChange]);

  // =============================================================================
  // EARLY RETURNS
  // =============================================================================
  
  // Don't render if guide should be hidden
  if (!showGuide) return null;

  // =============================================================================
  // RENDER - UI COMPONENTS
  // =============================================================================
  
  /**
   * Determine container classes based on current stage
   * - INITIAL/FINISH/RETURN_USER_STALE: Bottom-right positioned controls
   * - Other stages: Full screen overlay with centered content
   */
  const containerClasses = cn("absolute z-[1700]", {
    "bottom-0 right-0 w-full":
      currentStage === STAGES.INITIAL ||
      currentStage === STAGES.FINISH ||
      currentStage === STAGES.RETURN_USER_STALE,
    "top-0 h-full w-screen flex bg-black/80 flex-col justify-center items-center gap-[20px]":
      currentStage !== STAGES.INITIAL &&
      currentStage !== STAGES.FINISH &&
      currentStage !== STAGES.RETURN_USER_STALE,
  });

  return (
    <motion.div
      className={containerClasses}
      animate={{
        opacity: currentStage === STAGES.FINISH ? 0 : 1,
      }}
      transition={{
        opacity: { duration: 0.5, ease: "easeOut" },
      }}
      onAnimationComplete={() => {
        if (currentStage === STAGES.FINISH) {
          setIsHidden(true);
        }
      }}
      onClick={handleUserInteraction}
      onTouchStart={handleUserInteraction}
      onTouchMove={handleUserInteraction}
      onTouchEnd={handleUserInteraction}
      onWheel={handleUserInteraction}
      style={{
        pointerEvents: currentStage === STAGES.FINISH ? "none" : "auto",
        display: isHidden ? "none" : "flex",
      }}
    >
      {/* ======================================================================= */}
      {/* FULLSCREEN TOGGLE BUTTON */}
      {/* ======================================================================= */}
      {/* 
        Business Logic:
        - Always visible during guide
        - Position changes based on stage
        - Allows user to exit clear screen mode
        - Icon changes based on whether in clear screen mode
      */}
      <motion.div
        className={cn("videoSidebar__button absolute text-white ", {
          "bottom-[30px] right-3":
            currentStage === STAGES.INITIAL ||
            currentStage === STAGES.CLR_SCREEN_INFO ||
            currentStage === STAGES.RETURN_USER_STALE,
          "bottom-[127px] right-[22px]": currentStage === STAGES.SCROLL_INFO,
        })}
        initial={{
          x: currentStage === STAGES.INITIAL ? 50 : 0,
          opacity: 0,
        }}
        animate={{
          x: 0,
          opacity: 1,
        }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 300,
          opacity: { duration: 0.2 },
        }}
      >
        <button onClick={handleFullScreen} aria-label="Toggle fullscreen mode">
          {/* Exit Clear Screen Icon (shown in clear screen mode) */}
          {currentStage === STAGES.INITIAL ||
          currentStage === STAGES.CLR_SCREEN_INFO ||
          currentStage === STAGES.RETURN_USER_STALE ? (
            <div className="flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="24"
                viewBox="0 0 25 24"
                fill="none"
              >
                <path
                  d="M24.5 24H15.042V21.3525H21.8525V14.542H24.5V24Z"
                  fill="white"
                />
                <path
                  d="M9.1582 23.2217H6.51074V19.7793L2.40625 23.8838L0.552734 22.0303L4.65723 17.9258H1.21484V15.2783H9.1582V23.2217Z"
                  fill="white"
                />
                <path
                  d="M9.95801 2.64746H3.14746V9.45801H0.5V0H9.95801V2.64746Z"
                  fill="white"
                />
                <path
                  d="M24.3838 1.90625L20.2793 6.01074H23.7217V8.65918H15.7783V0.714844H18.4258V4.15723L22.5303 0.0527344L24.3838 1.90625Z"
                  fill="white"
                />
              </svg>
              <p className="side_text font-cnFont mt-2">退出清屏</p>
            </div>
          ) : (
            /* Enter Clear Screen Icon (shown when not in clear screen mode) */
            <div className="flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
              >
                <path
                  d="M24.5 24.8066H15.0419V22.159H21.8523V15.3486H24.5V24.8066Z"
                  fill="white"
                />
                <path
                  d="M9.15849 17.9382L5.05415 22.0423H8.49644V24.6902H0.552874V16.7467H3.20081V20.1889L7.30491 16.0846L9.15849 17.9382Z"
                  fill="white"
                />
                <path
                  d="M9.95806 3.45433H3.14769V10.2647H0.5V0.806641H9.95806V3.45433Z"
                  fill="white"
                />
                <path
                  d="M24.3836 8.80308H21.7356V5.36079L17.6315 9.46513L15.778 7.61155L19.8823 3.50745H16.44V0.859515H24.3836V8.80308Z"
                  fill="white"
                />
              </svg>
              <p className="side_text font-cnFont mt-2">清屏</p>
            </div>
          )}
        </button>
      </motion.div>

      {/* ======================================================================= */}
      {/* AUDIO TOGGLE BUTTON */}
      {/* ======================================================================= */}
      {/* 
        Business Logic:
        - Only shown when videos are muted
        - Allows user to unmute audio
        - Position changes based on stage
      */}
      <motion.div
        className={cn("videoSidebar__button absolute text-white", {
          "bottom-[110px] right-3":
            currentStage === STAGES.INITIAL ||
            currentStage === STAGES.CLR_SCREEN_INFO ||
            currentStage === STAGES.RETURN_USER_STALE,
          "bottom-[207px] right-[22px]": currentStage === STAGES.SCROLL_INFO,
        })}
        initial={{
          x: currentStage === STAGES.INITIAL ? 50 : 0,
          opacity: 0,
        }}
        animate={{
          x: 0,
          opacity: 1,
        }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 300,
          opacity: { duration: 0.2 },
          delay: 0.1,
        }}
      >
        <button onClick={handleAudioToggle} aria-label="Toggle audio">
          {mute && (
            <div className="flex flex-col items-center">
              <svg
                width="25"
                height="20"
                viewBox="0 0 25 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.1212 1.79168C11.121 1.63504 11.0744 1.48198 10.9872 1.35181C10.9001 1.22164 10.7764 1.1202 10.6316 1.06029C10.4869 1.00037 10.3277 0.984675 10.174 1.01517C10.0204 1.04567 9.87923 1.12099 9.76836 1.23164L5.96278 5.0361C5.81591 5.18384 5.64118 5.30097 5.44872 5.3807C5.25626 5.46042 5.04989 5.50116 4.84157 5.50055H2.12458C1.82632 5.50055 1.54028 5.61903 1.32938 5.82993C1.11848 6.04083 1 6.32688 1 6.62513V13.3726C1 13.6709 1.11848 13.9569 1.32938 14.1678C1.54028 14.3787 1.82632 14.4972 2.12458 14.4972H4.84157C5.04989 14.4966 5.25626 14.5373 5.44872 14.6171C5.64118 14.6968 5.81591 14.8139 5.96278 14.9617L9.76723 18.7672C9.87812 18.8783 10.0195 18.954 10.1734 18.9847C10.3274 19.0154 10.4869 18.9997 10.632 18.9396C10.777 18.8795 10.9009 18.7777 10.988 18.6471C11.0751 18.5165 11.1214 18.363 11.1212 18.2061V1.79168Z"
                  fill="white"
                />
                <path
                  d="M23.4916 6.62513L16.7441 13.3726M16.7441 6.62513L23.4916 13.3726M11.1212 1.79168C11.121 1.63504 11.0744 1.48198 10.9872 1.35181C10.9001 1.22164 10.7764 1.1202 10.6316 1.06029C10.4869 1.00037 10.3277 0.984675 10.174 1.01517C10.0204 1.04567 9.87923 1.12099 9.76836 1.23164L5.96278 5.0361C5.81591 5.18384 5.64118 5.30097 5.44872 5.3807C5.25626 5.46042 5.04989 5.50116 4.84157 5.50055H2.12458C1.82632 5.50055 1.54028 5.61903 1.32938 5.82993C1.11848 6.04083 1 6.32688 1 6.62513V13.3726C1 13.6709 1.11848 13.9569 1.32938 14.1678C1.54028 14.3787 1.82632 14.4972 2.12458 14.4972H4.84157C5.04989 14.4966 5.25626 14.5373 5.44872 14.6171C5.64118 14.6968 5.81591 14.8139 5.96278 14.9617L9.76723 18.7672C9.87812 18.8783 10.0195 18.954 10.1734 18.9847C10.3274 19.0154 10.4869 18.9997 10.632 18.9396C10.777 18.8795 10.9009 18.7777 10.988 18.6471C11.0751 18.5165 11.1214 18.363 11.1212 18.2061V1.79168Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="side_text font-cnFont mt-2">取消静音</p>
            </div>
          )}
        </button>
      </motion.div>

      {/* ======================================================================= */}
      {/* SCROLL INSTRUCTION (SCROLL_INFO STAGE) */}
      {/* ======================================================================= */}
      {/* 
        Business Logic:
        - Only shown in SCROLL_INFO stage
        - Teaches user how to navigate between videos
        - Auto-dismisses after 5 seconds
      */}
      {currentStage === STAGES.SCROLL_INFO && (
        <motion.div
          className="text-white text-xl flex flex-col items-center justify-center gap-2"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: currentStage === STAGES.SCROLL_INFO ? 1 : 0,
          }}
        >
          <img src={ArrowUp} className="inline-block" alt="Swipe up" />
          <span>向上或向下滑动以切换视频</span>
          <img src={ArrowDown} className="inline-block" alt="Swipe down" />
        </motion.div>
      )}

      {/* ======================================================================= */}
      {/* CLOSE GUIDE INSTRUCTION */}
      {/* ======================================================================= */}
      {/* 
        Business Logic:
        - Shown in CLR_SCREEN_INFO and SCROLL_INFO stages
        - Points to fullscreen button
        - Teaches user how to exit immersive mode
      */}
      {(currentStage === STAGES.CLR_SCREEN_INFO ||
        currentStage === STAGES.SCROLL_INFO) && (
        <motion.div
          className={cn("flex items-center absolute right-[60px]", {
            "bottom-[127px]": currentStage === STAGES.SCROLL_INFO,
            "bottom-[30px]": currentStage === STAGES.CLR_SCREEN_INFO,
          })}
          initial={{ y: 20, opacity: 0 }}
          animate={{
            y: 0,
            opacity:
              currentStage === STAGES.SCROLL_INFO ||
              currentStage === STAGES.CLR_SCREEN_INFO
                ? 1
                : 0,
          }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <span className="text-lg text-white">点击关闭沉浸模式</span>
          <img
            src={HandPointer}
            className="w-16 h-16 inline-block transform -scale-x-100"
            alt="Hand pointer"
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default ImmersiveUserGuide;
