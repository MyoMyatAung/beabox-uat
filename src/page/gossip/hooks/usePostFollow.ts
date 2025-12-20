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
import { useFollowGossipUserMutation } from "../services/gossipSlice";

/**
 * Hook return type for post follow functionality.
 */
export interface UsePostFollowReturn {
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
  onAuthenticated: () => boolean,
  onFollowSuccess: () => void
): UsePostFollowReturn {
  const [followGossipUser, { isLoading }] = useFollowGossipUserMutation();

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
      await followGossipUser({
        follow_user_id: userId,
        status: initialFollowing ? "unfollow" : "follow",
      }).unwrap();

      // Show success message
      // dispatch(
      //   showToast({
      //     message: response?.message || "关注成功",
      //     type: "success",
      //   })
      // );

      // Update local state
      onFollowSuccess();
    } catch (error) {
      // Error handling is done by RTK Query
      console.error("Failed to toggle follow:", error);
    }
  };

  return {
    isLoading,
    handleFollow,
  };
}
