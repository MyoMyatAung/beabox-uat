import React, { useMemo, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { setShowUserGuide } from "@/store/slices/appSlice";
import { disableScrollRestriction } from "@/store/slices/scrollRestrictionSlice";
import { isIOSWebView } from "@/lib/deviceInfo";

// Popup Components
import ImmersiveUserGuide from "@/components/ImmersiveUserGuide";
import PopUp from "../PopUp";
import AlertRedirect from "../AlertRedirect";
import PasswordSetUpPopUp from "../PasswordSetUpPopUp";
import NotiPopUp from "../NotiPopUp";

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

/**
 * Interface for User Guide popup props
 * Business Logic: First-time user onboarding flow
 */
interface UserGuideProps {
  showUserGuide: boolean;
  setShowAd: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Interface for Ad Popup props
 * Business Logic: App download advertisements and notices
 */
interface AdPopupProps {
  showAd: boolean;
  setShowAd: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAlert: React.Dispatch<React.SetStateAction<boolean>>;
  isBrowser: boolean;
  onAdComplete: () => void;
}

/**
 * Interface for Alert Redirect popup props
 * Business Logic: Browser download prompt for native app
 */
interface AlertRedirectProps {
  showAlert: boolean;
  jumpUrl: string;
  showDialog: boolean;
  event: boolean;
  setShowAlert: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Interface for Password Setup popup props
 * Business Logic: iOS WebView password configuration
 */
interface PasswordSetupProps {
  showPasswordSetUpPopUp: boolean;
  setShowPasswordSetUpPopUp: (value: boolean) => void;
}

/**
 * Interface for Notification popup props
 * Business Logic: System notifications (balance alerts, creator updates)
 */
interface NotificationPopupProps {
  showNotiPopUp: boolean;
  setShowNotiPopUp: (value: boolean) => void;
  notiMessage: any;
}

/**
 * Main PopupLayer component props
 * Combines all popup-related props with conditional flags
 */
interface PopupLayerProps {
  // User Guide Props
  showUserGuide: boolean;
  setShowAd: React.Dispatch<React.SetStateAction<boolean>>;
  
  // Ad Popup Props
  showAd: boolean;
  setShowAlert: React.Dispatch<React.SetStateAction<boolean>>;
  isBrowser: boolean;
  onAdComplete: () => void;
  
  // Alert Redirect Props
  showAlert: boolean;
  jumpUrl: string;
  showDialog: boolean;
  event: boolean;
  
  // Password Setup Props
  showPasswordSetUpPopUp: boolean;
  setShowPasswordSetUpPopUp: (value: boolean) => void;
  
  // Notification Props
  showNotiPopUp: boolean;
  setShowNotiPopUp: (value: boolean) => void;
  notiMessage: any;
  
  // Conditional Flags
  isHome: boolean;
  isOpen: boolean; // Auth drawer open state
}

// =============================================================================
// POPUP PRIORITY CONFIGURATION
// =============================================================================

/**
 * Popup Priority Levels (Documentation)
 * 
 * Lower number = higher priority (shown first)
 * Only one popup should be visible at a time based on priority order.
 * 
 * Priority Order:
 * 1. Event Registration Box (handled in parent - RootLayout)
 * 2. Register Drawer (handled in parent - RootLayout)
 * 3. User Guide (Priority 5) - First-time user onboarding
 * 4. Ad Popup (Priority 6) - App download/advertisement
 * 5. Alert Redirect (Priority 7) - Browser download prompt
 * 6. Auth Drawer (Priority 8) - User authentication (handled in parent)
 * 7. Password Setup (Priority 9) - iOS WebView password configuration
 * 8. Notification Popup (Priority 10) - System notifications
 */

// =============================================================================
// VISIBILITY LOGIC HELPERS
// =============================================================================

/**
 * Determines if User Guide should be visible
 * 
 * Business Logic:
 * - Only shown on home page
 * - Hidden when event is active (events take precedence)
 * - Part of first-time onboarding flow
 */
const shouldShowUserGuide = (
  showUserGuide: boolean,
  event: boolean,
  isHome: boolean
): boolean => {
  return showUserGuide && !event && isHome;
};

/**
 * Determines if Ad Popup should be visible
 * 
 * Business Logic:
 * - Only shown on home page
 * - Hidden when event is active
 * - Shown after user guide completes
 */
const shouldShowAdPopup = (
  showAd: boolean,
  event: boolean,
  isHome: boolean
): boolean => {
  return showAd && !event && isHome;
};

/**
 * Determines if Alert Redirect should be visible
 * 
 * Business Logic:
 * - Only shown in browser (not WebView)
 * - Requires: ad completed, browser environment, download URL configured, dialog enabled
 * - Only shown on home page when no event is active
 */
const shouldShowAlertRedirect = (
  showAlert: boolean,
  showAd: boolean,
  isBrowser: boolean,
  jumpUrl: string,
  showDialog: boolean,
  event: boolean,
  isHome: boolean
): boolean => {
  return (
    !showAd &&
    showAlert &&
    isBrowser &&
    Boolean(jumpUrl) &&
    showDialog &&
    !event &&
    isHome
  );
};

/**
 * Determines if Password Setup should be visible
 * 
 * Business Logic:
 * - Only shown in iOS WebView environments
 * - Only shown on home page
 * - Hidden when higher priority popups are active
 * - Allows users to set up password for secure access
 */
const shouldShowPasswordSetup = (
  showPasswordSetUpPopUp: boolean,
  showAd: boolean,
  showUserGuide: boolean,
  showAlert: boolean,
  isOpen: boolean,
  isHome: boolean
): boolean => {
  return (
    !showAd &&
    !showUserGuide &&
    !showAlert &&
    !isOpen &&
    isIOSWebView() &&
    isHome &&
    showPasswordSetUpPopUp
  );
};

/**
 * Determines if Notification Popup should be visible
 * 
 * Business Logic:
 * - Lowest priority - only shown when all other popups are closed
 * - Shown after ad popup completes
 * - Displays system notifications
 * - Auto-dismisses after a timeout (handled in NotiPopUp component)
 */
const shouldShowNotification = (
  showNotiPopUp: boolean,
  showAd: boolean,
  showUserGuide: boolean,
  showPasswordSetUpPopUp: boolean
): boolean => {
  return (
    !showAd &&
    !showUserGuide &&
    !showPasswordSetUpPopUp &&
    showNotiPopUp
  );
};

// =============================================================================
// MEMOIZED POPUP COMPONENTS
// =============================================================================

/**
 * User Guide Popup Component (Priority 5)
 * 
 * Business Logic:
 * - Guides first-time users through app features
 * - Shown on every app mount (after landing screen)
 * - Only shown on home page when no event is active
 * - Triggers ad popup after completion
 */
const UserGuidePopup = React.memo<UserGuideProps>(
  ({ showUserGuide: _showUserGuide, setShowAd }) => {
    const dispatch = useDispatch();

    return (
      <ImmersiveUserGuide
        setShowUserGuide={(value: boolean) =>
          dispatch(setShowUserGuide(value))
        }
        setShowAd={setShowAd}
      />
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if visibility or setShowAd function changes
    return (
      prevProps.showUserGuide === nextProps.showUserGuide &&
      prevProps.setShowAd === nextProps.setShowAd
    );
  }
);
UserGuidePopup.displayName = "UserGuidePopup";

/**
 * Ad Popup Component (Priority 6)
 * 
 * Business Logic:
 * - Displays app download advertisements and notices
 * - Shown after user guide completes
 * - Only shown on home page when no event is active
 * - Triggers notification popup after completion via onComplete callback
 * - Disables scroll restriction when closed (allows unlimited scrolling)
 */
const AdPopup = React.memo<AdPopupProps>(
  ({
    showAd,
    setShowAd,
    setShowAlert,
    isBrowser,
    onAdComplete,
  }) => {
    const dispatch = useDispatch();

    /**
     * Handle Ad Popup completion
     * Business Logic: When Ad closes, disable scroll restriction to allow unlimited scrolling
     */
    const handleAdPopupComplete = useCallback(() => {
      // Disable scroll restriction - user can now scroll to all videos
      dispatch(disableScrollRestriction());
      
      // Call parent completion handler
      if (onAdComplete) {
        onAdComplete();
      }
    }, [dispatch, onAdComplete]);

    return (
      <AnimatePresence mode="wait">
        {showAd && (
          <PopUp
            setShowAd={setShowAd}
            setShowAlert={setShowAlert}
            isBrowser={isBrowser}
            onComplete={handleAdPopupComplete}
          />
        )}
      </AnimatePresence>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if visibility or critical props change
    return (
      prevProps.showAd === nextProps.showAd &&
      prevProps.isBrowser === nextProps.isBrowser &&
      prevProps.setShowAd === nextProps.setShowAd &&
      prevProps.setShowAlert === nextProps.setShowAlert &&
      prevProps.onAdComplete === nextProps.onAdComplete
    );
  }
);
AdPopup.displayName = "AdPopup";

/**
 * Alert Redirect Component (Priority 7)
 * 
 * Business Logic:
 * - Prompts user to download native app
 * - Shown only in browser (not WebView) after ad popup
 * - Requires: ad completed, browser environment, download URL configured, dialog enabled
 * - Only shown on home page when no event is active
 */
const AlertRedirectPopup = React.memo<AlertRedirectProps>(
  ({
    showAlert,
    jumpUrl,
    event,
    setShowAlert,
  }) => {
    return (
      <AnimatePresence>
        {showAlert && (
          <AlertRedirect
            key="alert-redirect"
            event={event}
            setShowAlert={setShowAlert}
            app_download_link={jumpUrl}
          />
        )}
      </AnimatePresence>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if visibility or critical props change
    return (
      prevProps.showAlert === nextProps.showAlert &&
      prevProps.jumpUrl === nextProps.jumpUrl &&
      prevProps.event === nextProps.event &&
      prevProps.setShowAlert === nextProps.setShowAlert
    );
  }
);
AlertRedirectPopup.displayName = "AlertRedirectPopup";

/**
 * Password Setup Component (Priority 9)
 * 
 * Business Logic:
 * - Allows users to set up password for secure access
 * - Shown only in iOS WebView environments
 * - Only shown on home page when no other modals are active
 * - Lower priority than user guide and ads
 */
const PasswordSetupPopup = React.memo<PasswordSetupProps>(
  ({
    showPasswordSetUpPopUp,
    setShowPasswordSetUpPopUp,
  }) => {
    return (
      <PasswordSetUpPopUp
        showPasswordSetUpPopUp={showPasswordSetUpPopUp}
        setShowPasswordSetUpPopUp={setShowPasswordSetUpPopUp}
      />
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if visibility or setter function changes
    return (
      prevProps.showPasswordSetUpPopUp === nextProps.showPasswordSetUpPopUp &&
      prevProps.setShowPasswordSetUpPopUp === nextProps.setShowPasswordSetUpPopUp
    );
  }
);
PasswordSetupPopup.displayName = "PasswordSetupPopup";

/**
 * Notification Popup Component (Priority 10)
 * 
 * Business Logic:
 * - Displays system notifications (balance alerts, creator updates, etc.)
 * - Lowest priority - only shown when all other popups are closed
 * - Shown after ad popup completes
 * - Auto-dismisses after a timeout (handled internally)
 */
const NotificationPopup = React.memo<NotificationPopupProps>(
  ({
    showNotiPopUp: _showNotiPopUp,
    setShowNotiPopUp,
    notiMessage,
  }) => {
    return (
      <NotiPopUp
        notiMessage={notiMessage?.data}
        closeNotiPopUp={() => setShowNotiPopUp(false)}
      />
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if visibility or notification message changes
    return (
      prevProps.showNotiPopUp === nextProps.showNotiPopUp &&
      prevProps.setShowNotiPopUp === nextProps.setShowNotiPopUp &&
      prevProps.notiMessage === nextProps.notiMessage
    );
  }
);
NotificationPopup.displayName = "NotificationPopup";

// =============================================================================
// MAIN POPUP LAYER COMPONENT
// =============================================================================

/**
 * PopupLayer Component
 * 
 * Purpose:
 * Manages the display priority and visibility of all popups/modals in the app.
 * Popups are shown in a specific order (priority) to ensure proper user experience.
 * 
 * Design Principles:
 * - Single Responsibility: Each popup component handles its own rendering and state
 * - Open/Closed: Easy to extend with new popup types by adding to priority enum
 * - Interface Segregation: Separate interfaces for each popup type
 * - Dependency Inversion: Depends on component interfaces, not concrete implementations
 * 
 * Performance Optimizations:
 * - Memoized popup components to prevent unnecessary re-renders
 * - Computed visibility flags using useMemo
 * - Custom comparison functions for React.memo
 * 
 * Visibility Rules:
 * - Only one popup should be visible at a time (except global components)
 * - Higher priority popups hide lower priority ones
 * - Some popups are conditional (e.g., only on home page, only for browsers)
 * - Visibility is computed based on priority and conditional flags
 */
export const PopupLayer: React.FC<PopupLayerProps> = ({
  showUserGuide,
  setShowAd,
  showAd,
  setShowAlert,
  isBrowser,
  onAdComplete,
  showAlert,
  jumpUrl,
  showDialog,
  event,
  showPasswordSetUpPopUp,
  setShowPasswordSetUpPopUp,
  showNotiPopUp,
  setShowNotiPopUp,
  notiMessage,
  isHome,
  isOpen,
}) => {
  // =============================================================================
  // COMPUTED VISIBILITY FLAGS (Memoized for performance)
  // =============================================================================
  
  /**
   * Compute visibility flags for each popup based on priority and conditions
   * This ensures only the highest priority popup is shown at any time
   */
  const visibility = useMemo(
    () => ({
      userGuide: shouldShowUserGuide(showUserGuide, event, isHome),
      adPopup: shouldShowAdPopup(showAd, event, isHome),
      alertRedirect: shouldShowAlertRedirect(
        showAlert,
        showAd,
        isBrowser,
        jumpUrl,
        showDialog,
        event,
        isHome
      ),
      passwordSetup: shouldShowPasswordSetup(
        showPasswordSetUpPopUp,
        showAd,
        showUserGuide,
        showAlert,
        isOpen,
        isHome
      ),
      notification: shouldShowNotification(
        showNotiPopUp,
        showAd,
        showUserGuide,
        showPasswordSetUpPopUp
      ),
    }),
    [
      showUserGuide,
      showAd,
      showAlert,
      showPasswordSetUpPopUp,
      showNotiPopUp,
      isBrowser,
      jumpUrl,
      showDialog,
      event,
      isHome,
      isOpen,
    ]
  );

  // =============================================================================
  // RENDER POPUPS IN PRIORITY ORDER
  // =============================================================================
  
  /**
   * Render popups in priority order (lower number = higher priority)
   * Only render the highest priority popup that should be visible
   */
  return (
    <>
      {/* Priority 5: User Guide - First-time user onboarding */}
      {visibility.userGuide && (
        <UserGuidePopup
          showUserGuide={showUserGuide}
          setShowAd={setShowAd}
        />
      )}

      {/* Priority 6: Ad Popup - App download advertisements */}
      {visibility.adPopup && (
        <AdPopup
          showAd={showAd}
          setShowAd={setShowAd}
          setShowAlert={setShowAlert}
          isBrowser={isBrowser}
          onAdComplete={onAdComplete}
        />
      )}

      {/* Priority 7: Alert Redirect - Browser download prompt */}
      {visibility.alertRedirect && (
        <AlertRedirectPopup
          showAlert={showAlert}
          jumpUrl={jumpUrl}
          showDialog={showDialog}
          event={event}
          setShowAlert={setShowAlert}
        />
      )}

      {/* Priority 9: Password Setup - iOS WebView password configuration */}
      {visibility.passwordSetup && (
        <PasswordSetupPopup
          showPasswordSetUpPopUp={showPasswordSetUpPopUp}
          setShowPasswordSetUpPopUp={setShowPasswordSetUpPopUp}
        />
      )}

      {/* Priority 10: Notification Popup - System notifications */}
      {visibility.notification && (
        <NotificationPopup
          showNotiPopUp={showNotiPopUp}
          setShowNotiPopUp={setShowNotiPopUp}
          notiMessage={notiMessage}
        />
      )}
    </>
  );
};