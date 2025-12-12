/**
 * ============================================================================
 * LOADING SPINNER COMPONENT
 * ============================================================================
 *
 * Animated loading indicator for pagination and async operations.
 * Uses a GIF animation consistent with the app's visual design.
 *
 * USAGE:
 * - Infinite scroll "load more" indicator
 * - General purpose loading state
 */

import loaderGif from "@/page/home/vod_loader.gif";

/**
 * Centered loading spinner with GIF animation.
 *
 * @returns Loading spinner element
 *
 * @example
 * ```tsx
 * // In infinite scroll loader prop
 * <InfiniteScroll loader={<LoadingSpinner />} ... />
 *
 * // Standalone usage
 * {isLoadingMore && <LoadingSpinner />}
 * ```
 */
export const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-4">
    <img src={loaderGif} alt="Loading..." className="w-10 h-10" />
  </div>
);

export default LoadingSpinner;
