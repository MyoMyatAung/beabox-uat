import { AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { setShowUserGuide } from "@/store/slices/appSlice";
import { isIOSWebView } from "@/lib/deviceInfo";
import ImmersiveUserGuide from "@/components/ImmersiveUserGuide";
import PopUp from "../PopUp";
import AlertRedirect from "../AlertRedirect";
import PasswordSetUpPopUp from "../PasswordSetUpPopUp";
import NotiPopUp from "../NotiPopUp";

/**
 * PopupLayer Component
 * 
 * Business Logic:
 * Manages the display priority and visibility of all popups/modals in the app.
 * Popups are shown in a specific order (priority) to ensure proper user experience.
 * 
 * Priority Order (lower number = higher priority):
 * 1. Event Registration Box (handled in parent)
 * 2. Register Drawer (handled in parent)
 * 3. User Guide (Priority 5) - First-time user onboarding
 * 4. Ad Popup (Priority 6) - App download/advertisement
 * 5. Alert Redirect (Priority 7) - Browser download prompt
 * 6. Auth Drawer (Priority 8) - User authentication
 * 7. Password Setup (Priority 9) - iOS WebView password configuration
 * 8. Notification Popup (Priority 10) - System notifications
 * 
 * Visibility Rules:
 * - Only one popup should be visible at a time (except global components)
 * - Higher priority popups hide lower priority ones
 * - Some popups are conditional (e.g., only on home page, only for browsers)
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
  const dispatch = useDispatch();

  return (
    <>
      {/* =================================================================== */}
      {/* USER GUIDE - PRIORITY 5 */}
      {/* =================================================================== */}
      {/* 
        Business Logic:
        - Shown on every app mount (after landing screen)
        - Guides first-time users through app features
        - Only shown on home page when no event is active
        - Triggers ad popup after completion
      */}
      {showUserGuide && !event && isHome && (
        <ImmersiveUserGuide
          setShowUserGuide={(value: boolean) =>
            dispatch(setShowUserGuide(value))
          }
          setShowAd={setShowAd}
        />
      )}

      {/* =================================================================== */}
      {/* AD POPUP - PRIORITY 6 */}
      {/* =================================================================== */}
      {/* 
        Business Logic:
        - Shown after user guide completes
        - Displays app download advertisements and notices
        - Only shown on home page when no event is active
        - Triggers notification popup after completion
      */}
      <AnimatePresence mode="wait">
        {showAd && !event && isHome && (
          <PopUp
            setShowAd={setShowAd}
            setShowAlert={setShowAlert}
            isBrowser={isBrowser}
            onComplete={onAdComplete}
          />
        )}
      </AnimatePresence>

      {/* =================================================================== */}
      {/* ALERT REDIRECT - PRIORITY 7 */}
      {/* =================================================================== */}
      {/* 
        Business Logic:
        - Shown only in browser (not WebView) after ad popup
        - Prompts user to download native app
        - Requires: ad completed, browser environment, download URL configured, dialog enabled
        - Only shown on home page when no event is active
      */}
      <AnimatePresence>
        {!showAd &&
          showAlert &&
          isBrowser &&
          jumpUrl &&
          showDialog &&
          !event &&
          isHome && (
            <AlertRedirect
              key="alert-redirect"
              event={event}
              setShowAlert={setShowAlert}
              app_download_link={jumpUrl}
            />
          )}
      </AnimatePresence>

      {/* =================================================================== */}
      {/* PASSWORD SETUP - PRIORITY 9 (iOS WebView only) */}
      {/* =================================================================== */}
      {/* 
        Business Logic:
        - Shown only in iOS WebView environments
        - Allows users to set up password for secure access
        - Only shown on home page when no other modals are active
        - Lower priority than user guide and ads
      */}
      {!showAd &&
        !showUserGuide &&
        !showAlert &&
        !isOpen &&
        isIOSWebView() &&
        isHome && (
          <PasswordSetUpPopUp
            showPasswordSetUpPopUp={showPasswordSetUpPopUp}
            setShowPasswordSetUpPopUp={setShowPasswordSetUpPopUp}
          />
        )}

      {/* =================================================================== */}
      {/* NOTIFICATION POPUP - PRIORITY 10 */}
      {/* =================================================================== */}
      {/* 
        Business Logic:
        - Shown after ad popup completes
        - Displays system notifications (balance alerts, creator updates, etc.)
        - Lowest priority - only shown when all other popups are closed
        - Auto-dismisses after a timeout
      */}
      {!showAd &&
        !showUserGuide &&
        !showPasswordSetUpPopUp &&
        showNotiPopUp && (
          <NotiPopUp
            notiMessage={notiMessage?.data}
            closeNotiPopUp={() => setShowNotiPopUp(false)}
          />
        )}
    </>
  );
};

