import { useEffect } from "react";

/**
 * Custom hook to manage body scroll lock
 * Business Logic: Prevents background scrolling when popup is visible
 * 
 * @param isActive Whether to lock the body scroll
 */
export const useBodyScrollLock = (isActive: boolean) => {
  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "visible";
      };
    }
  }, [isActive]);
};
