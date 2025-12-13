/**
 * ============================================================================
 * POST VIDEO PLAYER HOOK
 * ============================================================================
 *
 * Manages video player lifecycle for gossip posts using the global player pool.
 * Handles intersection observer setup, player request/release, and mute state.
 *
 * This hook encapsulates all video player management logic, preventing memory
 * leaks by properly managing player instances through the pool system.
 *
 * MEMORY MANAGEMENT:
 * - Uses global player pool (max 3 instances) to prevent memory leaks
 * - Automatically releases players when posts scroll off-screen
 * - Properly cleans up on component unmount
 */

import { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { getPlayerManager } from "../services/playerManager";
import { setPostMuted } from "../services/gossipMuteSlice";

/**
 * Media item interface for video detection.
 */
interface MediaItem {
  type: "image" | "video";
  url: string;
}

/**
 * Hook return type for video player management.
 */
export interface UsePostVideoPlayerReturn {
  /** Ref to attach to the video container element */
  videoContainerRef: React.RefObject<HTMLDivElement>;
  /** Whether the video player is ready */
  isVideoReady: boolean;
  /** Whether the video is currently muted */
  isMuted: boolean;
  /** Handler to toggle mute state */
  handleToggleMute: () => void;
  /** Handler to release player (e.g., when opening fullscreen) */
  releasePlayer: () => void;
}

/**
 * Custom hook for managing video player lifecycle in gossip posts.
 *
 * @param postId - Unique identifier for this post
 * @param postRef - Ref to the post container element (for intersection observer)
 * @param firstMedia - First media item (to check if it's a video)
 *
 * @returns Video player state and handlers
 *
 * @example
 * ```tsx
 * const postRef = useRef<HTMLDivElement>(null);
 * const { videoContainerRef, isVideoReady, isMuted, handleToggleMute } =
 *   usePostVideoPlayer(post.post_id, postRef, post.media[0]);
 * ```
 */
export function usePostVideoPlayer(
  postId: string,
  postRef: React.RefObject<HTMLDivElement>,
  firstMedia: MediaItem | null | undefined
): UsePostVideoPlayerReturn {
  const dispatch = useDispatch();
  const playerManager = getPlayerManager();
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  // Get mute state from global Redux store
  const isMuted = useSelector(
    (state: RootState) => state.gossipMute?.mutedByPostId[postId] ?? true
  );

  // Store mute state in ref to avoid recreating observer when mute changes
  const isMutedRef = useRef(isMuted);
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Store firstMedia URL in ref to avoid effect re-runs on object reference changes
  const firstMediaUrlRef = useRef(firstMedia?.url);
  useEffect(() => {
    firstMediaUrlRef.current = firstMedia?.url;
  }, [firstMedia?.url]);

  const isFirstVideo = firstMedia?.type === "video";

  /**
   * Toggles mute state globally and updates Redux store.
   */
  const handleToggleMute = (): void => {
    const newMuted = !isMuted;
    dispatch(setPostMuted({ postId, muted: newMuted }));
    playerManager.setGlobalMuted(newMuted);
  };

  /**
   * Releases the player back to the pool.
   * Used when opening fullscreen or unmounting.
   */
  const releasePlayer = (): void => {
    const playerId = `gossip-post-${postId}`;
    playerManager.releasePlayer(playerId, false);
    setIsVideoReady(false);
  };

  // ============================================================================
  // INTERSECTION OBSERVER - Player Pool Integration
  // ============================================================================
  // This effect manages the player pool integration:
  // 1. When post becomes visible (>50% in viewport), request a player from pool
  // 2. When post goes off-screen, release player back to pool for recycling
  // 3. Pool automatically limits to 3 active players, preventing memory growth
  useEffect(() => {
    if (!isFirstVideo || !postRef.current || !videoContainerRef.current) {
      return;
    }
    if (!firstMedia?.url) {
      return;
    }

    const postElement = postRef.current;
    const container = videoContainerRef.current;
    const playerId = `gossip-post-${postId}`;
    const mediaUrl = firstMedia.url;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isVisible =
            entry.isIntersecting && entry.intersectionRatio > 0.5;

          if (isVisible) {
            // Request player from pool when visible
            // Pool will recycle oldest inactive player if at capacity
            const player = playerManager.requestPlayer(
              playerId,
              container,
              mediaUrl,
              {
                autoplay: false,
                muted: isMutedRef.current, // Use ref to get current value
                loop: true,
                onReady: () => {
                  setIsVideoReady(true);
                },
                onError: (err: Error) => {
                  console.error("Error with pooled video player:", err);
                },
              },
              false // not fullscreen
            );

            if (player) {
              // Pause all other feed players to save resources
              playerManager.pauseAllExcept(playerId, false);
            }
          } else {
            // Release player when off-screen
            // Player is paused and marked inactive for recycling
            playerManager.releasePlayer(playerId, false);
            setIsVideoReady(false);
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the post is visible
        rootMargin: "0px",
      }
    );

    observer.observe(postElement);

    // Cleanup: Release player on unmount to prevent leaks
    return () => {
      observer.disconnect();
      playerManager.releasePlayer(playerId, false);
    };
    // Dependencies: Only re-run when post identity changes, not on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFirstVideo, postId, playerManager]);

  return {
    videoContainerRef,
    isVideoReady,
    isMuted,
    handleToggleMute,
    releasePlayer,
  };
}

