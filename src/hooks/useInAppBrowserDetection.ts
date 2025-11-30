import { useEffect, useState } from "react";
import { isInAppBrowser } from "@/utils/browserDetection";

/**
 * Custom hook for detecting in-app browsers
 * Single Responsibility: Detect and track in-app browser state
 */
export const useInAppBrowserDetection = (): boolean => {
  const [showInAppBrowserAlert, setShowInAppBrowserAlert] = useState(false);

  useEffect(() => {
    if (isInAppBrowser()) {
      setShowInAppBrowserAlert(true);
    }
  }, []);

  return showInAppBrowserAlert;
};

