import { useEffect, useRef } from "react";

export interface UserAction {
  type: "click" | "touch" | "touchmove" | "touchend" | "scroll" | "wheel";
  timestamp: number;
  target?: string;
  x?: number;
  y?: number;
  deltaX?: number;
  deltaY?: number;
}

type UserActionCallback = (action: UserAction) => void;

/**
 * Custom hook to track user actions (click, touch, scroll) across the entire application
 * @param callback - Optional callback function to handle tracked actions
 * @param enabled - Whether tracking is enabled (default: true)
 */
export const useUserActionTracker = (
  callback?: UserActionCallback,
  enabled: boolean = true
) => {
  const callbackRef = useRef(callback);
  const actionsRef = useRef<UserAction[]>([]);

  // Update callback ref on every render (no useEffect to avoid dependency issues)
  // This ensures we always have the latest callback without causing re-renders
  callbackRef.current = callback;

  useEffect(() => {
    if (!enabled) return;

    // Track when tracking was enabled to ignore initial scroll events
    const enabledAt = Date.now();
    const IGNORE_INITIAL_SCROLL_MS = 500; // Ignore scroll events for 500ms after enabling

    // Store initial scroll positions to detect actual scroll changes
    const initialScrollPositions = new Map<
      HTMLElement | Window | Element,
      { x: number; y: number }
    >();

    const getScrollPosition = (target: HTMLElement | Window | Element) => {
      if (target === window) {
        return { x: window.scrollX, y: window.scrollY };
      }
      if (target === document.documentElement) {
        return { x: window.scrollX, y: window.scrollY };
      }
      const el = target as HTMLElement;
      return { x: el.scrollLeft || 0, y: el.scrollTop || 0 };
    };

    // Store initial scroll positions for all possible scrolling elements
    const scrollingElement =
      document.scrollingElement || document.documentElement;
    initialScrollPositions.set(window, getScrollPosition(window));
    if (document.documentElement) {
      initialScrollPositions.set(
        document.documentElement,
        getScrollPosition(document.documentElement)
      );
    }
    if (scrollingElement) {
      initialScrollPositions.set(
        scrollingElement,
        getScrollPosition(scrollingElement)
      );
    }

    const handleClick = (e: MouseEvent) => {
      const action: UserAction = {
        type: "click",
        timestamp: Date.now(),
        target: (e.target as HTMLElement)?.tagName || "unknown",
        x: e.clientX,
        y: e.clientY,
      };
      actionsRef.current.push(action);
      callbackRef.current?.(action);
    };

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      const action: UserAction = {
        type: "touch",
        timestamp: Date.now(),
        target: (e.target as HTMLElement)?.tagName || "unknown",
        x: touch?.clientX,
        y: touch?.clientY,
      };
      actionsRef.current.push(action);
      callbackRef.current?.(action);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const action: UserAction = {
        type: "touchmove",
        timestamp: Date.now(),
        target: (e.target as HTMLElement)?.tagName || "unknown",
        x: touch?.clientX,
        y: touch?.clientY,
      };
      actionsRef.current.push(action);
      callbackRef.current?.(action);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      const action: UserAction = {
        type: "touchend",
        timestamp: Date.now(),
        target: (e.target as HTMLElement)?.tagName || "unknown",
        x: touch?.clientX,
        y: touch?.clientY,
      };
      actionsRef.current.push(action);
      callbackRef.current?.(action);
    };

    const handleScroll = (e: Event) => {
      const now = Date.now();

      // Ignore scroll events that happen immediately after enabling tracking
      if (now - enabledAt < IGNORE_INITIAL_SCROLL_MS) {
        return;
      }

      // Get the actual scrolling element (could be window, document, or an element)
      const scrollingElement =
        document.scrollingElement || document.documentElement;
      const currentPos = getScrollPosition(scrollingElement);
      const lastPos = initialScrollPositions.get(scrollingElement);

      // Only fire if scroll position actually changed
      if (lastPos && currentPos.x === lastPos.x && currentPos.y === lastPos.y) {
        return;
      }

      // Update stored position
      initialScrollPositions.set(scrollingElement, currentPos);

      const action: UserAction = {
        type: "scroll",
        timestamp: now,
        target: (e.target as HTMLElement)?.tagName || "window",
        deltaX: currentPos.x,
        deltaY: currentPos.y,
      };
      actionsRef.current.push(action);
      callbackRef.current?.(action);
    };

    const handleWheel = (e: WheelEvent) => {
      // Ignore wheel events that happen immediately after enabling tracking
      const now = Date.now();
      if (now - enabledAt < IGNORE_INITIAL_SCROLL_MS) {
        return;
      }

      const action: UserAction = {
        type: "wheel",
        timestamp: now,
        target: (e.target as HTMLElement)?.tagName || "unknown",
        deltaX: e.deltaX,
        deltaY: e.deltaY,
        x: e.clientX,
        y: e.clientY,
      };
      actionsRef.current.push(action);
      callbackRef.current?.(action);
    };

    // Add event listeners with passive option for better performance
    document.addEventListener("click", handleClick, { passive: true });
    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });
    document.addEventListener("scroll", handleScroll, {
      passive: true,
      capture: true,
    });
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("wheel", handleWheel, { passive: true });

    // Cleanup
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("wheel", handleWheel);
    };
  }, [enabled]);

  // Return function to get all tracked actions
  const getActions = () => actionsRef.current;

  // Return function to clear tracked actions
  const clearActions = () => {
    actionsRef.current = [];
  };

  return { getActions, clearActions };
};
