import { useEffect, useState, useCallback } from "react";
import { PopupStage, ANIMATION_DELAY_MS, type PopupImage, type PopupState } from "@/types/popup";

/**
 * Custom hook to manage popup state and transitions
 * Business Logic:
 * - Manages the sequential flow: Start Images -> App Content -> Notice -> Closed
 * - Handles image navigation (multiple start images shown in sequence)
 * - Controls animation mounting state
 * 
 * @param popupImages Array of popup images to display
 * @returns Popup state and handler functions
 */
export const usePopupState = (popupImages: PopupImage[]) => {
  const [state, setState] = useState<PopupState>({
    stage: PopupStage.START_IMAGES,
    currentImageIndex: 0,
    isMounted: false,
  });

  const hasMoreImages = state.currentImageIndex < popupImages.length - 1;
  const currentImage = popupImages[state.currentImageIndex];

  /**
   * Move to next image or advance to app content stage
   * Business Logic: If more images exist, show next. Otherwise, proceed to app content.
   */
  const handleNextImage = useCallback(() => {
    if (hasMoreImages) {
      setState((prev) => ({
        ...prev,
        currentImageIndex: prev.currentImageIndex + 1,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        stage: PopupStage.APP_CONTENT,
        currentImageIndex: 0,
      }));
    }
  }, [hasMoreImages]);

  /**
   * Advance from app content to notice stage
   * Business Logic: After showing app grid, proceed to show notices if available
   */
  const handleAppContentComplete = useCallback(() => {
    setState((prev) => ({
      ...prev,
      stage: PopupStage.NOTICE,
    }));
  }, []);

  /**
   * Close the popup completely
   * Business Logic: Mark popup as closed, ready for cleanup
   */
  const handleClose = useCallback(() => {
    setState((prev) => ({
      ...prev,
      stage: PopupStage.CLOSED,
    }));
  }, []);

  /**
   * Trigger animation mount after delay
   * Business Logic: Small delay ensures smooth animation entrance
   */
  useEffect(() => {
    if (currentImage || state.stage === PopupStage.APP_CONTENT) {
      const timer = setTimeout(() => {
        setState((prev) => ({ ...prev, isMounted: true }));
      }, ANIMATION_DELAY_MS);
      return () => clearTimeout(timer);
    }
  }, [currentImage, state.stage]);

  return {
    state,
    currentImage,
    handleNextImage,
    handleAppContentComplete,
    handleClose,
  };
};
