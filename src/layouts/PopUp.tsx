import React, { useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../page/explore/explore.css";
import Notice from "./Notice";
import ImageWithSkeleton from "./ImageWithLoader";
import { usePopupData } from "@/hooks/usePopupData";
import { usePopupState } from "@/hooks/usePopupState";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { PopupStage, type PopupImage, type AppItem, type NoticeGroup } from "@/types/popup";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/**
 * Props interface for PopUp component
 * Business Logic: This component manages the entire popup flow sequence
 */
interface PopUpProps {
  /** Callback to hide the ad popup from parent component */
  setShowAd: React.Dispatch<React.SetStateAction<boolean>>;
  /** Callback to show/hide browser alert (for app download prompts) */
  setShowAlert: React.Dispatch<React.SetStateAction<boolean>>;
  /** Whether the app is running in a browser (vs native app) */
  isBrowser: boolean;
  /** Optional callback when popup sequence completes */
  onComplete?: () => void;
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * Close button component (reusable)
 * Business Logic: Standardized close button used across all popup stages
 */
const CloseButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div
    onClick={onClick}
    className="initial_popup_ad_box_close p-[9px] mt-4"
    role="button"
    aria-label="Close popup"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        onClick();
      }
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="23"
      viewBox="0 0 24 23"
      fill="none"
    >
      <path
        d="M17.75 5.75L6.25 17.25"
        stroke="white"
        strokeWidth="1.49593"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.25 5.75L17.75 17.25"
        stroke="white"
        strokeWidth="1.49593"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

/**
 * Start Image Popup Component
 * Business Logic:
 * - Displays promotional images from index_popup API
 * - Each image is clickable and links to jump_url
 * - User can close to proceed to next image or app content
 */
const StartImagePopup: React.FC<{
  image: PopupImage;
  onClose: () => void;
  isVisible: boolean;
}> = ({ image, onClose, isVisible }) => {
  if (!isVisible) return null;

  return (
    <motion.div
      key={`start-image-${image.id}`}
      className="w-[330px] flex flex-col gap-0 justify-center items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <a
        className="flex justify-center items-center index_start_popup_img"
        target="_blank"
        rel="noopener noreferrer"
        href={image.jump_url}
      >
        <img
          className="w-[260px] h-[390px] object-cover"
          src={image.image}
          alt="Promotional content"
        />
      </a>
      <CloseButton onClick={onClose} />
    </motion.div>
  );
};

/**
 * App Content Popup Component
 * Business Logic:
 * - Displays grid of downloadable apps from popup_application API
 * - Shows app icons, titles, and download links
 * - Scrollable grid for multiple apps
 */
const AppContentPopup: React.FC<{
  apps: AppItem[];
  onClose: () => void;
  isVisible: boolean;
}> = ({ apps, onClose, isVisible }) => {
  if (!isVisible) return null;

  return (
    <motion.div
      key="app-content"
      className="w-[330px] mb-20 flex flex-col gap-0 justify-center items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <img
        src="https://zm-cloud.oss-cn-beijing.aliyuncs.com/aisou/61a27f94f64bbd267317.png"
        alt="App header"
      />
      <div className="initial_popup_ad_box w-full h-[325px] overflow-hidden p-2">
        <div className="h-full overflow-y-auto scrollbar-hide">
          <div className="grid grid-cols-4 gap-2">
            {apps.map((app) => (
              <a
                key={app.id}
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col justify-center items-center"
              >
                <div className="w-full aspect-square">
                  <ImageWithSkeleton
                    src={app.image}
                    alt={app.title}
                    className="w-full h-full object-cover rounded-lg border border-[#222]"
                    rounded={true}
                  />
                </div>
                <h1 className="text-white text-[14px] mt-1 truncate w-full text-center">
                  {app.title}
                </h1>
              </a>
            ))}
          </div>
        </div>
      </div>
      <CloseButton onClick={onClose} />
    </motion.div>
  );
};

/**
 * Notice Popup Component
 * Business Logic:
 * - Displays system notices and announcements
 * - Uses the Notice component for rendering notice content
 */
const NoticePopup: React.FC<{
  notices: NoticeGroup[];
  onClose: () => void;
  isVisible: boolean;
}> = ({ notices, onClose, isVisible }) => {
  if (!isVisible || !notices.length) return null;

  return (
    <motion.div
      key="notice"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Notice handleNoticeClose={onClose} notice={notices} />
    </motion.div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * PopUp Component
 * 
 * Business Logic Overview:
 * This component manages a sequential popup flow that displays:
 * 1. Promotional Images (index_popup) - Shown one at a time, user can navigate through them
 * 2. App Content (popup_application) - Grid of downloadable apps
 * 3. Notices - System announcements and updates
 * 
 * Flow Control:
 * - Popups are shown in sequence, not simultaneously
 * - User can close at any stage to proceed to next or exit
 * - On completion, triggers onComplete callback and manages parent state
 * 
 * State Management:
 * - Uses custom hooks to separate data fetching, state management, and side effects
 * - Prevents body scrolling when popup is active
 * - Handles browser vs native app differences for download prompts
 * 
 * Performance:
 * - Memoized calculations to prevent unnecessary re-renders
 * - Conditional rendering to avoid mounting unused components
 * - Proper cleanup of timers and event listeners
 */
const PopUp: React.FC<PopUpProps> = ({
  setShowAd,
  setShowAlert,
  isBrowser,
  onComplete,
}) => {
  // Fetch popup data from APIs
  const { popupImages, appList, noticeList } = usePopupData();

  // Manage popup state and transitions
  const {
    state,
    currentImage,
    handleNextImage,
    handleAppContentComplete,
    handleClose,
  } = usePopupState(popupImages);

  // Lock body scroll when popup is active
  const isPopupActive = state.stage !== PopupStage.CLOSED;
  useBodyScrollLock(isPopupActive);

  /**
   * Determine if popup should be visible
   * Business Logic: Show popup if we have content to display and it's not closed
   */
  const shouldShowPopup = useMemo(() => {
    const hasStartImages = popupImages.length > 0;
    const hasAppContent = appList.length > 0;
    const hasNotices = noticeList.length > 0;
    const hasContent = hasStartImages || hasAppContent || hasNotices;

    return hasContent && isPopupActive;
  }, [popupImages.length, appList.length, noticeList.length, isPopupActive]);

  /**
   * Handle app content close
   * Business Logic:
   * - If notices exist, proceed to notice stage
   * - Otherwise, close popup and trigger completion
   * - Manage browser alert state based on environment
   */
  const handleAppContentClose = useCallback(() => {
    if (noticeList.length > 0) {
      handleAppContentComplete();
    } else {
      handleFinalClose();
    }
  }, [noticeList.length, handleAppContentComplete]);

  /**
   * Handle final popup close
   * Business Logic:
   * - Close popup and update parent state
   * - Show browser alert if in browser environment (for app download)
   * - Trigger onComplete callback if provided
   */
  const handleFinalClose = useCallback(() => {
    handleClose();
    setShowAd(false);

    // Show alert in browser for app download, hide in native app
    setShowAlert(isBrowser);

    // Notify parent that popup sequence is complete
    if (onComplete) {
      onComplete();
    }
  }, [handleClose, setShowAd, setShowAlert, isBrowser, onComplete]);

  // Determine which stage to show
  const showStartImages =
    state.stage === PopupStage.START_IMAGES &&
    currentImage &&
    state.isMounted;
  const showAppContent = state.stage === PopupStage.APP_CONTENT;
  const showNotice =
    state.stage === PopupStage.NOTICE && noticeList.length > 0;

  return (
    <AnimatePresence>
      {shouldShowPopup && (
        <motion.div
          key="popup-overlay"
          className="h-screen bg-black/80 w-screen flex flex-col gap-[20px] justify-center items-center fixed top-0 z-[999999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
        >
          <AnimatePresence mode="wait">
            <StartImagePopup
              image={currentImage!}
              onClose={handleNextImage}
              isVisible={showStartImages}
            />

            <AppContentPopup
              apps={appList}
              onClose={handleAppContentClose}
              isVisible={showAppContent}
            />

            <NoticePopup
              notices={noticeList}
              onClose={handleFinalClose}
              isVisible={showNotice}
            />
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PopUp;
