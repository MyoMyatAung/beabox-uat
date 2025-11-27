import { useEffect } from "react";
import { sendNativeEvent, NativeEventType } from "@/utils/nativeBridge";

/**
 * Custom hook for native bridge communication
 * Single Responsibility: Handle native event communication based on landing page state
 */
export const useNativeBridge = (isLandingPageVisible: boolean): void => {
  useEffect(() => {
    const eventType = isLandingPageVisible
      ? NativeEventType.ADS_STARTED
      : NativeEventType.HOME_STARTED;
    sendNativeEvent(eventType);
  }, [isLandingPageVisible]);
};

