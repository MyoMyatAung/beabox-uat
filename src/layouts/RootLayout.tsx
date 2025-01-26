/* eslint-disable @typescript-eslint/no-explicit-any */
import { BottomNav } from "@/components/shared/bottom-nav";
import PopUp from "./PopUp";
import { useEffect, useState } from "react";

const RootLayout = ({ children }: any) => {
  const [showAd, setShowAd] = useState(false);
  useEffect(() => {
    const hasSeenAdPopUp = sessionStorage.getItem("hasSeenAdPopUp");
    if (!hasSeenAdPopUp) {
      setShowAd(true);
      sessionStorage.setItem("hasSeenAdPopUp", "true");
    }
  }, []);
  
  return (
    <div className="h-screen">
      {children}
      {/* <RightSideActions /> */}
      {showAd && <PopUp setShowAd={setShowAd} />}
      <div className="fixed bottom-0 left-0 w-full z-[1300]">
        <BottomNav />
      </div>
    </div>
  );
};

export default RootLayout;
