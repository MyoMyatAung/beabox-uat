/**
 * ============================================================================
 * POST LIKE HOOK
 * ============================================================================
 *
 * Manages like/unlike functionality for gossip posts with optimistic updates.
 * Handles API calls, error recovery, and loading states.
 *
 * This hook encapsulates all like-related business logic, following the
 * Single Responsibility Principle and making it reusable across components.
 */

import { useState } from "react";
import {
  useLikeGossipPostMutation,
  useUnlikeGossipPostMutation,
} from "../services/gossipSlice";

/**
 * Hook return type for post like functionality.
 */
export interface UsePostLikeReturn {
  /** Whether a like/unlike operation is in progress */
  isPending: boolean;
  /** Handler to toggle like status */
  handleLike: () => Promise<void>;
}

/**
 * Custom hook for managing post like/unlike functionality.
 *
 * Note: isLiked and likeCount should be read directly from the post data
 * in the RTK Query cache for proper synchronization. The hook only handles
 * the action logic and does not maintain its own state for these values.
 *
 * @param postId - The ID of the post to like/unlike
 * @param currentIsLiked - Current liked state from cache (used to determine action)
 * @param onAuthenticated - Callback to check authentication (returns false if not authenticated)
 *
 * @returns Like handler function and pending state
 *
 * @example
 * ```tsx
 * const { handleLike, isPending } = usePostLike(
 *   post.post_id,
 *   post.is_liked,
 *   ensureAuthenticated
 * );
 * // Use post.is_liked and post.like_count from cache directly
 * ```
 */
export function usePostLike(
  postId: string,
  currentIsLiked: boolean,
  onAuthenticated: () => boolean
): UsePostLikeReturn {
  const [isPending, setIsPending] = useState(false);

  const [likePost] = useLikeGossipPostMutation();
  const [unlikePost] = useUnlikeGossipPostMutation();

  /**
   * Handles like/unlike toggle.
   * Cache is updated optimistically via mutation's onQueryStarted.
   */
  const handleLike = async (): Promise<void> => {
    // Check authentication before proceeding
    if (!onAuthenticated()) {
      return;
    }

    // Prevent concurrent requests
    if (isPending) {
      return;
    }

    setIsPending(true);

    try {
      // Determine action based on current state from cache
      if (currentIsLiked) {
        await unlikePost({ post_id: postId }).unwrap();
      } else {
        await likePost({ post_id: postId }).unwrap();
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
    } finally {
      setIsPending(false);
    }
  };

  return {
    isPending,
    handleLike,
  };
}

