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
import { useDispatch } from "react-redux";
import { useFollowGossipUserMutation } from "../services/gossipSlice";
import { showToast } from "@/page/home/services/errorSlice";
import { getErrorMessage } from "../utils/errorUtils";

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
  const dispatch = useDispatch();
  const [followGossipUser, { isLoading }] = useFollowGossipUserMutation();

  /**
   * Handles follow/unfollow toggle.
   * Shows success toast and updates local state on success.
   * Shows error toast on failure.
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
      // Show error toast on failure
      console.error("Failed to toggle follow:", error);
      dispatch(
        showToast({
          message: getErrorMessage(error),
          type: "error",
        })
      );
    }
  };

  return {
    isLoading,
    handleFollow,
  };
}
