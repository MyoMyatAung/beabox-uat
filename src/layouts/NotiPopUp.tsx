/**
 * NotiPopUp Component
 * 
 * Business Purpose:
 * Displays system notifications (balance alerts, creator updates, etc.) to users
 * with proper state management to prevent duplicate notifications while ensuring
 * important messages are shown on app open.
 * 
 * Key Business Logic:
 * 1. Notifications are shown based on user authentication state and read flags
 * 2. Authenticated users: Show if isReadForAuthenticatedUser is false
 * 3. Unauthenticated users: Show if any of the unauthenticated read flags are false
 * 4. Read flags are reset when user navigates to home (authenticated) or on page unload
 * 5. This ensures notifications appear on every app session but not repeatedly within the same session
 * 
 * Priority: This popup has Priority 10 (lowest) in the PopupLayer system,
 * meaning it only shows when no other higher-priority popups are active.
 */

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import BellIcon from "@/assets/icons/icon-bell.svg";
import WalletIcon from "@/assets/icons/icon-wallet.svg";
import TrophyIcon from "@/assets/icons/icon-trophy.svg";
import notificationSound from "@/assets/notification_sound.mp3";
import { NOTIFICATION_CONFIG } from "@/constants/noti-constant";
import { useSelector } from "react-redux";

// --- Types ---
interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: number;
  icon: string;
}

/**
 * Notification Storage Structure
 * 
 * Business Logic:
 * - lastShown: Timestamp of last notification shown (for cooldown tracking)
 * - shownIds: Array of notification IDs that have been shown (for deduplication)
 * - isReadForAuthenticatedUser: Flag indicating if authenticated user has seen notifications
 *   When true, authenticated users won't see notifications until flag is reset
 * - isReadForUnauthenticatedSystem: Flag for unauthenticated system notifications
 * - isReadForUnauthenticatedCreator: Flag for unauthenticated creator notifications
 * - isReadForUnauthenticatedBalance: Flag for unauthenticated balance notifications
 * 
 * Reset Behavior:
 * - Authenticated users: Flag resets to false when user navigates to home page
 * - All users: All flags reset to false on page unload (beforeunload event)
 * - This ensures notifications show on every app open but not repeatedly in same session
 */
interface NotiStorage {
  lastShown: number;
  shownIds: string[];
  isReadForAuthenticatedUser: boolean;
  isReadForUnauthenticatedSystem: boolean;
  isReadForUnauthenticatedCreator: boolean;
  isReadForUnauthenticatedBalance: boolean;
}

interface NotiPopUpProps {
  notiMessage?: Notification | Notification[] | null;
  closeNotiPopUp: () => void;
}

interface ApiNotification {
  id: string;
  type: string;
  title: string;
  message: string;
}

// =============================================================================
// STORAGE HELPERS
// =============================================================================

/**
 * Retrieves notification storage from localStorage
 * 
 * Business Logic:
 * - Returns default structure if no storage exists or parsing fails
 * - Validates structure to prevent runtime errors from corrupted data
 * - All read flags default to false, meaning notifications will show by default
 */
const getStorage = (): NotiStorage => {
  try {
    const raw = localStorage.getItem(NOTIFICATION_CONFIG.STORAGE_KEY);
    const defaultData: NotiStorage = {
      lastShown: 0,
      shownIds: [],
      isReadForAuthenticatedUser: false,
      isReadForUnauthenticatedSystem: false,
      isReadForUnauthenticatedCreator: false,
      isReadForUnauthenticatedBalance: false,
    };

    if (!raw) return defaultData;

    const parsed = JSON.parse(raw) as NotiStorage;

    // Validate structure
    if (
      typeof parsed.lastShown !== "number" ||
      !Array.isArray(parsed.shownIds)
    ) {
      console.warn(
        "Invalid notification storage format, resetting to defaults"
      );
      return defaultData;
    }

    return parsed;
  } catch (error) {
    console.warn("Failed to parse notification storage:", error);
    return {
      lastShown: 0,
      shownIds: [],
      isReadForAuthenticatedUser: false,
      isReadForUnauthenticatedSystem: false,
      isReadForUnauthenticatedCreator: false,
      isReadForUnauthenticatedBalance: false,
    };
  }
};

/**
 * Saves notification storage to localStorage
 * 
 * Business Logic:
 * - Trims shownIds array to prevent localStorage from growing unbounded
 * - Keeps only the most recent MAX_SHOWN_IDS entries
 * - Silently fails if localStorage quota is exceeded (prevents app crashes)
 */
const saveStorage = (data: NotiStorage): void => {
  try {
    // Prevent localStorage from growing too large
    // Keep only the most recent notification IDs
    const trimmedData: NotiStorage = {
      ...data,
      shownIds: data.shownIds.slice(-NOTIFICATION_CONFIG.MAX_SHOWN_IDS),
    };

    localStorage.setItem(
      NOTIFICATION_CONFIG.STORAGE_KEY,
      JSON.stringify(trimmedData)
    );
  } catch (error) {
    console.warn("Failed to save notification storage:", error);
  }
};

/**
 * Marks a notification as shown in storage
 * 
 * Business Logic:
 * - Updates lastShown timestamp to current time
 * - Adds notification ID to shownIds array (deduplicated using Set)
 * - Preserves all read flags (they are managed separately by reset logic)
 * - This prevents the same notification from being shown multiple times in quick succession
 */
const markNotificationAsShown = (id: string): void => {
  const storage = getStorage();
  const newData: NotiStorage = {
    lastShown: Date.now(),
    shownIds: Array.from(new Set([...storage.shownIds, id])),
    isReadForAuthenticatedUser: storage.isReadForAuthenticatedUser,
    isReadForUnauthenticatedSystem: storage.isReadForUnauthenticatedSystem,
    isReadForUnauthenticatedCreator: storage.isReadForUnauthenticatedCreator,
    isReadForUnauthenticatedBalance: storage.isReadForUnauthenticatedBalance,
  };
  saveStorage(newData);
};

/**
 * Determines if a notification should be shown to the user
 * 
 * Business Logic:
 * 
 * For Authenticated Users (user.token exists):
 * - Show notification if isReadForAuthenticatedUser is false
 * - This flag is set to true when user navigates to home page
 * - Flag resets to false on page unload, ensuring notifications show on next app open
 * 
 * For Unauthenticated Users:
 * - Show notification if ANY of the unauthenticated read flags are false:
 *   - isReadForUnauthenticatedSystem (system notifications)
 *   - isReadForUnauthenticatedCreator (creator notifications)
 *   - isReadForUnauthenticatedBalance (balance notifications)
 * - This allows different notification types to be shown independently
 * - All flags reset to false on page unload
 * 
 * Note: The shownIds array and cooldown logic are currently ignored.
 * Notifications are shown based solely on read flags, which ensures
 * notifications appear on every app session but not repeatedly within the same session.
 * 
 * @param _id - Notification ID (currently not used in logic, kept for future use)
 * @param user - User object from Redux store (used to determine authentication state)
 * @returns true if notification should be shown, false otherwise
 */
const shouldShowNotification = (_id: string, user?: any): boolean => {
  const storage = getStorage();
  
  // Authenticated user logic
  if (user && user?.token) {
    // Show notification if user hasn't "read" notifications yet in this session
    // isReadForAuthenticatedUser becomes true when user navigates to home page
    return storage.isReadForAuthenticatedUser;
  }

  // Unauthenticated user logic
  // Show notification if any of the unauthenticated read flags are false
  // This allows different notification types to be shown independently
  return (
    !storage.isReadForUnauthenticatedSystem ||
    !storage.isReadForUnauthenticatedCreator ||
    !storage.isReadForUnauthenticatedBalance
  );
};

// =============================================================================
// NOTIFICATION ITEM COMPONENT
// =============================================================================

/**
 * Individual notification display component with animations
 * 
 * Business Logic:
 * - Fades in after a short delay (100ms) for smooth appearance
 * - Auto-closes after configurable delay (default 5 seconds)
 * - Supports manual close via X button
 * - Supports "View Details" button that navigates to notifications page
 * - Prevents multiple close actions during closing animation
 * - Includes keyboard accessibility (Escape to close, Enter/Space to view details)
 */
const NotificationItem: React.FC<{
  notification: Notification;
  onClose: () => void;
  onDetailClick: (id: string) => void;
  autoCloseMs?: number;
}> = React.memo(
  ({
    notification,
    onClose,
    onDetailClick,
    autoCloseMs = NOTIFICATION_CONFIG.AUTO_CLOSE_DELAY,
  }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const timersRef = useRef<NodeJS.Timeout[]>([]);

    // Cleanup all timers on unmount to prevent memory leaks
    useEffect(() => {
      return () => {
        timersRef.current.forEach(clearTimeout);
      };
    }, []);

    /**
     * Fade in animation effect
     * Business Logic: Delays visibility to create smooth fade-in animation
     * Starts invisible, then becomes visible after FADE_IN_DELAY (100ms)
     */
    useEffect(() => {
      const showTimer = setTimeout(() => {
        setIsVisible(true);
      }, NOTIFICATION_CONFIG.FADE_IN_DELAY);
      timersRef.current.push(showTimer);

      return () => clearTimeout(showTimer);
    }, []);

    /**
     * Auto-close effect
     * Business Logic:
     * - Waits for notification to become visible before starting auto-close timer
     * - After autoCloseMs (default 5 seconds), triggers closing animation
     * - Closing animation takes FADE_OUT_DURATION (300ms) before calling onClose
     * - Prevents auto-close if user is already manually closing
     */
    useEffect(() => {
      if (!isVisible || isClosing) return;

      const closeTimer = setTimeout(() => {
        setIsClosing(true);
        setIsVisible(false);

        // Wait for fade-out animation to complete before removing from DOM
        const fadeTimer = setTimeout(() => {
          onClose();
        }, NOTIFICATION_CONFIG.FADE_OUT_DURATION);

        timersRef.current.push(fadeTimer);
      }, autoCloseMs);

      timersRef.current.push(closeTimer);

      return () => clearTimeout(closeTimer);
    }, [isVisible, isClosing, onClose, autoCloseMs]);

    /**
     * Manual close handler
     * Business Logic:
     * - Prevents multiple close actions during closing animation
     * - Triggers fade-out animation before calling onClose callback
     */
    const handleClose = useCallback(() => {
      if (isClosing) return;

      setIsClosing(true);
      setIsVisible(false);

      const fadeTimer = setTimeout(() => {
        onClose();
      }, NOTIFICATION_CONFIG.FADE_OUT_DURATION);

      timersRef.current.push(fadeTimer);
    }, [onClose, isClosing]);

    /**
     * View details handler
     * Business Logic:
     * - Closes notification with fade-out animation
     * - Navigates to notifications page after animation completes
     * - Prevents action if already closing
     */
    const handleViewDetails = useCallback(() => {
      if (isClosing) return;

      setIsClosing(true);
      setIsVisible(false);

      const fadeTimer = setTimeout(() => {
        onDetailClick(notification.id);
      }, NOTIFICATION_CONFIG.FADE_OUT_DURATION);

      timersRef.current.push(fadeTimer);
    }, [notification.id, onDetailClick, isClosing]);

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (event.key === "Escape") {
          handleClose();
        } else if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleViewDetails();
        }
      },
      [handleClose, handleViewDetails]
    );

    const transitionClasses = useMemo(
      () =>
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4",
      [isVisible]
    );

    return (
      <div
        className={`fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 transition-all duration-300 ease-out z-[${NOTIFICATION_CONFIG.Z_INDEX}] ${transitionClasses}`}
        role="alert"
        aria-live="polite"
        aria-label={`Notification: ${notification.title}`}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <div className="bg-[#191721] rounded-3xl shadow-2xl p-5 border border-gray-900">
          <div className="flex items-start gap-2.5">
            <div className="flex-shrink-0">
              <img
                src={notification.icon}
                alt={`${notification.type} notification icon`}
                className="w-6 h-6"
                onError={(e) => {
                  // Fallback to default icon if image fails to load
                  (e.target as HTMLImageElement).src = BellIcon;
                }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-white text-sm font-semibold mb-1">
                {notification.title}
              </h3>
              <p className="text-[#AAAAAA] text-xs leading-relaxed line-clamp-2">
                {notification.message}
              </p>
            </div>

            <div className="flex flex-col items-end gap-3 flex-shrink-0">
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Close notification"
                disabled={isClosing}
              >
                <X className="w-5 h-5" />
              </button>
              <button
                onClick={handleViewDetails}
                className="bg-gradient-to-b from-[rgba(163,133,255,0.12)] to-[rgba(255,255,255,0.12)] border border-[#F0C3FF]/40 text-[#F0C3FF] px-3 py-1 rounded-full text-xs transition-colors hover:from-[rgba(163,133,255,0.2)] hover:to-[rgba(255,255,255,0.2)] focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={isClosing}
              >
                查看详情
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

NotificationItem.displayName = "NotificationItem";

// =============================================================================
// MAIN POPUP COMPONENT
// =============================================================================

/**
 * Main notification popup component
 * 
 * Business Logic Flow:
 * 1. Receives notification data from parent (RootLayout via PopupLayer)
 * 2. Validates and maps API notification format to UI format
 * 3. Checks if notification should be shown based on user state and read flags
 * 4. If shown, marks notification as shown and displays it
 * 5. Plays notification sound when notification appears
 * 6. Manages read flags based on user navigation and page lifecycle
 * 
 * State Management:
 * - Read flags reset when authenticated user navigates to home page
 * - All read flags reset on page unload (beforeunload event)
 * - This ensures notifications show on every app open but not repeatedly in same session
 */
const NotiPopUp: React.FC<NotiPopUpProps> = ({ notiMessage, closeNotiPopUp }) => {
  const location = useLocation();
  const user = useSelector((state: any) => state.persist.user);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  /**
   * Maps API notification format to UI notification format
   * 
   * Business Logic:
   * - Validates required fields (id, type, title, message)
   * - Assigns appropriate icon based on notification type:
   *   - balance_alert → Wallet icon
   *   - creator → Trophy icon
   *   - default → Bell icon
   * - Adds timestamp for tracking
   */
  const mapApiToNotification = useCallback(
    (apiNoti: ApiNotification): Notification => {
      // Validate required fields
      if (!apiNoti.id || !apiNoti.type || !apiNoti.title || !apiNoti.message) {
        throw new Error("Invalid notification data: missing required fields");
      }

      return {
        id: apiNoti.id,
        type: apiNoti.type,
        title: apiNoti.title,
        message: apiNoti.message,
        timestamp: Date.now(),
        icon: (() => {
          switch (apiNoti.type) {
            case "balance_alert":
              return WalletIcon;
            case "creator":
              return TrophyIcon;
            default:
              return BellIcon;
          }
        })(),
      };
    },
    []
  );

  /**
   * Process incoming notifications
   * 
   * Business Logic:
   * 1. Handles both single notification and array of notifications
   * 2. Takes first notification if array is provided
   * 3. Validates and maps API format to UI format
   * 4. Checks if notification should be shown based on user state and read flags
   * 5. If should show: sets notification state and marks as shown in storage
   * 6. Uses isProcessing flag to prevent concurrent processing
   */
  useEffect(() => {
    if (!notiMessage || isProcessing) return;

    setIsProcessing(true);

    try {
      // Handle both single notification and array of notifications
      const notiArray = Array.isArray(notiMessage)
        ? notiMessage
        : [notiMessage];
      const firstNoti = notiArray[0];

      if (!firstNoti) {
        setIsProcessing(false);
        return;
      }

      const mapped = mapApiToNotification(firstNoti);

      // Check if we should show this notification based on user state and read flags
      if (shouldShowNotification(mapped.id, user)) {
        setNotification(mapped);
        markNotificationAsShown(mapped.id);
      }

      // Debug logging (remove in production)
      if (process.env.NODE_ENV === "development") {
        console.log("Notification processed:", {
          id: mapped.id,
          type: mapped.type,
          shouldShow: shouldShowNotification(mapped.id),
          cooldownRemaining: Math.max(
            0,
            NOTIFICATION_CONFIG.COOLDOWN_MS -
            (Date.now() - getStorage().lastShown)
          ),
        });
      }
    } catch (error) {
      console.error("Failed to process notification:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [notiMessage, mapApiToNotification, isProcessing]);

  /**
   * Close handler - clears notification state and calls parent close callback
   */
  const handleClose = useCallback(() => {
    setNotification(null);
    closeNotiPopUp();
  }, [closeNotiPopUp]);

  /**
   * Detail click handler - navigates to notifications page
   */
  const handleDetailClick = useCallback(() => {
    setNotification(null);
    navigate("/notifications");
  }, [navigate]);

  /**
   * Reset read flag for authenticated users when they navigate to home page
   * 
   * Business Logic:
   * - When authenticated user navigates to home page ("/"), set isReadForAuthenticatedUser to true
   * - This prevents notifications from showing again in the same session
   * - Preserves unauthenticated flags (they are managed separately)
   * - This ensures notifications show once per session for authenticated users
   */
  useEffect(() => {
    const storage = getStorage();
    if (user?.token && location.pathname === "/") {
      const newData: NotiStorage = {
        lastShown: Date.now(),
        shownIds: storage.shownIds,
        isReadForAuthenticatedUser: true,
        isReadForUnauthenticatedSystem: storage.isReadForUnauthenticatedSystem,
        isReadForUnauthenticatedCreator:
          storage.isReadForUnauthenticatedCreator,
        isReadForUnauthenticatedBalance:
          storage.isReadForUnauthenticatedBalance,
      };
      saveStorage(newData);
    }
  }, [location.pathname, user?.token]);

  /**
   * Reset all read flags on page unload
   * 
   * Business Logic:
   * - When user closes/refreshes the page, reset ALL read flags to false
   * - This ensures notifications will show again on next app open
   * - Preserves shownIds and lastShown for tracking purposes
   * - This is the key mechanism that allows notifications to show on every app session
   */
  useEffect(() => {
    const handleBeforeUnload = () => {
      const storage = getStorage();
      const newData: NotiStorage = {
        lastShown: Date.now(),
        shownIds: storage.shownIds,
        isReadForAuthenticatedUser: false,
        isReadForUnauthenticatedSystem: false,
        isReadForUnauthenticatedCreator: false,
        isReadForUnauthenticatedBalance: false,
      };
      saveStorage(newData);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  /**
   * Play notification sound when notification is shown
   * 
   * Business Logic:
   * - Initializes audio element on first notification (lazy loading)
   * - Sets volume to 50% to avoid being too loud
   * - Attempts to play sound when notification appears
   * - Gracefully handles autoplay restrictions (browsers may block autoplay)
   * - Cleans up audio when notification is removed (pauses and resets)
   */
  useEffect(() => {
    if (!notification) return;

    // Initialize audio if not already created (lazy loading for performance)
    if (!audioRef.current) {
      audioRef.current = new Audio(notificationSound);
      audioRef.current.volume = 0.5; // Set volume to 50% to avoid being too loud
    }

    // Play the sound
    const playSound = async () => {
      try {
        await audioRef.current?.play();
      } catch (error) {
        // Handle autoplay restrictions (browsers may block autoplay)
        // This is expected behavior and should not break the notification flow
        console.warn("Failed to play notification sound:", error);
      }
    };

    playSound();

    // Cleanup: pause and reset audio when notification is removed
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [notification]);

  // Don't render if no notification or still processing
  // This prevents flickering and ensures smooth user experience
  if (!notification || isProcessing) {
    return null;
  }

  return (
    <NotificationItem
      notification={notification}
      onClose={handleClose}
      onDetailClick={handleDetailClick}
      autoCloseMs={NOTIFICATION_CONFIG.AUTO_CLOSE_DELAY}
    />
  );
};

NotiPopUp.displayName = "NotiPopUp";

export default NotiPopUp;
