/**
 * ============================================================================
 * USE SCROLL PRESERVATION HOOK
 * ============================================================================
 *
 * Custom hook for preserving and restoring scroll positions per tab.
 *
 * RESPONSIBILITIES:
 * - Cache scroll position and state per tab (in-memory)
 * - Persist scroll position to sessionStorage for route navigation
 * - Restore scroll position when switching tabs or navigating back
 *
 * PRESERVATION STRATEGIES:
 * 1. In-Memory Tab Cache: Fast restoration when switching between tabs
 * 2. SessionStorage: Persists scroll position for route navigation
 *
 * BUSINESS LOGIC:
 * - When switching tabs, current state is saved before switch
 * - When returning to a tab, cached state is restored
 * - When navigating away and back, sessionStorage is used
 * - Scroll restoration uses requestAnimationFrame for DOM timing
 *
 * PERFORMANCE:
 * - Scroll save is debounced to prevent excessive storage writes
 * - In-memory cache provides instant tab switching
 */

import { useRef, useEffect, useCallback } from "react";
import {
  GOSSIP_SCROLL_STORAGE_KEY,
  SCROLL_CONTAINER_ID,
  SCROLL_SAVE_DEBOUNCE_MS,
} from "../constants";
import type {
  TabCache,
  TabCacheMap,
  ScrollStorageData,
  GossipPostData,
} from "../types";

interface UseScrollPreservationOptions {
  /** Current active tab ID */
  activeTab: string;
  /** Current posts array */
  posts: GossipPostData[];
  /** Current page number */
  page: number;
  /** Current hasMore state */
  hasMore: boolean;
}

interface UseScrollPreservationReturn {
  /** Save current tab state to cache before switching */
  saveCurrentTabState: () => void;
  /** Get cached state for a specific tab */
  getCachedState: (tabId: string) => TabCache | undefined;
  /** Schedule scroll position restoration after next render */
  scheduleScrollRestore: (position: number) => void;
  /** Clear any pending scroll restoration */
  clearPendingRestore: () => void;
}

/**
 * Hook for preserving scroll positions across tab switches and route navigation.
 *
 * @param options - Current state to preserve
 * @returns Methods for saving and restoring scroll state
 *
 * @example
 * ```tsx
 * const { saveCurrentTabState, getCachedState, scheduleScrollRestore } =
 *   useScrollPreservation({ activeTab, posts, page, hasMore });
 *
 * const handleTabSwitch = (newTabId: string) => {
 *   saveCurrentTabState();
 *   const cached = getCachedState(newTabId);
 *   if (cached) {
 *     scheduleScrollRestore(cached.scrollPosition);
 *   }
 * };
 * ```
 */
export function useScrollPreservation({
  activeTab,
  posts,
  page,
  hasMore,
}: UseScrollPreservationOptions): UseScrollPreservationReturn {
  // In-memory cache for tab states (survives tab switches)
  const tabCacheRef = useRef<TabCacheMap>({});

  // Pending scroll position to restore after render
  const pendingScrollRestoreRef = useRef<number | null>(null);

  // Track initial mount for route navigation restoration
  const isInitialMountRef = useRef(true);

  /**
   * Get the scroll container DOM element.
   */
  const getScrollContainer = useCallback((): HTMLElement | null => {
    return document.getElementById(SCROLL_CONTAINER_ID);
  }, []);

  /**
   * Save current tab state to in-memory cache.
   * Called before switching tabs to preserve state.
   */
  const saveCurrentTabState = useCallback(() => {
    if (!activeTab) return;

    const scrollContainer = getScrollContainer();
    const scrollPosition = scrollContainer?.scrollTop ?? 0;

    tabCacheRef.current[activeTab] = {
      posts,
      page,
      hasMore,
      scrollPosition,
    };
  }, [activeTab, posts, page, hasMore, getScrollContainer]);

  /**
   * Get cached state for a specific tab.
   */
  const getCachedState = useCallback((tabId: string): TabCache | undefined => {
    return tabCacheRef.current[tabId];
  }, []);

  /**
   * Schedule scroll position restoration for after next render.
   */
  const scheduleScrollRestore = useCallback((position: number) => {
    pendingScrollRestoreRef.current = position;
  }, []);

  /**
   * Clear any pending scroll restoration.
   */
  const clearPendingRestore = useCallback(() => {
    pendingScrollRestoreRef.current = null;
  }, []);

  /**
   * Effect: Restore scroll position after posts load.
   *
   * Priority order:
   * 1. Pending tab switch restoration (in-memory cache)
   * 2. Route navigation restoration (sessionStorage) - only on initial mount
   */
  useEffect(() => {
    if (posts.length === 0 || !activeTab) return;

    const scrollContainer = getScrollContainer();
    if (!scrollContainer) return;

    // Priority 1: Restore from pending tab switch
    if (pendingScrollRestoreRef.current !== null) {
      const targetPosition = pendingScrollRestoreRef.current;
      pendingScrollRestoreRef.current = null;

      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        scrollContainer.scrollTop = targetPosition;
      });
      return;
    }

    // Priority 2: Restore from sessionStorage on initial mount
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;

      try {
        const savedState = sessionStorage.getItem(GOSSIP_SCROLL_STORAGE_KEY);
        if (savedState) {
          const { tab, position }: ScrollStorageData = JSON.parse(savedState);
          if (tab === activeTab && position > 0) {
            requestAnimationFrame(() => {
              scrollContainer.scrollTop = position;
            });
          }
        }
      } catch {
        // Ignore parsing errors - corrupted storage data
      }
    }
  }, [posts.length, activeTab, getScrollContainer]);

  /**
   * Effect: Debounced save of scroll position to sessionStorage.
   * Enables scroll restoration after route navigation.
   */
  useEffect(() => {
    const scrollContainer = getScrollContainer();
    if (!scrollContainer || !activeTab) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        try {
          const storageData: ScrollStorageData = {
            tab: activeTab,
            position: scrollContainer.scrollTop,
          };
          sessionStorage.setItem(
            GOSSIP_SCROLL_STORAGE_KEY,
            JSON.stringify(storageData)
          );
        } catch {
          // Ignore storage errors (quota exceeded, etc.)
        }
      }, SCROLL_SAVE_DEBOUNCE_MS);
    };

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, [activeTab, getScrollContainer]);

  /**
   * Effect: Save scroll position to sessionStorage on unmount.
   * Ensures position is saved when navigating away from the page.
   */
  useEffect(() => {
    return () => {
      const scrollContainer = getScrollContainer();
      if (scrollContainer && activeTab) {
        try {
          const storageData: ScrollStorageData = {
            tab: activeTab,
            position: scrollContainer.scrollTop,
          };
          sessionStorage.setItem(
            GOSSIP_SCROLL_STORAGE_KEY,
            JSON.stringify(storageData)
          );
        } catch {
          // Ignore storage errors
        }
      }
    };
  }, [activeTab, getScrollContainer]);

  return {
    saveCurrentTabState,
    getCachedState,
    scheduleScrollRestore,
    clearPendingRestore,
  };
}

export default useScrollPreservation;
