import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

import HandPointer from "@/assets/handpointer.gif";
import ArrowUp from "@/assets/arrow_up.png";
import ArrowDown from "@/assets/arrow_down.png";
import { cn } from "@/lib/utils";
import { sethideNew } from "@/page/home/services/hideNewSlice";
import { sethideBar } from "@/page/home/services/hideBarSlice";
import { setFirstTimeUser } from "@/store/slices/appSlice";
import { useUserActionTracker } from "@/hooks/useUserActionTracker";

const STAGES = {
  INITIAL: "initial",
  SCROLL_INFO: "scroll_info",
  CLR_SCREEN_INFO: "clr_screen_info",
  RETURN_USER_STALE: "return_user_stale",
  FINISH: "finish",
};

type StageType = (typeof STAGES)[keyof typeof STAGES];
interface ImmersiveUserGuideProps {
  setShowUserGuide: (show: boolean) => void;
  setShowAd: (show: boolean) => void;
}

const ImmersiveUserGuide: React.FC<ImmersiveUserGuideProps> = ({
  setShowUserGuide,
  setShowAd,
}) => {
  console.log("show immersive user mode");

  // =============================================================================
  // REDUX STATE
  // =============================================================================
  const dispatch = useDispatch();
  const hideNew = useSelector((state: any) => state.hideNewSlice.hideNew);
  const { isFirstTimeUser } = useSelector((state: any) => state.app);

  // =============================================================================
  // LOCAL STATE
  // =============================================================================
  const [currentStage, setCurrentStage] = useState<StageType>(STAGES.INITIAL);
  const [showGuide, setShowGuide] = useState(true);
  const [isHidden, setIsHidden] = useState(false);
  const scrollInfoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const touchStartY = useRef<number>(0);
  const wheelDeltaY = useRef<number>(0);
  const SCROLL_THRESHOLD = 50;

  // =============================================================================
  // EFFECTS
  // =============================================================================
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

  // =============================================================================
  // EVENT HANDLERS
  // =============================================================================
  const clearScrollInfoTimeout = () => {
    if (scrollInfoTimeoutRef.current) {
      clearTimeout(scrollInfoTimeoutRef.current);
      scrollInfoTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearScrollInfoTimeout();
    };
  }, []);

  const timeOutFinish = () => {
    setTimeout(() => {
      setShowUserGuide?.(false);
      setShowAd?.(true);
    }, 1000);
  };

  const handleFullScreen = () => {
    dispatch(sethideBar(false));
    dispatch(sethideNew(false));

    if (isFirstTimeUser) {
      dispatch(setFirstTimeUser(false));
      if (
        currentStage === STAGES.INITIAL ||
        currentStage === STAGES.CLR_SCREEN_INFO
      ) {
        clearScrollInfoTimeout();
        setTimeout(() => {
          setCurrentStage(STAGES.SCROLL_INFO);
          scrollInfoTimeoutRef.current = setTimeout(() => {
            setCurrentStage(STAGES.FINISH);
            timeOutFinish();
            scrollInfoTimeoutRef.current = null;
          }, 5000);
        }, 300);
      } else {
        setCurrentStage(STAGES.FINISH);
        timeOutFinish();
      }
    } else {
      if (currentStage === STAGES.RETURN_USER_STALE) {
        setShowUserGuide?.(false);
      } else {
        timeOutFinish();
      }
      setCurrentStage(STAGES.FINISH);
    }
  };

  const handleUserInteraction = (
    e: React.MouseEvent | React.TouchEvent | React.WheelEvent
  ) => {
    // e.stopPropagation();
    // Handle interaction logic
    console.log(e.target, e.currentTarget);
    if (e.target === e.currentTarget) {
      if (currentStage === STAGES.SCROLL_INFO && !isHidden) {
        clearScrollInfoTimeout();
        setCurrentStage(STAGES.FINISH);
        timeOutFinish();
      }
    }
  };

  // =============================================================================
  // USER ACTION TRACKING
  // =============================================================================
  useUserActionTracker((action: any) => {
    if (currentStage !== STAGES.INITIAL) return;

    let shouldTrigger = false;

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

    if (shouldTrigger) {
      setCurrentStage(isFirstTimeUser ? STAGES.CLR_SCREEN_INFO : STAGES.FINISH);
      if (!isFirstTimeUser) {
        setTimeout(() => {
          dispatch(sethideBar(false));
          dispatch(sethideNew(false));
        }, 500);
        timeOutFinish();
      }
    }
  }, currentStage === STAGES.INITIAL && !isHidden);

  // =============================================================================
  // EARLY RETURNS
  // =============================================================================
  if (!showGuide) return <></>;

  // =============================================================================
  // RENDER
  // =============================================================================
  return (
    <motion.div
      className={cn("absolute z-[1700]", {
        "bottom-0 right-0 w-full":
          currentStage === STAGES.INITIAL ||
          currentStage === STAGES.FINISH ||
          currentStage === STAGES.RETURN_USER_STALE,
        "top-0 h-full w-screen flex bg-black/80 flex-col justify-center items-center gap-[20px]":
          currentStage !== STAGES.INITIAL &&
          currentStage !== STAGES.FINISH &&
          currentStage !== STAGES.RETURN_USER_STALE,
      })}
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
      {/* Fullscreen Toggle Button */}
      <motion.div
        className={cn("videoSidebar__button absolute text-white", {
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
        <button onClick={() => handleFullScreen()}>
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

      {/* Scroll Instruction (shown in SCROLL_INFO stage) */}
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
          <img src={ArrowUp} className="inline-block" alt="Arrow up" />
          <span>向上或向下滑动以切换视频</span>
          <img src={ArrowDown} className="inline-block" alt="Arrow down" />
        </motion.div>
      )}

      {/* Close Guide Instruction (shown in CLR_SCREEN_INFO and SCROLL_INFO stages) */}
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
