/**
 * ============================================================================
 * USE GOSSIP POSTS HOOK
 * ============================================================================
 *
 * Custom hook for fetching and managing gossip posts with infinite scroll.
 *
 * RESPONSIBILITIES:
 * - Fetches posts from API with pagination support
 * - Transforms API response to component-friendly format
 * - Leverages RTK Query's built-in caching for infinite scroll
 *
 * BUSINESS LOGIC:
 * - Posts are fetched per category (categoryId)
 * - RTK Query handles caching and merging via serializeQueryArgs + merge
 * - hasMore flag is derived from pagination response
 *
 * DATA TRANSFORMATION:
 * - API response is normalized to ensure consistent data structure
 * - Missing fields are defaulted to prevent runtime errors
 * - Media items are filtered to only include valid entries
 */

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
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
 * Uses RTK Query's native caching for efficient data management.
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

  const hasCategoryId = Boolean(categoryId);

  // Reset page to 1 when category changes
  // useEffect(() => {
  //   if (categoryId !== prevCategoryIdRef.current) {
  //     setPage(INITIAL_PAGE);
  //     prevCategoryIdRef.current = categoryId;
  //   }
  // }, [categoryId]);

  // Fetch posts from API
  // RTK Query handles caching and merging via serializeQueryArgs + merge
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
  const posts: GossipPostData[] = useMemo(() => {
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
                thumbnail_url:
                  (item as any).thumbnail_url || (item as any).thumbnail,
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
   * Derive hasMore from pagination info.
   */
  const hasMore = useMemo(() => {
    const pagination = apiPostsResponse?.pagination;
    if (pagination) {
      return pagination.current_page < pagination.last_page;
    }
    // Fallback: assume more if we got a full page
    return (apiPostsResponse?.data?.length ?? 0) >= pageSize;
  }, [apiPostsResponse, pageSize]);

  /**
   * Load next page of posts.
   * Guards against multiple simultaneous requests.
   */
  const loadMore = useCallback(() => {
    console.log('loadMore triggered');
    if (isPostsFetching || !hasMore) return;
    setPage((prev) => {
      console.log('loadMore prev is=>', prev);
      return prev + 1;
    });
  }, [isPostsFetching, hasMore]);

  // Calculate loading states
  // Initial loading: show skeleton (no existing posts)
  const isInitialLoading =
    (isPostsLoading || !hasCategoryId) && posts.length === 0;

  return {
    posts,
    page,
    setPage,
    hasMore,
    isInitialLoading,
    isFetching: isPostsFetching,
    error,
    loadMore,
    refetch,
  };
}

export default useGossipPosts;
