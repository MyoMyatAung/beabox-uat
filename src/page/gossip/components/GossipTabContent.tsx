/**
 * ============================================================================
 * GOSSIP TAB CONTENT COMPONENT
 * ============================================================================
 *
 * Displays posts for a specific category tab.
 * Uses RTK Query for data fetching with infinite scroll support.
 *
 * KEEP-ALIVE:
 * This component stays mounted when hidden (via isActive prop) to preserve
 * scroll position and cached data when switching between tabs.
 */

import { useState, useCallback, useMemo } from "react";
import { useGetGossipPostsQuery } from "../services/gossipSlice";
import GossipPostList from "./GossipPostList";
import PostSkeleton from "./PostSkeleton";
import type { GossipPostData } from "../types";

interface GossipTabContentProps {
  /** Category ID to fetch posts for */
  categoryId: string;
  /** Whether this tab is currently active/visible */
  isActive: boolean;
}

/**
 * Tab content component for displaying posts in a category.
 *
 * @param props - Component props
 * @returns Post list for the category
 */
const GossipTabContent = ({ categoryId, isActive }: GossipTabContentProps) => {
  const [page, setPage] = useState(1);
  const scrollContainerId = `gossip-scroll-${categoryId}`;

  const { data, isLoading, isFetching, error } = useGetGossipPostsQuery(
    { category_id: categoryId, page },
    { skip: !categoryId }
  );

  // Transform posts to match GossipPostData type
  const posts: GossipPostData[] = useMemo(() => {
    return (data?.data ?? []).map((post) => ({
      post_id: post.id,
      category_id: post.category_id,
      user: post.user
        ? {
            id: post.user.id,
            nickname: post.user.nickname,
            profile_image: post.user.profile_image,
            is_following: post.user.is_following ?? false,
            level: post.user.level ?? "",
            badge: post.user.badge ?? "",
          }
        : {
            id: "",
            nickname: "",
            profile_image: "",
            is_following: false,
            level: "",
            badge: "",
          },
      content: post.description,
      media: (post.media ?? []).map((m, idx) => ({
        id: m.id ?? `${post.id}-media-${idx}`,
        type: m.type,
        url: m.url,
        download_url: m.download_url,
        thumbnail_url: m.thumbnail_url ?? m.thumbnail,
        thumbnail: m.thumbnail,
      })),
      like_count: post.like_count ?? 0,
      comment_count: post.comment_count ?? 0,
      share_count: post.share_count ?? 0,
      is_liked: post.is_liked ?? false,
      created_at: post.created_at,
      share_link: post.share_link ?? "",
      time_ago: post.time_ago ?? "",
    }));
  }, [data?.data]);

  // Determine if more posts are available
  const hasMore = useMemo(() => {
    if (!data?.pagination) return false;
    return data.pagination.current_page < data.pagination.last_page;
  }, [data?.pagination]);

  // Load more posts handler
  const handleLoadMore = useCallback(() => {
    if (!isFetching && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [isFetching, hasMore]);

  // Error state
  if (error) {
    const errorMessage =
      typeof error === "object" && error !== null && "data" in error
        ? ((error as { data?: { message?: string } }).data?.message ??
          "加载失败，请稍后重试")
        : "加载失败，请稍后重试";

    return (
      <div
        className="flex-1 flex items-center justify-center text-[#8B8498] text-sm"
        style={{ display: isActive ? "flex" : "none" }}
      >
        {errorMessage}
      </div>
    );
  }

  // Initial loading state
  if (isLoading && page === 1) {
    return (
      <div
        className="flex-1 overflow-y-auto"
        style={{ display: isActive ? "block" : "none" }}
      >
        <PostSkeleton />
      </div>
    );
  }

  // Empty state
  if (!posts.length && !isLoading) {
    return (
      <div
        className="flex-1 flex items-center justify-center text-[#8B8498] text-sm"
        style={{ display: isActive ? "flex" : "none" }}
      >
        暂无内容
      </div>
    );
  }

  return (
    <div
      id={scrollContainerId}
      className="flex-1 overflow-y-auto scrollbar-hide"
      style={{ display: isActive ? "block" : "none" }}
    >
      <GossipPostList
        posts={posts}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        scrollContainerId={scrollContainerId}
      />
    </div>
  );
};

export default GossipTabContent;
