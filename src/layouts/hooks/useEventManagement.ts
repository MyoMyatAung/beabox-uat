import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setPlay } from "@/page/home/services/playSlice";
import {
  setEventDetail,
  setAnimation,
  setDuration,
} from "@/store/slices/eventSlice";
import {
  useGetCurrentEventQuery,
  useLazyGetEventDetailsQuery,
} from "@/store/api/events/eventApi";
import { EventDetail } from "@/@types/lucky_draw";
import { useSessionManagement } from "./useSessionManagement";

/**
 * Animation delay constant (in milliseconds)
 * Time to wait before showing event animations after page load
 */
const ANIMATION_DELAY = 5000;

/**
 * Custom hook for managing event-related state and logic
 * 
 * Business Logic:
 * - Manages event status from referral codes (for event registration flow)
 * - Controls when event animations are displayed
 * - Prefetches event details for better UX (reduces loading time when user clicks)
 * - Handles navigation to event pages and lucky draw
 * 
 * Event Flow:
 * 1. Check if user came from referral link with event status
 * 2. If event exists and user not logged in, show event registration box
 * 3. Control animation visibility based on multiple conditions (ad state, user state, etc.)
 * 4. Prefetch event details when on home page to improve click response time
 */
export const useEventManagement = (
  eventData: any,
  box: boolean,
  user: any,
  showAd: boolean,
  showAlert: boolean,
  isOpen: boolean,
  showLanding: boolean,
  isHome: boolean,
  currentTab: number,
  hideBar: boolean,
  hideNew: boolean
) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [event, setEvent] = useState(false);
  const [cachedEventDetails, setCachedEventDetails] = useState<{
    data: EventDetail;
  } | null>(null);
  const isFetchingRef = useRef(false);
  const { data: currentEventData } = useGetCurrentEventQuery("");
  const [triggerGetEventDetails] = useLazyGetEventDetailsQuery();
  const { hasClosedAnimation } = useSessionManagement();

  /**
   * Handle event status from referral data
   * 
   * Business Rule:
   * - Only set event if: event data exists, registration box not shown, user not logged in
   * - This prevents showing event registration to already registered/logged-in users
   */
  useEffect(() => {
    if (eventData?.data?.event?.status && !box && !user) {
      setEvent(eventData.data.event.status);
    }
  }, [eventData, box, user]);

  /**
   * Control play state based on event
   * 
   * Business Rule:
   * - If event is active, pause video playback
   * - Events take priority over video content
   */
  useEffect(() => {
    if (event) {
      dispatch(setPlay(false));
    }
  }, [event, dispatch]);

  /**
   * Control animation display logic
   * 
   * Business Rules (priority order):
   * 1. Hide animations if: ad showing AND alert showing AND drawer open AND landing not showing
   * 2. Show animations if: event data exists AND user hasn't closed them AND event active AND no ad AND drawer closed
   * 3. Hide animations if: user manually closed them
   * 4. Delay showing animations by ANIMATION_DELAY to avoid overwhelming user on page load
   */
  useEffect(() => {
    const userHasClosedAnimation = hasClosedAnimation();

    if (showAd && showAlert && isOpen && !showLanding) {
      // Priority 1: Hide if other modals are active
      dispatch(setAnimation(false));
    } else {
      if (currentEventData?.data && !userHasClosedAnimation) {
        if (currentEventData?.status === true && !showAd && !isOpen) {
          // Priority 2: Show animations after delay
          const timeout = setTimeout(() => {
            dispatch(setAnimation(true));
          }, ANIMATION_DELAY);
          return () => clearTimeout(timeout);
        } else {
          dispatch(setAnimation(false));
        }
      }
      if (userHasClosedAnimation) {
        // Priority 3: Respect user preference
        dispatch(setAnimation(false));
      }
    }
  }, [
    currentEventData?.status,
    currentEventData?.data,
    dispatch,
    showAd,
    showLanding,
    showAlert,
    isOpen,
    hasClosedAnimation,
  ]);

  /**
   * Prefetch event details for better UX
   * 
   * Business Logic:
   * - When on home page and event data available, fetch event details in background
   * - Cache the result so clicking animation doesn't require loading
   * - Only fetch once (using ref to prevent duplicate requests)
   * - Store in Redux for immediate access when navigating
   */
  useEffect(() => {
    const prefetchEventDetails = async () => {
      const eventId = currentEventData?.data?.filter(
        (x: any) => x.type === "event"
      )[0]?.id;
      
      if (!eventId || isFetchingRef.current) return;

      try {
        isFetchingRef.current = true;
        const eventDetails = await triggerGetEventDetails(eventId).unwrap();
        
        // Cache for immediate use
        setCachedEventDetails(eventDetails);
        
        // Store in Redux for global access
        dispatch(setEventDetail(eventDetails.data));
        
        // Set countdown duration if event has start time
        if (eventDetails.data?.event_start_time) {
          dispatch(setDuration(eventDetails.data.event_start_time));
        }
      } catch (error) {
        console.error("Failed to prefetch event details:", error);
      } finally {
        isFetchingRef.current = false;
      }
    };

    if (isHome && currentEventData?.data) {
      prefetchEventDetails();
    }
  }, [
    currentEventData?.data,
    isHome,
    dispatch,
    triggerGetEventDetails,
  ]);

  /**
   * Handle click on event animation (countdown)
   * 
   * Business Logic:
   * - Navigate to event details page
   * - Use cached data if available for instant navigation
   * - Refresh data in background to ensure latest info
   * - Update Redux store with event details and countdown duration
   */
  const handleAnimationClick = async () => {
    const eventId = currentEventData?.data?.filter(
      (x: any) => x.type === "event"
    )[0]?.id;
    
    if (!eventId) return;

    // If we have cached data, navigate immediately and refresh in background
    if (cachedEventDetails) {
      navigate(`/events/lucky-draw/${eventId}`);

      try {
        // Refresh data to ensure we have latest info
        const freshEventDetails = await triggerGetEventDetails(
          eventId
        ).unwrap();
        dispatch(setEventDetail(freshEventDetails.data));
        
        if (freshEventDetails.data?.event_start_time) {
          dispatch(setDuration(freshEventDetails.data.event_start_time));
        }
      } catch (error) {
        console.error("Failed to refresh event details:", error);
      }
      return;
    }

    // No cache - fetch then navigate
    try {
      const eventDetails = await triggerGetEventDetails(eventId).unwrap();
      dispatch(setEventDetail(eventDetails.data));
      
      if (eventDetails.data?.event_start_time) {
        dispatch(setDuration(eventDetails.data.event_start_time));
      }
      navigate(`/events/lucky-draw/${eventId}`);
    } catch (error) {
      console.error("Failed to fetch event details:", error);
    }
  };

  /**
   * Handle click on lucky spin animation
   * Navigate to lucky wheel page
   */
  const handleLuckySpinClick = () => {
    navigate("/lucky");
  };

  /**
   * Preload lucky draw component for better performance
   * 
   * Business Logic:
   * - Dynamically import the lucky draw component when conditions are met
   * - Conditions: no ad, no alert, drawer closed, on home, no event, animation showing, on tab 2
   * - This reduces initial bundle size and loads component when likely to be used
   */
  useEffect(() => {
    const shouldPreload =
      !showAd &&
      !showAlert &&
      !isOpen &&
      isHome &&
      !event &&
      currentEventData?.data &&
      currentTab === 2;

    if (shouldPreload) {
      import("@/page/events/Luckydraw");
    }
  }, [
    showAd,
    showAlert,
    isOpen,
    isHome,
    event,
    currentEventData?.data,
    currentTab,
  ]);

  return {
    event,
    setEvent,
    cachedEventDetails,
    handleAnimationClick,
    handleLuckySpinClick,
  };
};

