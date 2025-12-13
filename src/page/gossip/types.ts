/**
 * ============================================================================
 * GOSSIP MODULE TYPES
 * ============================================================================
 *
 * Shared type definitions for the Gossip feature module.
 * This file centralizes all interfaces to ensure consistency across components
 * and hooks, following the Single Responsibility Principle.
 */

import type { ComponentProps } from "react";
import type GossipPost from "./components/GossipPost";

// ============================================================================
// TAB TYPES
// ============================================================================

/**
 * Represents a single category tab in the gossip navigation.
 * Each tab corresponds to a gossip category from the API.
 */
export interface Tab {
  /** Unique identifier for the tab (slug or category ID) */
  id: string;
  /** Display label for the tab */
  label: string;
  /** Backend category ID for API requests */
  categoryId: string;
}

/**
 * Simplified tab interface for the navbar component.
 * Contains only display-related properties.
 */
export interface NavbarTab {
  id: string;
  label: string;
}

// ============================================================================
// POST TYPES
// ============================================================================

/**
 * Represents a single gossip post with all its properties.
 * This type is derived from the GossipPost component's props for consistency.
 */
export type GossipPostData = ComponentProps<typeof GossipPost>["post"];

/**
 * Media item within a gossip post (image or video).
 */
export interface GossipMediaItem {
  id: string;
  type: "image" | "video";
  url: string;
  download_url?: string;
  thumbnail_url?: string;
  thumbnail?: string;
}

/**
 * Complete gossip post data structure.
 * Used in the post list and detail views.
 */
export interface GossipPostData {
  post_id: string;
  category_id?: string;
  user: GossipPostUser;
  content: string;
  media: GossipMediaItem[];
  like_count: number;
  comment_count: number;
  share_count: number;
  is_liked: boolean;
  created_at: string;
  share_link: string;
  time_ago: string;
}

// Re-export GossipPostUser from gossipSlice for convenience
export type { GossipPostUser } from "./services/gossipSlice";

/**
 * User information attached to a gossip post.
 */
export interface GossipUserInfo {
  id: string;
  nickname: string;
  profile_image: string;
  is_following: boolean;
  badge: string;
  level: string;
}

// ============================================================================
// CACHE TYPES
// ============================================================================

/**
 * Cached state for a single tab.
 * Used to preserve posts, pagination, and scroll position when switching tabs.
 *
 * This enables:
 * - Instant tab switching without re-fetching data
 * - Scroll position restoration per tab
 * - Reduced API calls and improved UX
 */
export interface TabCache {
  /** Cached posts for this tab */
  posts: GossipPostData[];
  /** Current pagination page number */
  page: number;
  /** Whether more posts are available for pagination */
  hasMore: boolean;
  /** Scroll position (in pixels) to restore */
  scrollPosition: number;
}

/**
 * Map of tab ID to cached tab state.
 */
export type TabCacheMap = Record<string, TabCache>;

// ============================================================================
// SCROLL PRESERVATION TYPES
// ============================================================================

/**
 * Scroll position data persisted to sessionStorage.
 * Used for restoring scroll position after route navigation.
 */
export interface ScrollStorageData {
  /** Active tab ID when scroll position was saved */
  tab: string;
  /** Scroll position in pixels */
  position: number;
}

// ============================================================================
// HOOK RETURN TYPES
// ============================================================================

/**
 * Return type for useGossipTabs hook.
 * Provides tab management state and handlers.
 */
export interface UseGossipTabsReturn {
  /** Array of available tabs */
  tabs: Tab[];
  /** Currently active tab ID */
  activeTab: string;
  /** Currently active tab configuration */
  activeTabConfig: Tab | undefined;
  /** Whether categories are loading */
  isLoading: boolean;
  /** Error from categories API */
  error: unknown;
  /** Handler for tab click events */
  handleTabClick: (tabId: string) => void;
}

/**
 * Return type for useGossipPosts hook.
 * Provides posts data, pagination state, and loading indicators.
 */
export interface UseGossipPostsReturn {
  /** Array of posts to display */
  posts: GossipPostData[];
  /** Current page number */
  page: number;
  /** Whether more posts are available */
  hasMore: boolean;
  /** Whether initial data is loading (show skeleton) */
  isInitialLoading: boolean;
  /** Whether data is currently being fetched (includes pagination) */
  isFetching: boolean;
  /** Error from posts API */
  error: unknown;
  /** Load next page of posts */
  loadMore: () => void;
  /** Refetch current data */
  refetch: () => void;
  /** Set posts directly (for cache restoration) */
  setPosts: (posts: GossipPostData[]) => void;
  /** Set page number (for cache restoration) */
  setPage: (page: number) => void;
  /** Set hasMore state (for cache restoration) */
  setHasMore: (hasMore: boolean) => void;
  /** Reset to initial state */
  reset: () => void;
}

/**
 * Return type for useScrollPreservation hook.
 * Provides scroll position management for tabs.
 */
export interface UseScrollPreservationReturn {
  /** Save current tab state to cache */
  saveCurrentTabState: () => void;
  /** Get cached state for a tab */
  getCachedState: (tabId: string) => TabCache | undefined;
  /** Schedule scroll restoration after render */
  scheduleScrollRestore: (position: number) => void;
  /** Clear pending scroll restoration */
  clearPendingRestore: () => void;
}

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

/**
 * Props for GossipErrorState component.
 */
export interface GossipErrorStateProps {
  /** Error message to display */
  message: string;
  /** Whether retry button should be shown */
  showRetry: boolean;
  /** Callback for retry button click */
  onRetry: () => void;
}

/**
 * Props for GossipPostList component.
 */
export interface GossipPostListProps {
  /** Array of posts to render */
  posts: GossipPostData[];
  /** Whether more posts are available */
  hasMore: boolean;
  /** Callback to load more posts */
  onLoadMore: () => void;
  /** ID of the scroll container element */
  scrollContainerId: string;
}
