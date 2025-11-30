import { useEffect, useState } from "react";

/**
 * Device type enumeration
 */
export type DeviceType = "IOS" | "Android" | "";

/**
 * Custom hook for detecting device type and browser environment
 * 
 * Business Logic:
 * - Detects if the app is running in a WebView (native app) or regular browser
 * - Identifies the device type (iOS, Android) based on user agent
 * - Used to conditionally render platform-specific UI elements and handle native bridge communication
 * 
 * @returns Object containing device detection state
 */
export const useDeviceDetection = () => {
  const [isBrowser, setIsBrowser] = useState(false);
  const [deviceType, setDeviceType] = useState<DeviceType>("");

  useEffect(() => {
    /**
     * Check if running in WebView by detecting native bridge handlers
     * WebView environments have webkit.messageHandlers.jsBridge for iOS
     */
    const isWebView = (): boolean => {
      return Boolean(
        (window as any).webkit?.messageHandlers?.jsBridge
      );
    };

    // Get the browser's user agent string and convert it to lowercase
    // This makes it easier to perform case-insensitive checks
    // when determining the device type (iOS or Android) below.
    const userAgent = navigator.userAgent.toLowerCase();

    // Set browser flag: true if NOT in WebView (i.e., regular browser)
    setIsBrowser(!isWebView());

    // Detect device type from user agent
    // iOS devices include: iPhone, iPad, iPod
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

  return { isBrowser, deviceType };
};

