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
import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

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
}: GossipPostListProps) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: posts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 500,
    overscan: 3,
  });

  const items = virtualizer.getVirtualItems();

  // const lastItem = items[items.length - 1];
  // if (lastItem && lastItem.index >= posts.length && hasMore) {
  //   // console.log("lastItem: ", lastItem);
  //   // console.log("hasMore: ", hasMore);
  //   // console.log("lastItem.index: ", lastItem.index);
  //   // console.log("posts.length: ", posts.length);
  //   // console.log("lastItem.index >= posts.length - 3: ", lastItem.index >= posts.length - 3);
  //   onLoadMore();
  // }

  return (
    <div ref={parentRef} className="w-full max-w-[480px] mx-auto bg-black pb-4">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: "relative",
        }}
      >
        {items.map((virtualRow) => (
          <div
            key={posts[virtualRow.index].post_id}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${virtualRow.start}px)`,
            }}
            ref={virtualizer.measureElement}
            data-index={virtualRow.index}
          >
            <GossipPost post={posts[virtualRow.index]} />
          </div>
        ))}
      </div>
      {/* IntersectionObserver trigger for infinite scroll */}
      {hasMore && (
        <>
          <div
            id="infinite-scroll-sentinel"
            ref={node => {
              if (!node) return;
              const observer = new window.IntersectionObserver(
                entries => {
                  if (entries[0].isIntersecting) {
                    console.log("IntersectionObserver triggered");
                    onLoadMore();
                  }
                },
                {
                  root: document.getElementById(scrollContainerId) || null,
                  rootMargin: "300px",
                  threshold: 0.1,
                }
              );
              observer.observe(node);
              // Cleanup function
              return () => {
                observer.disconnect();
              };
            }}
            style={{ height: 1 }}
          />
          <LoadingSpinner />
        </>
      )}
    </div>
  )
};

export default GossipPostList;
