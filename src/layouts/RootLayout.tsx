/* eslint-disable @typescript-eslint/no-explicit-any */
import { BottomNav } from "@/components/shared/bottom-nav";
import PopUp from "./PopUp";
import { useEffect, useState } from "react";
import { useGetApplicationAdsQuery } from "@/store/api/explore/exploreApi";
import { useDispatch } from "react-redux";
import { setApplicationData } from "@/store/slices/exploreSlice";

const RootLayout = ({ children }: any) => {
  const [showAd, setShowAd] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    const hasSeenAdPopUp = sessionStorage.getItem("hasSeenAdPopUp");
    if (!hasSeenAdPopUp) {
      setShowAd(true);
      sessionStorage.setItem("hasSeenAdPopUp", "true");
    }
  }, []);

  const { data, isLoading } = useGetApplicationAdsQuery("");

  useEffect(() => {
    if (data?.data) {
      const cur = data?.data?.carousel;
      dispatch(setApplicationData(data?.data));
      // setApplicationData(data?.data);
      // setad(cur);
    }
  }, [data,dispatch]);

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
