/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import Marquee from "react-fast-marquee";

export interface NotificationItem {
  nickname: string;
  amount: string;
  currency: string;
  text: string;
}

interface NotificationTransitionProps {
  notifications?: NotificationItem[];
  interval?: number;
}

const NotificationTransition: React.FC<NotificationTransitionProps> = ({
  notifications = [],
  interval = 3000,
}) => {
  const [marqueeData, setMarqueeData] = useState('');

  useEffect(() => {
    const data = notifications.reduce((a: any, c: any) => {
      const text = c.text
        .replace(/name/g, c.nickname)
        .replace(/prize/g, c.amount);

      a += "   " + text;
      return a;
    }, "");
    setMarqueeData(data);
  }, [notifications]);

  return (
    <div className="text-[0.875rem] h-10 justify-center content-center overflow-hidden relative text-lg font-bold">
      <Marquee>
        {marqueeData}
      </Marquee>
    </div>
  );
};

export default NotificationTransition;
