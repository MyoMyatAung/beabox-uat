import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPlay } from "@/page/home/services/playSlice";
import { useSessionManagement } from "./useSessionManagement";

/**
 * Native bridge communication utility
 * Sends messages to native app when running in WebView
 */
const sendNativeEvent = (message: string): void => {
  const isWebView = (): boolean => {
    return Boolean(
      (window as any).webkit?.messageHandlers?.jsBridge
    );
  };

  if (isWebView()) {
    (window as any).webkit.messageHandlers.jsBridge.postMessage(message);
  }
};

/**
 * Custom hook for app initialization logic
 * 
 * Business Logic:
 * - Determines initial app state based on user's session history
 * - If user has already seen ads and landing, skip to main app (faster startup)
 * - Otherwise, show loading screen and ads (first-time or new session experience)
 * - Sends native events to track app lifecycle for analytics
 * 
 * Flow:
 * 1. Check session flags (hasSeenAdPopUp, hasSeenLanding)
 * 2. If both true: Skip loading, start app immediately, notify native "home_started"
 * 3. If false: Show loading screen, notify native "ads_started"
 */
export const useAppInitialization = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { hasSeenAdPopUp, hasSeenLanding } = useSessionManagement();

  useEffect(() => {
    /**
     * Initialize app based on session state
     * 
     * Business Rule:
     * - If user has seen both ad popup and landing screen in this session,
     *   they've completed the onboarding flow, so we can skip directly to the app
     * - Otherwise, show the loading screen which will trigger the full onboarding
     */
    if (hasSeenAdPopUp() && hasSeenLanding()) {
      // User has completed onboarding - start app immediately
      dispatch(setPlay(true));
      sendNativeEvent("beabox_home_started");
    } else {
      // First time or new session - show loading screen
      setIsLoading(true);
      sendNativeEvent("beabox_ads_started");
    }
  }, [dispatch, hasSeenAdPopUp, hasSeenLanding]);

  return { isLoading, setIsLoading };
};

