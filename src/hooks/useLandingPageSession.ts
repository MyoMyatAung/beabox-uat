import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPanding } from "@/store/slices/ModelSlice";

const SESSION_STORAGE_KEY = "hasSeenLanding";

/**
 * Custom hook for managing landing page session state
 * Single Responsibility: Handle landing page visibility based on session storage
 */
export const useLandingPageSession = (): void => {
  const dispatch = useDispatch();

  useEffect(() => {
    const hasSeenLanding = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!hasSeenLanding) {
      dispatch(setPanding(true));
    }
  }, [dispatch]);
};

