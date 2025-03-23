/* eslint-disable @typescript-eslint/no-explicit-any */
import { BottomNav } from "@/components/shared/bottom-nav";
import PopUp from "./PopUp";
import { useEffect, useState } from "react";
import { useGetApplicationAdsQuery } from "@/store/api/explore/exploreApi";
import { useDispatch, useSelector } from "react-redux";
import { setApplicationData, setisLoading } from "@/store/slices/exploreSlice";
import RegisterForm from "@/components/profile/auth/register-form";
import LoginForm from "@/components/profile/auth/login-form";
import AuthDrawer from "@/components/profile/auth/auth-drawer";
import AlertToast from "@/components/shared/alert-toast";
import { setPlay } from "@/page/home/services/playSlice";

const RootLayout = ({ children }: any) => {
  const [showAd, setShowAd] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    const hasSeenAdPopUp = sessionStorage.getItem("hasSeenAdPopUp");
    if (hasSeenAdPopUp) {
      dispatch(setPlay(true));
    }
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
      dispatch(setisLoading(isLoading));
      // setApplicationData(data?.data);
      // setad(cur);
    }
  }, [data, dispatch]);

  const isOpen = useSelector((state: any) => state.profile.isDrawerOpen);

  return (
    <div className="h-screen">
      {children}
      {/* <RightSideActions /> */}
      {showAd && <PopUp setShowAd={setShowAd} />}
      {isOpen ? <AuthDrawer /> : <></>}
      <AlertToast />
      <div className="fixed bottom-0 left-0 w-full z-[1600]">
        <BottomNav />
      </div>
    </div>
  );
};

export default RootLayout;
