/**
 * ============================================================================
 * GOSSIP EMPTY STATE COMPONENT
 * ============================================================================
 *
 * Empty state display when no posts are available.
 * Shown when API returns successfully but with no posts.
 *
 * SCENARIOS:
 * - New category with no posts yet
 * - Filtered results with no matches
 * - Category that has been cleared
 */

/**
 * Empty state display for when no posts are available.
 *
 * @returns Empty state element
 *
 * @example
 * ```tsx
 * {!isLoading && !error && posts.length === 0 && (
 *   <GossipEmptyState />
 * )}
 * ```
 */
export const GossipEmptyState = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-gray-400 text-sm">暂无内容</div>
  </div>
);

export default GossipEmptyState;
