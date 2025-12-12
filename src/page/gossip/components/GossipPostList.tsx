/**
 * ============================================================================
 * GOSSIP POST LIST COMPONENT
 * ============================================================================
 *
 * Infinite scroll container for gossip posts.
 * Wraps posts in InfiniteScroll component for automatic pagination.
 *
 * FEATURES:
 * - Automatic "load more" on scroll
 * - Custom scroll container support
 * - Loading spinner at bottom during pagination
 *
 * PERFORMANCE:
 * - Uses scrollThreshold to trigger loading before reaching bottom
 * - Overflow handling for smooth scroll experience
 * - Keys posts by post_id for optimal React reconciliation
 */

import InfiniteScroll from "react-infinite-scroll-component";
import GossipPost from "./GossipPost";
import LoadingSpinner from "./LoadingSpinner";
import { SCROLL_THRESHOLD } from "../constants";
import type { GossipPostListProps } from "../types";

/**
 * Infinite scroll post list component.
 *
 * @param props - Component props
 * @returns Infinite scroll container with posts
 *
 * @example
 * ```tsx
 * <GossipPostList
 *   posts={posts}
 *   hasMore={hasMore}
 *   onLoadMore={loadMore}
 *   scrollContainerId="gossip-scroll-container"
 * />
 * ```
 */
export const GossipPostList = ({
  posts,
  hasMore,
  onLoadMore,
  scrollContainerId,
}: GossipPostListProps) => (
  <InfiniteScroll
    dataLength={posts.length}
    next={onLoadMore}
    hasMore={hasMore}
    loader={<LoadingSpinner />}
    scrollableTarget={scrollContainerId}
    scrollThreshold={SCROLL_THRESHOLD}
    style={{ overflow: "visible" }}
  >
    {/* Centered content container with max width */}
    <div className="w-full max-w-[480px] mx-auto">
      {posts.map((post) => (
        <GossipPost key={post.post_id} post={post} />
      ))}
    </div>
  </InfiniteScroll>
);

export default GossipPostList;
