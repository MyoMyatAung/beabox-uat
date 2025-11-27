import { useEffect, useState } from "react";
import { isAndroidDevice } from "@/utils/browserDetection";
import { VIDEO_SELECTORS, VIDEO_STYLES } from "@/constants/videoSelectors";

/**
 * Custom hook for adjusting video element heights on mobile browsers
 * Single Responsibility: Handle video height adjustments for mobile devices
 */
export const useVideoHeightAdjustment = (): void => {
  const [isMobileBrowser, setIsMobileBrowser] = useState(false);

  useEffect(() => {
    const checkIfMobileBrowser = () => {
      setIsMobileBrowser(isAndroidDevice());
    };

    const adjustVideoHeight = () => {
      if (!isMobileBrowser) return;

      const videoElement = document.querySelector(
        VIDEO_SELECTORS.VIDEO
      ) as HTMLElement | null;
      const videoElement1 = document.querySelector(
        VIDEO_SELECTORS.VIDEO1
      ) as HTMLElement | null;
      const videoFooter = document.querySelector(
        VIDEO_SELECTORS.VIDEO_FOOTER
      ) as HTMLElement | null;

      if (videoElement) {
        videoElement.style.height = VIDEO_STYLES.MOBILE_VIDEO_HEIGHT;
      }

      if (videoElement1) {
        videoElement1.style.height = VIDEO_STYLES.MOBILE_VIDEO1_HEIGHT;
      }

      if (videoFooter) {
        videoFooter.style.bottom = VIDEO_STYLES.MOBILE_FOOTER_BOTTOM;
      }
    };

    checkIfMobileBrowser();
    adjustVideoHeight();

    window.addEventListener("resize", adjustVideoHeight);

    return () => {
      window.removeEventListener("resize", adjustVideoHeight);
    };
  }, [isMobileBrowser]);
};

