/**
 * Custom hook for managing session storage flags
 *
 * Business Logic:
 * - Tracks user's progress through the app onboarding flow
 * - Prevents showing the same screens multiple times in a session
 * - Flags are stored in sessionStorage (cleared when browser tab closes)
 *
 * Session Flags:
 * - hasSeenAdPopUp: User has seen the ad popup (prevents re-showing ads)
 * - hasSeenLanding: User has seen the landing screen (skips landing animation)
 * - animationClosed: User manually closed event animations (persists preference)
 * - showEvent: Whether event animations are expanded (persists across navigation)
 */
export const useSessionManagement = () => {
  /**
   * Check if user has seen the ad popup in this session
   * Used to skip ad loading if user already viewed it
   */
  const hasSeenAdPopUp = (): boolean => {
    return !!sessionStorage.getItem("hasSeenAdPopUp");
  };

  /**
   * Check if user has seen the landing screen in this session
   * Used to skip landing animation on subsequent visits
   */
  const hasSeenLanding = (): boolean => {
    return !!sessionStorage.getItem("hasSeenLanding");
  };

  /**
   * Check if user has manually closed event animations
   * Persists across page navigations to respect user preference
   */
  const hasClosedAnimation = (): boolean => {
    return sessionStorage.getItem("animationClosed") === "true";
  };

  /**
   * Mark that user has seen the landing screen
   * Called after landing screen completes to prevent re-showing
   */
  const markLandingSeen = (): void => {
    sessionStorage.setItem("hasSeenLanding", "true");
  };

  /**
   * Mark that user has manually closed animations
   * Called when user clicks close button on event animations
   */
  const markAnimationClosed = (): void => {
    sessionStorage.setItem("animationClosed", "true");
  };

  /**
   * Get the showEvent state from session storage
   * Persists across page navigations to maintain expanded state
   */
  const getShowEvent = (): boolean => {
    return sessionStorage.getItem("showEvent") === "true";
  };

  /**
   * Set the showEvent state in session storage
   * Called when user toggles event animations visibility
   */
  const setShowEvent = (value: boolean): void => {
    sessionStorage.setItem("showEvent", value.toString());
  };

  return {
    hasSeenAdPopUp,
    hasSeenLanding,
    hasClosedAnimation,
    markLandingSeen,
    markAnimationClosed,
    getShowEvent,
    setShowEvent,
  };
};
