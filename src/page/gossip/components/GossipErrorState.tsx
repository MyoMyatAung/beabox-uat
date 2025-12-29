/**
 * ============================================================================
 * GOSSIP ERROR STATE COMPONENT
 * ============================================================================
 *
 * Error display component for the gossip feed.
 * Shows error messages and optional retry functionality.
 *
 * ERROR SCENARIOS:
 * - Category loading failure
 * - Posts fetching failure
 * - Network errors
 * - No categories configured
 *
 * DESIGN:
 * - Centered layout for prominence
 * - Red color for error indication
 * - Optional retry button for recoverable errors
 */

import type { GossipErrorStateProps } from "../types";

/**
 * Error state display with optional retry button.
 *
 * @param props - Component props
 * @returns Error display element
 *
 * @example
 * ```tsx
 * // With retry button
 * <GossipErrorState
 *   message="帖子加载失败，请稍后重试"
 *   showRetry={true}
 *   onRetry={() => refetch()}
 * />
 *
 * // Without retry (e.g., no categories configured)
 * <GossipErrorState
 *   message="当前频道暂未配置分类"
 *   showRetry={false}
 *   onRetry={() => {}}
 * />
 * ```
 */
export const GossipErrorState = ({
  message,
  showRetry,
  onRetry,
}: GossipErrorStateProps) => (
  <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
    {/* Error message */}
    <p className="text-red-400 text-sm">{message}</p>

    {/* Retry button - only shown when error is recoverable */}
    {showRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-full hover:bg-purple-500 transition-colors"
      >
        重新加载
      </button>
    )}
  </div>
);

export default GossipErrorState;
