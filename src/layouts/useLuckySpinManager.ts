// useLuckySpinManager.ts
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setIsDrawerOpen } from "@/store/slices/profileSlice";

export const useLuckySpinManager = () => {
  const [showLuckySpin, setShowLuckySpin] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const openLuckySpin = () => {
    dispatch(setIsDrawerOpen(true));
    setShowLuckySpin(true);

    sessionStorage.setItem("showLuckySpin", "true");
    window.history.pushState({ isLuckySpinOpen: true }, "", "/detail");
  };

  const closeLuckySpin = () => {
    setShowLuckySpin(false);
    sessionStorage.removeItem("showLuckySpin");
    if (window.history.state?.isLuckySpinOpen) {
      navigate(-1); // Go back in history
    }
  };

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (!event.state?.isLuckySpinOpen && showLuckySpin) {
        closeLuckySpin();
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [showLuckySpin]);

  return { showLuckySpin, openLuckySpin, closeLuckySpin };
};
