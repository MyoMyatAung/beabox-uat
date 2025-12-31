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
 * - Single Responsibility: Each sub-component handles one specific task
 * - Open/Closed: Extensible via props without modifying existing code
 * - Dependency Inversion: Uses RTK Query hooks for data fetching
 *
 * FEATURES:
 * 1. Category Tabs: Navigate between different gossip categories
 * 2. Infinite Scroll: Load more posts as user scrolls
 * 3. RTK Query Caching: Posts cached per category automatically
 * 4. Keep-alive Pattern: Preserves tab state when switching
 * 5. Fullscreen Media Viewer: View images/videos in fullscreen
 * 6. Post Detail Dialog: View post details without navigation
 *
 * USER EXPERIENCE:
 * - Instant tab switching with cached data
 * - Smooth loading states with skeleton placeholders
 * - Share functionality via ShareSheet
 * - Follow success toast notifications
 *
 * COMPONENT HIERARCHY:
 * Gossip
 * ├── Tabs (category navigation using shadcn/ui)
 * │   └── TabsTrigger (category buttons)
 * ├── GossipTabContent (per-category content with keep-alive)
 * │   ├── PostSkeleton (loading state)
 * │   └── GossipPostList (infinite scroll + posts)
 * │       └── GossipPost (individual post with actions)
 * ├── MediaFullscreenViewer (lazy-loaded, fullscreen media)
 * ├── ShareSheet (lazy-loaded, share functionality)
 * ├── FollowSuccessToast (follow notification)
 * └── PostDetailDialog (fullscreen post detail view)
 *
 * @see types.ts for type definitions
 * @see constants.ts for configuration values
 * @see GossipTabContent for tab content implementation
 */

import { useEffect, useCallback, lazy, Suspense, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

// Lazy-loaded components for code splitting
const MediaFullscreenViewer = lazy(
  () => import("./components/MediaFullscreenViewer")
);

// Store imports
import { RootState } from "@/store/store";
import { sethideNew } from "@/page/home/services/hideNewSlice";
import { closeFullScreenGossip } from "@/store/slices/fullScreenGossipSlice";
import { closeShareGossip } from "@/store/slices/shareGossipSlice";
import { hideFollowToast } from "@/store/slices/followToastSlice";

// API hooks
import { useGetGossipCategoriesQuery } from "./services/gossipSlice";

// UI components
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingSpinner from "./components/LoadingSpinner";
import ShareSheet from "./components/ShareSheet";
import FollowSuccessToast from "./components/FollowSuccessToast";
import GossipTabContent from "./components/GossipTabContent";
import PostDetailDialog from "./components/PostDetailDialog";

/**
 * Main Gossip page component.
 *
 * Orchestrates the gossip feed experience by composing specialized hooks
 * and components. Handles tab switching with state preservation.
 */
const Gossip = () => {
  const dispatch = useDispatch();
  const { isOpen, index, post } = useSelector(
    (state: RootState) => state.fullScreenGossip
  );
  const { isOpen: isShareOpen, shareUrl } = useSelector(
    (state: RootState) => state.shareGossip
  );
  const { isOpen: isFollowToastOpen, isFollowed } = useSelector(
    (state: RootState) => state.followToast
  );

  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);
  // Track visited tabs for keep-alive (only mount once visited)
  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(new Set());

  // ============================================================================
  // HOOKS: Tabs Management
  // ============================================================================
  // Manages category tabs, active tab state, and localStorage persistence
  const {
    data: categoryList = [],
    isLoading,
    error,
  } = useGetGossipCategoriesQuery();

  const categoryErrorMessage = useMemo(() => {
    if (error) {
      if (typeof error === "object" && error !== null) {
        if ("status" in error) {
          const errData = (error as { data?: { message?: string } }).data;
          return errData?.message || "频道加载失败，请稍后重试";
        }
        if ("message" in error) {
          return (error as { message?: string }).message || "频道加载失败，请稍后重试";
        }
      }
      return "频道加载失败，请稍后重试";
    }

    if (!isLoading && !categoryList.length) {
      return "当前频道暂未配置分类，请稍后再试";
    }

    return null;
  }, [categoryList.length, error, isLoading]);

  useEffect(() => {
    if (!activeTab && categoryList.length) {
      const firstTabId = categoryList[0].id;
      setActiveTab(firstTabId);
      setVisitedTabs(new Set([firstTabId]));
    }
  }, [activeTab, categoryList]);

  // Handle tab change - add to visited tabs
  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
    setVisitedTabs((prev) => new Set(prev).add(tabId));
  }, []);

  // ============================================================================
  // EFFECTS: Bottom Navigation Visibility
  // ============================================================================
  // Ensure bottom navigation bar is visible on the gossip page
  useEffect(() => {
    dispatch(sethideNew(false));
  }, [dispatch]);

  // ============================================================================
  // HANDLERS: Follow Toast
  // ============================================================================
  /**
   * Handle hide follow toast.
   */
  const handleHideFollowToast = useCallback(() => {
    dispatch(hideFollowToast());
  }, [dispatch]);

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <>
      <div className="w-full h-svh bg-[#16131C] overflow-hidden flex flex-col">
        <div className="sticky top-0 z-10 bg-[#16131C] px-4 py-3 shrink-0">
          {isLoading ? (
            <div className="flex h-14 items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : categoryList.length ? (
            <div className="relative">
              <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-[#16131C] to-transparent z-10" />
              <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-[#16131C] to-transparent z-10" />
              <Tabs
                value={activeTab ?? categoryList[0]?.id}
                onValueChange={handleTabChange}
              >
                <TabsList
                  className={`flex items-center ${
                    categoryList.length <= 4 ? "justify-center" : "justify-start"
                  } text-white min-h-14 overflow-x-auto scrollbar-hide px-6 bg-transparent`}
                >
                  <div className="flex items-center gap-5 w-max">
                    {categoryList.map((category) => (
                      <TabsTrigger
                        key={category.id}
                        value={category.id}
                        className="flex flex-col items-center cursor-pointer min-w-20 px-3 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                      >
                        <div className="w-[24px] h-[3px] bg-transparent rounded-full transition-all duration-300" />
                        <p
                          className={`whitespace-nowrap transition-all duration-300 ease-in-out ${
                            activeTab === category.id
                              ? "text-2xl text-white opacity-100 font-semibold home-normal-text-shadow"
                              : "home-normal-text"
                          }`}
                        >
                          {category.name}
                        </p>
                        <div
                          className={`w-[24px] h-[3px] rounded-full ${
                            activeTab === category.id ? "bg-white" : "bg-transparent"
                          }`}
                        />
                      </TabsTrigger>
                    ))}
                  </div>
                </TabsList>
              </Tabs>
            </div>
          ) : (
            <div className="text-sm text-[#8B8498]">暂无频道</div>
          )}
          {categoryErrorMessage && (
            <div className="mt-2 text-xs text-[#F87171]">
              {categoryErrorMessage}
            </div>
          )}
        </div>

        {/* Tab Content - Keep-alive pattern: render all visited tabs, show/hide via isActive */}
        {categoryList.map((category) =>
          visitedTabs.has(category.id) ? (
            <GossipTabContent
              key={category.id}
              categoryId={category.id}
              isActive={activeTab === category.id}
            />
          ) : null
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
              like_count: post?.like_count || 0,
              comment_count: post?.comment_count || 0,
              share_count: post?.share_count || 0,
              is_liked: post?.is_liked || false,
              share_link: post?.share_link || "",
              onLike: () => {},
              onComment: () => {},
              onShare: () => {},
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
        onHide={handleHideFollowToast}
      />

      {/* Post Detail Dialog */}
      <PostDetailDialog />
    </>
  );
};

export default Gossip;
