/**
 * ============================================================================
 * USE GOSSIP POSTS HOOK
 * ============================================================================
 *
 * Custom hook for fetching and managing gossip posts with pagination.
 *
 * RESPONSIBILITIES:
 * - Fetches posts from API with pagination support
 * - Transforms API response to component-friendly format
 * - Manages posts state with deduplication
 * - Handles loading and error states
 *
 * BUSINESS LOGIC:
 * - Posts are fetched per category (categoryId)
 * - Pagination uses page-based approach with configurable page size
 * - New posts are appended while preventing duplicates
 * - hasMore flag controls infinite scroll behavior
 *
 * DATA TRANSFORMATION:
 * - API response is normalized to ensure consistent data structure
 * - Missing fields are defaulted to prevent runtime errors
 * - Media items are filtered to only include valid entries
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import { useGetGossipPostsQuery } from "../services/gossipSlice";
import type { GossipPostMedia } from "../services/gossipSlice";
import { DEFAULT_PAGE_SIZE, INITIAL_PAGE } from "../constants";
import type { GossipPostData, UseGossipPostsReturn } from "../types";

interface UseGossipPostsOptions {
  /** Category ID to fetch posts for */
  categoryId: string | undefined;
  /** Number of posts per page */
  pageSize?: number;
}

/**
 * Hook for fetching and managing gossip posts with infinite scroll pagination.
 *
 * @param options - Configuration options
 * @returns Posts state, loading indicators, and control methods
 *
 * @example
 * ```tsx
 * const { posts, hasMore, isInitialLoading, loadMore } = useGossipPosts({
 *   categoryId: activeTabConfig?.categoryId
 * });
 *
 * return (
 *   <InfiniteScroll onLoadMore={loadMore} hasMore={hasMore}>
 *     {posts.map(post => <PostCard key={post.post_id} post={post} />)}
 *   </InfiniteScroll>
 * );
 * ```
 */
export function useGossipPosts({
  categoryId,
  pageSize = DEFAULT_PAGE_SIZE,
}: UseGossipPostsOptions): UseGossipPostsReturn {
  const [page, setPage] = useState(INITIAL_PAGE);
  const [posts, setPosts] = useState<GossipPostData[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const hasCategoryId = Boolean(categoryId);

  // Fetch posts from API
  // Skip query if no category ID is available
  const {
    data: apiPostsResponse,
    isLoading: isPostsLoading,
    isFetching: isPostsFetching,
    error,
    refetch,
  } = useGetGossipPostsQuery(
    {
      category_id: categoryId ?? "",
      page,
      pageSize,
    },
    {
      skip: !hasCategoryId,
    }
  );

  /**
   * Transform API posts to component-friendly format.
   * Handles missing/null fields and normalizes data structure.
   */
  const mappedApiPosts: GossipPostData[] = useMemo(() => {
    if (!apiPostsResponse?.data?.length) return [];

    return apiPostsResponse.data.map((post, index) => {
      // Normalize user data with defaults
      const nickname = post.user?.nickname?.trim() || "匿名用户";
      const userId =
        post.user?.id !== undefined ? String(post.user.id) : `user-${index}`;

      // Filter and normalize media items
      // Only include items with valid URLs
      const mediaItems: GossipPostData["media"] = Array.isArray(post.media)
        ? post.media
            .filter((item): item is GossipPostMedia =>
              Boolean(item && (item.url || item.download_url))
            )
            .map((item, mediaIndex) => {
              const mediaUrl = item.download_url || item.url || "";
              return {
                id: `${post.id || `post-${index}`}-media-${mediaIndex}`,
                type: item.type === "video" ? "video" : "image",
                url: mediaUrl,
                download_url: item.download_url,
                thumbnail_url: (item as any).thumbnail_url || (item as any).thumbnail,
              };
            })
        : [];

      return {
        post_id: post.id || `post-${index}`,
        category_id: post.category_id || "",
        user: {
          id: userId,
          nickname: nickname,
          profile_image: post.user?.profile_image || "",
          is_following: post.user?.is_following ?? false,
          badge: post.user?.badge ?? "",
          level: post.user?.level ?? "",
        },
        content: post.description || "",
        media: mediaItems,
        like_count: Number(post.like_count ?? 0),
        comment_count: Number(post.comment_count ?? 0),
        share_count: Number(post.share_count ?? 0),
        share_link: post.share_link || "",
        is_liked: Boolean(post.is_liked),
        created_at: post.created_at || new Date().toISOString(),
        time_ago: post.time_ago || "",
      };
    });
  }, [apiPostsResponse]);

  /**
   * Merge new posts with existing posts, preventing duplicates.
   * On page 1 (fresh load), replaces all posts.
   * On subsequent pages, appends only new unique posts.
   */
  useEffect(() => {
    if (!apiPostsResponse) return;

    const newPosts = mappedApiPosts;

    setPosts((prev) => {
      // Page 1: Replace all posts (fresh load or category change)
      if (page === 1) {
        return newPosts;
      }

      // Subsequent pages: Append only new unique posts
      const existingIds = new Set(prev.map((item) => item.post_id));
      const combined = [...prev];

      newPosts.forEach((item) => {
        if (!existingIds.has(item.post_id)) {
          combined.push(item);
        }
      });

      return combined;
    });

    // Update hasMore based on pagination info
    const pagination = apiPostsResponse.pagination;
    if (pagination) {
      setHasMore(pagination.current_page < pagination.last_page);
    } else {
      // Fallback: assume more if we got a full page
      setHasMore(newPosts.length >= pageSize);
    }
  }, [apiPostsResponse, mappedApiPosts, page, pageSize]);

  /**
   * Load next page of posts.
   * Guards against multiple simultaneous requests.
   */
  const loadMore = useCallback(() => {
    if (isPostsFetching || !hasMore) return;
    setPage((prev) => prev + 1);
  }, [isPostsFetching, hasMore]);

  /**
   * Reset to initial state.
   * Used when switching categories or on errors.
   */
  const reset = useCallback(() => {
    setPosts([]);
    setPage(INITIAL_PAGE);
    setHasMore(true);
  }, []);

  // Calculate loading states
  // Initial loading: show skeleton (no existing posts)
  // Fetching: includes pagination requests (show spinner at bottom)
  const isInitialLoading = (isPostsLoading || !hasCategoryId) && posts.length === 0;

  return {
    posts,
    page,
    hasMore,
    isInitialLoading,
    isFetching: isPostsFetching,
    error,
    loadMore,
    refetch,
    setPosts,
    setPage,
    setHasMore,
    reset,
  };
}

export default useGossipPosts;
