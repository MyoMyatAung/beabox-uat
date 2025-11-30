import { useState } from "react";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { setAnimation } from "@/store/slices/eventSlice";
import AnimationLoader from "@/components/shared/animation-loader";
import countdownAnimation from "@/lotties/Animation.json";
import luckySpinAnimation from "@/lotties/SpinWheel.json";
import fabAnimation from "@/lotties/Welfare.json";
import CloseSvg from "@/assets/icons/Close.svg";
import { useSessionManagement } from "../hooks/useSessionManagement";

/**
 * Animation configuration constants
 */
const ANIMATION_CONFIG = {
  SIZES: {
    COUNTDOWN: { width: 110 },
    LUCKY_SPIN: { width: 85, height: 100 },
    FAB: { width: 100, height: 100 },
  },
  POSITIONS: {
    COUNTDOWN: "bottom-[calc(22rem+16px)] left-2",
    LUCKY_SPIN: "bottom-[calc(19rem+16px)] left-4",
    FAB: "bottom-[calc(12rem+16px)] left-1",
  },
  SPRING_CONFIG: {
    type: "spring" as const,
    damping: 20,
    stiffness: 300,
  },
} as const;

interface EventAnimationsProps {
  /**
   * Handler for countdown animation click
   * Navigates to event details page
   */
  onCountdownClick: () => void;
  
  /**
   * Handler for lucky spin animation click
   * Navigates to lucky wheel page
   */
  onLuckySpinClick: () => void;
}

/**
 * EventAnimations Component
 * 
 * Business Logic:
 * - Displays floating action button (FAB) that expands to show event animations
 * - FAB shows countdown and lucky spin animations when expanded
 * - User can close animations permanently (preference saved in session)
 * - Animations are positioned at fixed bottom-left locations
 * - Uses spring animations for smooth entrance/exit
 * 
 * Animation Hierarchy:
 * 1. FAB (always visible when conditions met) - toggles showEvent state
 * 2. Countdown animation (shown when FAB expanded) - navigates to event details
 * 3. Lucky spin animation (shown when FAB expanded) - navigates to lucky wheel
 */
export const EventAnimations: React.FC<EventAnimationsProps> = ({
  onCountdownClick,
  onLuckySpinClick,
}) => {
  const dispatch = useDispatch();
  const [showEvent, setShowEvent] = useState(false);
  const { markAnimationClosed } = useSessionManagement();

  /**
   * Handle close button click
   * 
   * Business Logic:
   * - Hides animations immediately
   * - Saves preference to session storage (prevents showing again)
   * - Updates Redux state to hide animations globally
   */
  const handleClose = () => {
    dispatch(setAnimation(false));
    markAnimationClosed();
  };

  return (
    <>
      {/* Expandable animations (countdown and lucky spin) */}
      <AnimatePresence>
        {showEvent && (
          <>
            {/* Countdown Animation - Event Details Entry Point */}
            <motion.div
              key="countdown"
              className={`fixed ${ANIMATION_CONFIG.POSITIONS.COUNTDOWN} z-[9999] rounded-full p-2`}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={ANIMATION_CONFIG.SPRING_CONFIG}
            >
              <div className="relative">
                <AnimationLoader
                  animationData={countdownAnimation}
                  {...ANIMATION_CONFIG.SIZES.COUNTDOWN}
                  onClick={onCountdownClick}
                />
              </div>
            </motion.div>

            {/* Lucky Spin Animation - Lucky Wheel Entry Point */}
            <motion.div
              key="luckySpin"
              className={`fixed ${ANIMATION_CONFIG.POSITIONS.LUCKY_SPIN} z-[9999] rounded-full p-2`}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{
                ...ANIMATION_CONFIG.SPRING_CONFIG,
                delay: 0.1, // Slight delay for staggered animation effect
              }}
            >
              <div className="relative">
                <AnimationLoader
                  animationData={luckySpinAnimation}
                  {...ANIMATION_CONFIG.SIZES.LUCKY_SPIN}
                  onClick={onLuckySpinClick}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* FAB (Floating Action Button) - Main Toggle */}
      <div
        className={`fixed ${ANIMATION_CONFIG.POSITIONS.FAB} z-[9999] rounded-full p-2`}
      >
        <div className="relative">
          {/* Close Button - Allows user to permanently dismiss animations */}
          <button
            className="absolute top-1 right-2 bg-red rounded-full w-5 h-5 flex items-center justify-center text-black z-[10000]"
            onClick={handleClose}
            aria-label="Close event animations"
          >
            <img src={CloseSvg} alt="Close" />
          </button>
          
          {/* FAB Animation - Toggles visibility of countdown and lucky spin */}
          <AnimationLoader
            animationData={fabAnimation}
            {...ANIMATION_CONFIG.SIZES.FAB}
            onClick={() => setShowEvent(!showEvent)}
          />
        </div>
      </div>
    </>
  );
};

