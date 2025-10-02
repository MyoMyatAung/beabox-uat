import React, { useState, useEffect, useCallback, useMemo } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import BellIcon from "@/assets/icons/icon-bell.svg";
import WalletIcon from "@/assets/icons/icon-wallet.svg";
import TrophyIcon from "@/assets/icons/icon-trophy.svg";

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
}

interface NotiPopUpProps {
    notiMessage?: Notification | Notification[] | null; // accept single or multiple
}

// --- Storage Helpers ---
const STORAGE_KEY = "notipopup_data";
//const COOLDOWN_MS = 4 * 60 * 60 * 1000; // 4 hours

// test 3min
const COOLDOWN_MS = 1 * 60 * 1000; // 3 minutes

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
    } catch {}
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

        // Fade in
        useEffect(() => {
            const showTimer = setTimeout(() => setIsVisible(true), 100);
            return () => clearTimeout(showTimer);
        }, []);

        // Auto-close
        useEffect(() => {
            if (!isVisible) return;
            const closeTimer = setTimeout(() => {
                setIsVisible(false);
                const timer = setTimeout(onClose, 300); // fade-out
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
                        <div>
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

// --- Main Popup Component ---
const NotiPopUp: React.FC<NotiPopUpProps> = ({ notiMessage }) => {
    const [notification, setNotification] = useState<Notification | null>(null);
    const navigate = useNavigate();

    // Map API notification to UI format
    const mapApiToNotification = useCallback(
        (apiNoti: any): Notification => ({
            id: apiNoti.id,
            type: apiNoti.type,
            title: apiNoti.title,
            message: apiNoti.message,
            timestamp: Date.now(),
            icon:
                apiNoti.type === "balance_alert"
                    ? WalletIcon
                    : apiNoti.type === "creator"
                    ? TrophyIcon
                    : BellIcon,
        }),
        []
    );

    // Load API notification
    useEffect(() => {
        if (!notiMessage) return;

        const notiArray = Array.isArray(notiMessage)
            ? notiMessage
            : [notiMessage];
        const firstNoti = notiArray[0];
        if (!firstNoti) return;

        const mapped = mapApiToNotification(firstNoti);

        const storage = getStorage();

        // only show if id is new and cooldown passed
        const isNewId = !storage.shownIds.includes(mapped.id);
        const isCooldownPassed = Date.now() - storage.lastShown >= COOLDOWN_MS;

        if (isNewId && isCooldownPassed) {
            setNotification(mapped);
            markNotificationAsShown(mapped.id);
        }
    }, [notiMessage, mapApiToNotification]);

    const handleClose = useCallback(() => {
        if (notification) markNotificationAsShown(notification.id);
        setNotification(null);
    }, [notification]);

    const handleDetailClick = useCallback(
        (id: string) => {
            markNotificationAsShown(id);
            setNotification(null);
            navigate("/notifications");
        },
        [navigate]
    );

    return (
        <>
            {notification && (
                <NotificationItem
                    notification={notification}
                    onClose={handleClose}
                    onDetailClick={handleDetailClick}
                    autoCloseMs={5000}
                />
            )}
        </>
    );
};

export default NotiPopUp;
