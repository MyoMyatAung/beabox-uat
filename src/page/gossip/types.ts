/**
 * ============================================================================
 * GOSSIP MODULE TYPES
 * ============================================================================
 *
 * Shared type definitions for the Gossip feature module.
 * This file centralizes all interfaces to ensure consistency across components,
 * following the Single Responsibility Principle.
 *
 * TYPE CATEGORIES:
 * - Tab Types: Navigation and category types
 * - Post Types: Post data structures
 * - Component Props: Props for gossip components
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
// COMPONENT PROP TYPES
// ============================================================================

/**
 * Props for GossipPostList component.
 * Used for rendering the infinite scroll post list.
 */
export interface GossipPostListProps {
  /** Array of posts to render */
  posts: GossipPostData[];
  /** Whether more posts are available for pagination */
  hasMore: boolean;
  /** Callback to load more posts (triggered by infinite scroll) */
  onLoadMore: () => void;
  /** ID of the scroll container element for scroll detection */
  scrollContainerId: string;
}

/**
 * Props for GossipTabContent component.
 * Used for each category tab's content with keep-alive support.
 */
export interface GossipTabContentProps {
  /** Category ID to fetch posts for */
  categoryId: string;
  /** Whether this tab is currently active/visible */
  isActive: boolean;
}
