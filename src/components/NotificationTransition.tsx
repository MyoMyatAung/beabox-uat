import React, { useState, useEffect } from 'react';

interface NotificationItem {
  nickname: string;
  amount: string;
  currency: string;
}

interface NotificationTransitionProps {
  notifications?: NotificationItem[];
  interval?: number;
}

const NotificationTransition: React.FC<NotificationTransitionProps> = ({
  notifications = [
    { nickname: "User1", amount: "100", currency: "¥" },
    { nickname: "User2", amount: "200", currency: "¥" },
    { nickname: "User3", amount: "150", currency: "¥" },
  ],
  interval = 3000
}) => {
  const [currentNotification, setCurrentNotification] = useState(0);
  const [notificationVisible, setNotificationVisible] = useState(true);

  useEffect(() => {
    if (notifications.length === 0) return;
    
    const notificationInterval = setInterval(() => {
      setNotificationVisible(false);
      
      setTimeout(() => {
        setCurrentNotification((prev) => 
          (prev + 1) % notifications.length
        );
        setNotificationVisible(true);
      }, 500);
    }, interval);
    
    return () => clearInterval(notificationInterval);
  }, [notifications, interval]);

  return (
    <div className="text-sm mb-7 h-8 overflow-hidden">
      <div
        className={`transition-all duration-1000 ${
          notificationVisible 
            ? "transform translate-y-0 opacity-100" 
            : "transform -translate-y-6 opacity-5"
        }`}
      >
        {notifications.length > 0 && (
          <p>
            用户：<span className="font-bold text-[16px]">
              {notifications[currentNotification]?.nickname?.substring(0, 5)}
            </span> 成功瓜分红包：
            <span className="font-bold text-[18px]">
              {notifications[currentNotification]?.amount}
              {notifications[currentNotification]?.currency}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default NotificationTransition; 