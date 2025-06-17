// useLuckySpinManager.ts
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useLuckySpinManager = () => {
  const [showLuckySpin, setShowLuckySpin] = useState(false);
  const navigate = useNavigate();

  const openLuckySpin = () => {
    window.history.pushState({ isLuckySpinOpen: true }, "", "/detail");
    setShowLuckySpin(true);
    sessionStorage.setItem("showLuckySpin", "true");
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
