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

// --- Storage Helpers ---
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

const saveStorage = (data: NotiStorage): void => {
  try {
    // Prevent localStorage from growing too large
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

const shouldShowNotification = (id: string, user?: any): boolean => {
  const storage = getStorage();
  // const isNewId = !storage.shownIds.includes(id); --- IGNORE ---
  // Show notifications on every app open (don't block by previously shown IDs).
  // Still respect cooldown to avoid rapid repeats during the same session.
  // --- IGNORE ---
  //
  // const isCooldownPassed =
  //   Date.now() - storage.lastShown >= NOTIFICATION_CONFIG.COOLDOWN_MS;
  // return isCooldownPassed;
  if (user.token) {
    return storage.isReadForAuthenticatedUser;
  }

  return (
    !storage.isReadForUnauthenticatedSystem ||
    !storage.isReadForUnauthenticatedCreator ||
    !storage.isReadForUnauthenticatedBalance
  );
};

// --- Notification Item Component ---
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

    // Cleanup all timers on unmount
    useEffect(() => {
      return () => {
        timersRef.current.forEach(clearTimeout);
      };
    }, []);

    // Fade in effect
    useEffect(() => {
      const showTimer = setTimeout(() => {
        setIsVisible(true);
      }, NOTIFICATION_CONFIG.FADE_IN_DELAY);
      timersRef.current.push(showTimer);

      return () => clearTimeout(showTimer);
    }, []);

    // Auto-close effect
    useEffect(() => {
      if (!isVisible || isClosing) return;

      const closeTimer = setTimeout(() => {
        setIsClosing(true);
        setIsVisible(false);

        const fadeTimer = setTimeout(() => {
          onClose();
        }, NOTIFICATION_CONFIG.FADE_OUT_DURATION);

        timersRef.current.push(fadeTimer);
      }, autoCloseMs);

      timersRef.current.push(closeTimer);

      return () => clearTimeout(closeTimer);
    }, [isVisible, isClosing, onClose, autoCloseMs]);

    const handleClose = useCallback(() => {
      if (isClosing) return;

      setIsClosing(true);
      setIsVisible(false);

      const fadeTimer = setTimeout(() => {
        onClose();
      }, NOTIFICATION_CONFIG.FADE_OUT_DURATION);

      timersRef.current.push(fadeTimer);
    }, [onClose, isClosing]);

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

// --- Main Popup Component ---
const NotiPopUp: React.FC<NotiPopUpProps> = ({ notiMessage, closeNotiPopUp }) => {
  const location = useLocation();
  const user = useSelector((state: any) => state.persist.user);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Map API notification to UI format with validation
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

  // Process incoming notifications
  useEffect(() => {
    if (!notiMessage || isProcessing) return;

    setIsProcessing(true);

    try {
      const notiArray = Array.isArray(notiMessage)
        ? notiMessage
        : [notiMessage];
      const firstNoti = notiArray[0];

      if (!firstNoti) {
        setIsProcessing(false);
        return;
      }

      const mapped = mapApiToNotification(firstNoti);

      // Check if we should show this notification
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

  const handleClose = useCallback(() => {
    setNotification(null);
    closeNotiPopUp();
  }, [closeNotiPopUp]);

  const handleDetailClick = useCallback(() => {
    setNotification(null);
    navigate("/notifications");
  }, [navigate]);

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

  // Play notification sound when notification is shown
  useEffect(() => {
    if (!notification) return;

    // Initialize audio if not already created
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
