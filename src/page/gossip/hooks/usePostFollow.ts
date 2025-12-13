/**
 * ============================================================================
 * POST FOLLOW HOOK
 * ============================================================================
 *
 * Manages follow/unfollow functionality for gossip post authors.
 * Handles API calls, success notifications, and loading states.
 *
 * This hook encapsulates all follow-related business logic, making it
 * reusable and testable.
 */

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useFollowGossipUserMutation } from "../services/gossipSlice";
import { showToast } from "@/page/home/services/errorSlice";

/**
 * Hook return type for post follow functionality.
 */
export interface UsePostFollowReturn {
  /** Whether the user is currently following the post author */
  isFollowing: boolean;
  /** Whether a follow/unfollow operation is in progress */
  isLoading: boolean;
  /** Handler to toggle follow status */
  handleFollow: () => Promise<void>;
}

/**
 * Custom hook for managing follow/unfollow functionality.
 *
 * @param userId - The ID of the user to follow/unfollow
 * @param initialFollowing - Initial following state from post data
 * @param onAuthenticated - Callback to check authentication (returns false if not authenticated)
 *
 * @returns Follow state and handler function
 *
 * @example
 * ```tsx
 * const { isFollowing, handleFollow } = usePostFollow(
 *   post.user.id.toString(),
 *   post.user.is_following,
 *   ensureAuthenticated
 * );
 * ```
 */
export function usePostFollow(
  userId: string,
  initialFollowing: boolean | undefined,
  onAuthenticated: () => boolean
): UsePostFollowReturn {
  const dispatch = useDispatch();
  const [isFollowing, setIsFollowing] = useState(initialFollowing || false);
  const [followGossipUser, { isLoading }] = useFollowGossipUserMutation();

  // Sync with prop changes (e.g., when post data updates)
  useEffect(() => {
    setIsFollowing(initialFollowing || false);
  }, [initialFollowing]);

  /**
   * Handles follow/unfollow toggle.
   * Shows success toast and updates local state on success.
   */
  const handleFollow = async (): Promise<void> => {
    // Check authentication before proceeding
    if (!onAuthenticated()) {
      return;
    }

    try {
      const response = await followGossipUser({
        follow_user_id: userId,
        status: isFollowing ? "unfollow" : "follow",
      }).unwrap();

      // Show success message
      dispatch(
        showToast({
          message: response?.message || "关注成功",
          type: "success",
        })
      );

      // Update local state
      setIsFollowing((prev) => !prev);
    } catch (error) {
      // Error handling is done by RTK Query
      console.error("Failed to toggle follow:", error);
    }
  };

  return {
    isFollowing,
    isLoading,
    handleFollow,
  };
}

