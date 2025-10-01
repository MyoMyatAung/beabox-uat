import React, { useState, useEffect, useCallback, useMemo } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import BellIcon from "@/assets/icons/icon-bell.svg";
import WalletIcon from "@/assets/icons/icon-wallet.svg";
import TrophyIcon from "@/assets/icons/icon-trophy.svg";

interface Notification {
    id: string;
    type: "balance" | "milestone" | "system";
    title: string;
    message: string;
    timestamp: number;
    icon: string;
    wrapperClass: string;
}

interface NotiStorage {
    lastShown: number;
    shownIds: string[];
}

const STORAGE_KEY = "notipopup_data";
// const COOLDOWN_MINUTES = 1;
// const COOLDOWN_MS = COOLDOWN_MINUTES * 60 * 1000;
// 4 hours cooldown
const COOLDOWN_MS = 4 * 60 * 60 * 1000;

const NOTIFICATION_ROUTE = "/notifications";

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: "1",
        type: "balance",
        title: "Balance Alert",
        message:
            "Withdraw Notice: You've successfully added 20 coins to your wallet. Check your balance now!",
        timestamp: Date.now(),
        icon: WalletIcon,
        wrapperClass: "rounded-full flex-shrink-0 bg-orange-500",
    },
    {
        id: "2",
        type: "milestone",
        title: "Creator Milestones Alert",
        message:
            "Your content has surpassed 1,000 views! Keep it up — more people are following you.",
        timestamp: Date.now(),
        icon: TrophyIcon,
        wrapperClass: "rounded-full flex-shrink-0 bg-purple-500",
    },
    {
        id: "3",
        type: "system",
        title: "System Notification",
        message:
            "Exciting Features Available Now!: Discover the latest updates to enhance your experience.",
        timestamp: Date.now(),
        icon: BellIcon,
        wrapperClass: "rounded-full flex-shrink-0 bg-red-500",
    },
];

const getStorage = (): NotiStorage => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const defaultData: NotiStorage = { lastShown: 0, shownIds: [] };
    if (!raw) return defaultData;
    try {
        return JSON.parse(raw) as NotiStorage;
    } catch {
        return defaultData;
    }
};

const saveStorage = (data: NotiStorage) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        // Handle potential storage errors
    }
};

const shouldShowNotification = (id: string, cooldown: number): boolean => {
    const { lastShown, shownIds } = getStorage();

    if (Date.now() - lastShown < cooldown) return false;
    if (shownIds.includes(id)) return false;

    return true;
};

const markNotificationAsShown = (id: string) => {
    const { shownIds } = getStorage();
    const newData: NotiStorage = {
        lastShown: Date.now(),
        shownIds: Array.from(new Set([...shownIds, id])),
    };
    saveStorage(newData);
};

// --- Notification Item Component ---

const NotificationItem: React.FC<{
    notification: Notification;
    onClose: () => void;
    onDetailClick: (id: string) => void;
    autoCloseMs?: number;
}> = React.memo(
    ({ notification, onClose, onDetailClick, autoCloseMs = 5000 }) => {
        const [isVisible, setIsVisible] = useState(false);

        // Fade in immediately
        useEffect(() => {
            const showTimer = setTimeout(() => setIsVisible(true), 100);
            return () => clearTimeout(showTimer);
        }, []);

        // Auto-close
        useEffect(() => {
            if (!isVisible) return;
            const closeTimer = setTimeout(() => {
                setIsVisible(false);
                const timer = setTimeout(onClose, 300); // wait for fade-out
                return () => clearTimeout(timer);
            }, autoCloseMs);
            return () => clearTimeout(closeTimer);
        }, [isVisible, onClose, autoCloseMs]);

        const handleClose = useCallback(() => {
            setIsVisible(false);
            const timer = setTimeout(onClose, 300);
            return () => clearTimeout(timer);
        }, [onClose]);

        const handleViewDetails = useCallback(() => {
            onDetailClick(notification.id);
        }, [notification.id, onDetailClick]);

        const transitionClasses = useMemo(
            () =>
                isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-4",
            [isVisible]
        );

        return (
            <div
                className={`fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 transition-all duration-300 ease-out z-[99999] ${transitionClasses}`}
            >
                <div className="bg-[#191721] rounded-3xl shadow-2xl p-5 border border-gray-900">
                    <div className="flex items-start gap-2.5">
                        <div className={notification.wrapperClass}>
                            <img
                                src={notification.icon}
                                alt={`${notification.type} icon`}
                                className="w-6 h-6"
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
                                className="text-gray-400 hover:text-white transition-colors p-1"
                                aria-label="Close notification"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleViewDetails}
                                className="bg-gradient-to-b from-[rgba(163,133,255,0.12)] to-[rgba(255,255,255,0.12)] border border-[#F0C3FF]/40 text-[#F0C3FF] px-3 py-1 rounded-full text-xs transition-colors"
                            >
                                Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

const NotiPopUp: React.FC = () => {
    const [notification, setNotification] = useState<Notification | null>(null);
    const navigate = useNavigate();

    const fetchNotification =
        useCallback(async (): Promise<Notification | null> => {
            const randomIndex = Math.floor(
                Math.random() * MOCK_NOTIFICATIONS.length
            );
            return MOCK_NOTIFICATIONS[randomIndex];
        }, []);

    const loadNotification = useCallback(async () => {
        const noti = await fetchNotification();
        if (noti && shouldShowNotification(noti.id, COOLDOWN_MS)) {
            setNotification(noti);
        }
    }, [fetchNotification]);

    const handleClose = useCallback(() => {
        if (notification) markNotificationAsShown(notification.id);
        setNotification(null);
    }, [notification]);

    const handleDetailClick = useCallback(
        (id: string) => {
            markNotificationAsShown(id);
            setNotification(null);
            navigate(NOTIFICATION_ROUTE);
        },
        [navigate]
    );

    useEffect(() => {
        loadNotification();
    }, [loadNotification]);

    return (
        <>
            {notification && (
                <NotificationItem
                    notification={notification}
                    onClose={handleClose}
                    onDetailClick={handleDetailClick}
                    autoCloseMs={5000} // auto-close after 5s
                />
            )}
        </>
    );
};

export default NotiPopUp;
