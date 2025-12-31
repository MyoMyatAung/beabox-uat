/**
 * ============================================================================
 * GOSSIP HOOKS INDEX
 * ============================================================================
 *
 * Barrel export for all gossip-related custom hooks.
 * Import from this index for cleaner imports throughout the module.
 *
 * AVAILABLE HOOKS:
 * - useAuthentication: User authentication state and actions
 * - usePostFollow: Follow/unfollow user logic
 * - usePostLike: Post like/unlike functionality
 * - usePostPopovers: Popover state management for posts
 * - usePostVideoPlayer: Video player controls for post media
 */

export { useAuthentication } from "./useAuthentication";
export { usePostFollow } from "./usePostFollow";
export { usePostLike } from "./usePostLike";
export { usePostPopovers } from "./usePostPopovers";
export { usePostVideoPlayer } from "./usePostVideoPlayer";
