/**
 * ============================================================================
 * GOSSIP PAGE COMPONENT
 * ============================================================================
 *
 * Main page component for the Gossip feature - a social media-style feed
 * with categorized posts, infinite scroll, and video player support.
 *
 * ARCHITECTURE:
 * This component follows SOLID principles with clear separation of concerns:
 *
 * - useGossipTabs: Tab/category management and persistence
 * - useGossipPosts: Post fetching, transformation, and pagination
 * - useScrollPreservation: Scroll position caching per tab
 * - usePlayerCleanup: Video player memory management
 *
 * FEATURES:
 * 1. Category Tabs: Navigate between different gossip categories
 * 2. Infinite Scroll: Load more posts as user scrolls
 * 3. Tab State Caching: Preserve posts and scroll position per tab
 * 4. Session Persistence: Remember tab and scroll on route navigation
 * 5. Memory Management: Clean up video players on tab change/unmount
 *
 * USER EXPERIENCE:
 * - Instant tab switching with cached data
 * - Scroll position restored when returning to a tab
 * - Last viewed tab remembered across sessions
 * - Smooth loading states with skeleton placeholders
 *
 * COMPONENT HIERARCHY:
 * Gossip
 * ├── GossipTopNavbar (tab navigation)
 * ├── PostSkeleton (loading state)
 * ├── GossipErrorState (error display)
 * ├── GossipEmptyState (no content)
 * └── GossipPostList (infinite scroll + posts)
 *     └── GossipPost (individual post)
 *
 * @see types.ts for type definitions
 * @see constants.ts for configuration values
 */

import { useEffect, useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { sethideNew } from "@/page/home/services/hideNewSlice";
import { SCROLL_CONTAINER_ID } from "./constants";

// Hooks
import {
  useGossipTabs,
  useGossipPosts,
  useScrollPreservation,
  usePlayerCleanup,
} from "./hooks";

// Components
import GossipTopNavbar from "./components/GossipTopNavbar";
import { PostSkeleton } from "./components/PostSkeleton";
import { GossipErrorState } from "./components/GossipErrorState";
import { GossipEmptyState } from "./components/GossipEmptyState";
import { GossipPostList } from "./components/GossipPostList";

// Types
import type { NavbarTab } from "./types";

/**
 * Main Gossip page component.
 *
 * Orchestrates the gossip feed experience by composing specialized hooks
 * and components. Handles tab switching with state preservation.
 */
const Gossip = () => {
  const dispatch = useDispatch();

  // ============================================================================
  // HOOKS: Tabs Management
  // ============================================================================
  // Manages category tabs, active tab state, and localStorage persistence
  const {
    tabs,
    activeTab,
    activeTabConfig,
    isLoading: isCategoriesLoading,
    error: categoriesError,
    handleTabClick: baseHandleTabClick,
  } = useGossipTabs();

  // ============================================================================
  // HOOKS: Posts Management
  // ============================================================================
  // Manages post fetching, transformation, pagination, and loading states
  const {
    posts,
    page,
    hasMore,
    isInitialLoading,
    isFetching,
    error: postsError,
    loadMore,
    refetch,
    setPosts,
    setPage,
    setHasMore,
    reset: resetPosts,
  } = useGossipPosts({
    categoryId: activeTabConfig?.categoryId,
  });

  // ============================================================================
  // HOOKS: Scroll Preservation
  // ============================================================================
  // Manages scroll position caching per tab and session persistence
  const {
    saveCurrentTabState,
    getCachedState,
    scheduleScrollRestore,
    clearPendingRestore,
  } = useScrollPreservation({
    activeTab,
    posts,
    page,
    hasMore,
  });

  // ============================================================================
  // HOOKS: Player Memory Management
  // ============================================================================
  // Cleans up video players on tab change and component unmount
  usePlayerCleanup({ activeTab });

  // ============================================================================
  // EFFECTS: Bottom Navigation Visibility
  // ============================================================================
  // Ensure bottom navigation bar is visible on the gossip page
  useEffect(() => {
    dispatch(sethideNew(false));
  }, [dispatch]);

  // ============================================================================
  // HANDLERS: Tab Click with State Preservation
  // ============================================================================
  /**
   * Handle tab click with scroll and state preservation.
   *
   * FLOW:
   * 1. Save current tab state to cache
   * 2. Check for cached state in target tab
   * 3a. If cached: Restore posts, pagination, schedule scroll restore
   * 3b. If not cached: Reset to initial state
   * 4. Switch to new tab
   */
  const handleTabClick = useCallback(
    (tabId: string) => {
      if (tabId === activeTab) return;

      // Step 1: Save current tab state before switching
      saveCurrentTabState();

      // Step 2: Check for cached state in target tab
      const cachedState = getCachedState(tabId);

      if (cachedState && cachedState.posts.length > 0) {
        // Step 3a: Restore cached state
        setPosts(cachedState.posts);
        setPage(cachedState.page);
        setHasMore(cachedState.hasMore);
        scheduleScrollRestore(cachedState.scrollPosition);
      } else {
        // Step 3b: No cache - reset to initial state
        resetPosts();
        clearPendingRestore();
      }

      // Step 4: Switch tab (triggers data fetch if no cache)
      baseHandleTabClick(tabId);
    },
    [
      activeTab,
      saveCurrentTabState,
      getCachedState,
      setPosts,
      setPage,
      setHasMore,
      scheduleScrollRestore,
      resetPosts,
      clearPendingRestore,
      baseHandleTabClick,
    ]
  );

  // ============================================================================
  // COMPUTED: Navbar Tabs
  // ============================================================================
  // Transform tabs to navbar format (id + label only)
  const navbarTabs: NavbarTab[] = useMemo(
    () => tabs.map((tab) => ({ id: tab.id, label: tab.label })),
    [tabs]
  );

  // ============================================================================
  // COMPUTED: Error Message
  // ============================================================================
  /**
   * Determine error message to display.
   *
   * Priority:
   * 1. No categories configured
   * 2. Category loading error
   * 3. Posts loading error
   */
  const errorMessage = useMemo(() => {
    // Check for missing categories (configuration issue)
    if (!tabs.length && !isCategoriesLoading) {
      return "当前频道暂未配置分类，请稍后再试";
    }

    // Check for category loading errors
    if (categoriesError && "message" in (categoriesError as any)) {
      return (
        ((categoriesError as { message?: string }).message as string) ||
        "频道加载失败，请稍后重试"
      );
    }

    // Check for posts loading errors
    if (postsError) {
      if ("status" in postsError) {
        const errData = postsError.data as { message?: string };
        return errData?.message || "帖子加载失败，请稍后重试";
      }
      return postsError.message || "帖子加载失败，请稍后重试";
    }

    return null;
  }, [tabs.length, isCategoriesLoading, categoriesError, postsError]);

  // ============================================================================
  // COMPUTED: Display State Flags
  // ============================================================================
  const hasCategoryId = Boolean(activeTabConfig?.categoryId);
  const showSkeleton = isInitialLoading || (isCategoriesLoading && posts.length === 0);
  const showError = !showSkeleton && errorMessage && posts.length === 0;
  const showEmpty = !showSkeleton && !errorMessage && posts.length === 0;
  const showPosts = !showSkeleton && !errorMessage && posts.length > 0;

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className="w-full h-svh bg-[#16131C] overflow-hidden">
      {/* Header: Category Tab Navigation */}
      <GossipTopNavbar
        tabs={navbarTabs}
        activeTab={activeTab}
        onTabClick={handleTabClick}
      />

      {/* Content Area */}
      {showSkeleton ? (
        // Loading State: Skeleton placeholders
        <PostSkeleton />
      ) : (
        // Scrollable Content Container
        <div
          id={SCROLL_CONTAINER_ID}
          className="w-full h-[calc(100vh-136px)] bg-black overflow-y-auto pb-4"
        >
          {/* Error State: Display error with optional retry */}
          {showError && (
            <GossipErrorState
              message={errorMessage!}
              showRetry={hasCategoryId}
              onRetry={refetch}
            />
          )}

          {/* Empty State: No posts available */}
          {showEmpty && <GossipEmptyState />}

          {/* Posts List: Infinite scroll with posts */}
          {showPosts && (
            <GossipPostList
              posts={posts}
              hasMore={hasMore}
              onLoadMore={loadMore}
              scrollContainerId={SCROLL_CONTAINER_ID}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Gossip;
