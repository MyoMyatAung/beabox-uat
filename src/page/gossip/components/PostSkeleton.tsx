/**
 * ============================================================================
 * POST SKELETON COMPONENT
 * ============================================================================
 *
 * Loading skeleton placeholder for gossip posts.
 * Displays a shimmer animation while post data is being fetched.
 *
 * DESIGN:
 * - Mimics the structure of an actual GossipPost for smooth visual transition
 * - Uses pulse animation for loading indication
 * - Dark theme colors consistent with the gossip page design
 *
 * USAGE:
 * Show during initial page load or when switching to a tab with no cached data.
 */

import { SKELETON_COUNT } from "../constants";

/**
 * Single skeleton placeholder matching the GossipPost layout.
 * Includes avatar, text lines, media placeholders, and action bar.
 */
const PostSkeletonItem = () => (
  <div className="px-4 py-3 animate-pulse space-y-3 mb-4">
    {/* Header: Avatar + Username/Timestamp */}
    <div className="flex gap-3">
      {/* Avatar placeholder */}
      <div className="w-9 h-9 bg-[#221d2a] rounded-full" />

      {/* Text content placeholders */}
      <div className="flex-1 space-y-2">
        {/* Username line */}
        <div className="w-52 h-4 bg-[#221d2a] rounded-md" />
        {/* Timestamp line */}
        <div className="w-24 h-4 bg-[#221d2a] rounded-md" />
        {/* Content line */}
        <div className="w-36 h-4 bg-[#221d2a] rounded-md" />
      </div>
    </div>

    {/* Media thumbnails placeholder */}
    <div className="flex gap-3 overflow-x-auto">
      <div className="w-[220px] h-[236px] bg-[#221d2a] rounded-md" />
      <div className="w-[220px] h-[236px] bg-[#221d2a] rounded-md" />
    </div>

    {/* Action bar placeholder (likes, comments) */}
    <div className="flex justify-between">
      <div className="w-24 h-4 bg-[#221d2a] rounded-md" />
      <div className="w-24 h-4 bg-[#221d2a] rounded-md" />
    </div>
  </div>
);

/**
 * Props for PostSkeleton component.
 */
interface PostSkeletonProps {
  /** Number of skeleton items to render (defaults to SKELETON_COUNT) */
  count?: number;
}

/**
 * Renders multiple skeleton placeholders for loading state.
 *
 * @param props - Component props
 * @returns Multiple skeleton items
 *
 * @example
 * ```tsx
 * // Show loading skeleton
 * {isLoading && <PostSkeleton />}
 *
 * // Custom count
 * <PostSkeleton count={3} />
 * ```
 */
export const PostSkeleton = ({ count = SKELETON_COUNT }: PostSkeletonProps) => (
  <div className="w-full max-w-[480px] mx-auto">
    {Array.from({ length: count }).map((_, index) => (
      <PostSkeletonItem key={index} />
    ))}
  </div>
);

export default PostSkeleton;
