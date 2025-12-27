/**
 * ============================================================================
 * GOSSIP POST LIST COMPONENT
 * ============================================================================
 *
 * Infinite scroll container for gossip posts.
 * Triggers load more when scrolling to near the end of the list.
 *
 * FEATURES:
 * - Automatic "load more" when reaching 5th last item
 * - Custom scroll container support
 * - Loading spinner at bottom during pagination
 *
 * PERFORMANCE:
 * - Uses IntersectionObserver for efficient scroll detection
 * - Keys posts by post_id for optimal React reconciliation
 */

import { useEffect, useRef, useCallback } from "react";
import GossipPost from "./GossipPost";
import LoadingSpinner from "./LoadingSpinner";
import type { GossipPostListProps } from "../types";

/**
 * Infinite scroll post list component.
 *
 * @param props - Component props
 * @returns Post list with infinite scroll
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
}: GossipPostListProps) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreCalledRef = useRef(false);

  // Reset loadMoreCalled flag when posts change (new page loaded)
  useEffect(() => {
    loadMoreCalledRef.current = false;
  }, [posts.length]);

  // Callback ref for the 5th last item
  const triggerRef = useCallback(
    (node: HTMLDivElement | null) => {
      // Disconnect previous observer
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (!node || !hasMore) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !loadMoreCalledRef.current) {
            loadMoreCalledRef.current = true;
            onLoadMore();
          }
        },
        {
          root: document.getElementById(scrollContainerId) || null,
          rootMargin: "100px",
          threshold: 0.1,
        }
      );

      observerRef.current.observe(node);
    },
    [hasMore, onLoadMore, scrollContainerId]
  );

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Calculate the trigger index (5th last item)
  const triggerIndex = posts.length - 5;

  return (
    <div className="w-full max-w-[480px] mx-auto bg-black pb-4">
      {posts.map((post, index) => (
        <div
          key={post.post_id}
          ref={index === triggerIndex ? triggerRef : undefined}
        >
          <GossipPost post={post} />
        </div>
      ))}

      {/* Loading spinner when fetching more */}
      {hasMore && <LoadingSpinner />}
    </div>
  );
};

export default GossipPostList;
