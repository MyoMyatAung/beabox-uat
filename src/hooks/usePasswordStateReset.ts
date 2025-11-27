import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { resetPasswordState } from "@/page/home/services/passwordSlice";

/**
 * Custom hook for resetting password state on app lifecycle events
 * Single Responsibility: Handle password state cleanup on app close/hide
 */
export const usePasswordStateReset = (): void => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleBeforeUnload = () => {
      dispatch(resetPasswordState());
    };

    const handlePageHide = () => {
      dispatch(resetPasswordState());
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [dispatch]);
};

