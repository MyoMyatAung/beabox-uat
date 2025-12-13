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
  /** Whether the post is currently liked */
  isLiked: boolean;
  /** Current like count */
  likeCount: number;
  /** Whether a like/unlike operation is in progress */
  isPending: boolean;
  /** Handler to toggle like status */
  handleLike: () => Promise<void>;
}

/**
 * Custom hook for managing post like/unlike functionality.
 *
 * @param postId - The ID of the post to like/unlike
 * @param initialLiked - Initial liked state from post data
 * @param initialLikeCount - Initial like count from post data
 * @param onAuthenticated - Callback to check authentication (returns false if not authenticated)
 *
 * @returns Like state and handler function
 *
 * @example
 * ```tsx
 * const { isLiked, likeCount, handleLike } = usePostLike(
 *   post.post_id,
 *   post.is_liked,
 *   post.like_count,
 *   ensureAuthenticated
 * );
 * ```
 */
export function usePostLike(
  postId: string,
  initialLiked: boolean,
  initialLikeCount: number,
  onAuthenticated: () => boolean
): UsePostLikeReturn {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isPending, setIsPending] = useState(false);

  const [likePost] = useLikeGossipPostMutation();
  const [unlikePost] = useUnlikeGossipPostMutation();

  /**
   * Handles like/unlike toggle with optimistic updates.
   * Updates UI immediately, then syncs with server.
   * Reverts on error.
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

    // Optimistic update: update UI immediately
    const nextLiked = !isLiked;
    const delta = nextLiked ? 1 : -1;
    setIsLiked(nextLiked);
    setLikeCount((prev) => Math.max(0, prev + delta));
    setIsPending(true);

    try {
      // Sync with server
      if (nextLiked) {
        await likePost({ post_id: postId }).unwrap();
      } else {
        await unlikePost({ post_id: postId }).unwrap();
      }
    } catch (error) {
      // Revert optimistic update on error
      console.error("Failed to toggle like:", error);
      setIsLiked(!nextLiked);
      setLikeCount((prev) => Math.max(0, prev - delta));
    } finally {
      setIsPending(false);
    }
  };

  return {
    isLiked,
    likeCount,
    isPending,
    handleLike,
  };
}

