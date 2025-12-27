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
 * - useGossipPosts: Post fetching, transformation, and pagination (RTK Query)
 * - usePlayerCleanup: Video player memory management
 *
 * FEATURES:
 * 1. Category Tabs: Navigate between different gossip categories
 * 2. Infinite Scroll: Load more posts as user scrolls
 * 3. RTK Query Caching: Posts cached per category automatically
 * 4. Memory Management: Clean up video players on tab change/unmount
 *
 * USER EXPERIENCE:
 * - Instant tab switching with cached data
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

import { useEffect, useMemo, useCallback, lazy, Suspense, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sethideNew } from "@/page/home/services/hideNewSlice";
import { INITIAL_PAGE, SCROLL_CONTAINER_ID } from "./constants";
const MediaFullscreenViewer = lazy(() => import("./components/MediaFullscreenViewer"));

// Hooks
import {
  useGossipTabs,
  useGossipPosts,
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
import LoadingSpinner from "./components/LoadingSpinner";
import { RootState } from "@/store/store";
import { closeFullScreenGossip } from "@/store/slices/fullScreenGossipSlice";
import { useAuthentication } from "./hooks/useAuthentication";
import { usePostLike } from "./hooks/usePostLike";
import ShareSheet from "./components/ShareSheet";
import { closeShareGossip } from "@/store/slices/shareGossipSlice";
import FollowSuccessToast from "./components/FollowSuccessToast";
import { hideFollowToast } from "@/store/slices/followToastSlice";

/**
 * Main Gossip page component.
 *
 * Orchestrates the gossip feed experience by composing specialized hooks
 * and components. Handles tab switching with state preservation.
 */
const Gossip = () => {
  const dispatch = useDispatch();
  const { isOpen, index, post } = useSelector((state: RootState) => state.fullScreenGossip);
  const { isOpen: isShareOpen, shareUrl } = useSelector((state: RootState) => state.shareGossip);
  const { isOpen: isFollowToastOpen, isFollowed } = useSelector((state: RootState) => state.followToast);

    // ============================================================================
  // AUTHENTICATION
  // ============================================================================
  const { ensureAuthenticated } = useAuthentication();

  // ============================================================================
  // POST ACTIONS - Like
  // ============================================================================
  const {
    handleLike,
    likeCount,
    isLiked,
  } = usePostLike(
    post?.post_id ?? "",
    post?.is_liked ?? false,
    post?.like_count ?? 0,
    ensureAuthenticated
  );

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
  // Manages post fetching via RTK Query with built-in caching per category
  const {
    posts,
    setPage,
    hasMore,
    isInitialLoading,
    error: postsError,
    loadMore,
    refetch,
  } = useGossipPosts({
    categoryId: activeTabConfig?.categoryId,
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
  // EFFECTS: Scroll to Top on Tab Change
  // ============================================================================
  // Scroll to the top of the content when user switches tabs
  const prevActiveTabRef = useRef<string | null>(null);
  useEffect(() => {
    // Skip scroll on initial mount
    if (prevActiveTabRef.current === null) {
      prevActiveTabRef.current = activeTab;
      return;
    }

    // Only scroll if the tab actually changed
    if (prevActiveTabRef.current !== activeTab) {
      const scrollContainer = document.getElementById(SCROLL_CONTAINER_ID);
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: 0, behavior: "instant" });
      }
      prevActiveTabRef.current = activeTab;
    }
  }, [activeTab]);

  // ============================================================================
  // HANDLERS: Tab Click
  // ============================================================================
  /**
   * Handle tab click. RTK Query handles data caching automatically per category_id.
   */
  const handleTabClick = useCallback(
    (tabId: string) => {
      if (tabId === activeTab) return;

      // Switch tab (RTK Query handles data caching automatically)
      baseHandleTabClick(tabId);
      // Reset page number to 1 when switching tabs
      setPage(INITIAL_PAGE);
    },
    [activeTab, baseHandleTabClick, setPage]
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
      if (
        typeof postsError === "object" &&
        postsError !== null &&
        "status" in postsError
      ) {
        const errData = (postsError as { status: unknown; data?: { message?: string } }).data;
        return errData?.message || "帖子加载失败，请稍后重试";
      }
      if (
        typeof postsError === "object" &&
        postsError !== null &&
        "message" in postsError
      ) {
        return (postsError as { message?: string }).message || "帖子加载失败，请稍后重试";
      }
      return "帖子加载失败，请稍后重试";
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
    <>
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
      {/* Lazy Loaded Fullscreen Media Viewer */}
      {isOpen && (
        <Suspense fallback={<LoadingSpinner />}>
          <MediaFullscreenViewer
            media={post?.media || []}
            initialIndex={index}
            isOpen={isOpen}
            onClose={() => dispatch(closeFullScreenGossip())}
            initialMuted={false}
            postData={{
              post_id: post?.post_id,
              like_count: likeCount,
              comment_count: post?.comment_count || 0,
              share_count: post?.share_count || 0,
              is_liked: isLiked,
              share_link: post?.share_link || "",
              onLike: () => {
                handleLike();
              },
              onComment: () => { },
              onShare: () => { },
            }}
          />
        </Suspense>
      )}

      {isShareOpen && (
        <Suspense fallback={<LoadingSpinner />}>
          <ShareSheet
            isOpen={isShareOpen}
            shareUrl={shareUrl}
            onClose={() => dispatch(closeShareGossip())}
          />
        </Suspense>
      )}

      <FollowSuccessToast
        show={isFollowToastOpen}
        isFollowed={isFollowed}
        onHide={() => dispatch(hideFollowToast())}
      />
    </>
  );
};

export default Gossip;
