import { useEffect } from "react";
import { isAndroidDevice } from "@/utils/browserDetection";

/**
 * Custom hook for device detection and initialization
 * Single Responsibility: Handle device detection and CSS class management
 */
export const useDeviceDetection = (): void => {
  useEffect(() => {
    const isAndroid = isAndroidDevice();
    if (isAndroid) {
      document.body.classList.add("android");
      document.body.classList.remove("not-android");
    } else {
      document.body.classList.add("not-android");
      document.body.classList.remove("android");
    }
  }, []);
};

