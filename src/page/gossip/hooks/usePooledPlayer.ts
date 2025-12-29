/**
 * ============================================================================
 * usePooledPlayer Hook
 * ============================================================================
 *
 * React hook for using the global player pool in components.
 * Handles automatic cleanup on unmount and visibility changes.
 *
 * USAGE:
 *   const { containerRef, isReady, play, pause } = usePooledPlayer({
 *     id: 'post-123',
 *     videoUrl: 'https://example.com/video.mp4',
 *     autoplay: true,
 *   });
 *
 *   return <div ref={containerRef} />;
 *
 * ============================================================================
 */

import { useRef, useEffect, useState, useCallback } from "react";
import {
  getPlayerManager,
  PooledPlayer,
  PlayerRequestOptions,
} from "../services/playerManager";

export interface UsePooledPlayerOptions extends PlayerRequestOptions {
  /** Unique identifier for this player */
  id: string;
  /** Video URL to play */
  videoUrl: string;
  /** Whether to use fullscreen pool */
  isFullscreen?: boolean;
  /** Whether player is enabled (set false to release) */
  enabled?: boolean;
  /** Intersection threshold for auto play/pause (0-1) */
  intersectionThreshold?: number;
  /** Enable intersection-based auto play/pause */
  useIntersectionObserver?: boolean;
}

export interface UsePooledPlayerReturn {
  /** Ref to attach to container element */
  containerRef: React.RefObject<HTMLDivElement>;
  /** Whether player is ready to play */
  isReady: boolean;
  /** Whether player is currently playing */
  isPlaying: boolean;
  /** Current playback time */
  currentTime: number;
  /** Total duration */
  duration: number;
  /** Whether player is muted */
  isMuted: boolean;
  /** Play the video */
  play: () => void;
  /** Pause the video */
  pause: () => void;
  /** Toggle play/pause */
  togglePlay: () => void;
  /** Toggle mute state */
  toggleMute: () => void;
  /** Set mute state */
  setMuted: (muted: boolean) => void;
  /** Seek to time */
  seekTo: (time: number) => void;
  /** Get the underlying video element (use with caution) */
  getVideoElement: () => HTMLVideoElement | null;
  /** The pooled player instance */
  player: PooledPlayer | null;
}

export function usePooledPlayer(
  options: UsePooledPlayerOptions
): UsePooledPlayerReturn {
  const {
    id,
    videoUrl,
    isFullscreen = false,
    enabled = true,
    autoplay = false,
    muted,
    loop = true,
    onReady,
    onError,
    intersectionThreshold = 0.5,
    useIntersectionObserver = false,
  } = options;

  const containerRef = useRef<HTMLDivElement>(null);
  const [player, setPlayer] = useState<PooledPlayer | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(
    muted ?? getPlayerManager().getGlobalMuted()
  );

  const manager = getPlayerManager();

  // ============================================================================
  // PLAYER LIFECYCLE
  // ============================================================================

  /**
   * Initialize player when container is available and enabled
   */
  useEffect(() => {
    if (!enabled || !videoUrl || !containerRef.current) {
      // Release player if disabled
      if (player) {
        manager.releasePlayer(id, isFullscreen);
        setPlayer(null);
        setIsReady(false);
      }
      return;
    }

    const container = containerRef.current;

    // Request player from pool
    const pooledPlayer = manager.requestPlayer(
      id,
      container,
      videoUrl,
      {
        autoplay,
        muted: isMuted,
        loop,
        onReady: (p) => {
          setIsReady(true);
          setPlayer(p);
          onReady?.(p);
        },
        onError: (error) => {
          console.error(`[usePooledPlayer] Error for ${id}:`, error);
          onError?.(error);
        },
      },
      isFullscreen
    );

    if (pooledPlayer) {
      setPlayer(pooledPlayer);
    }

    // Cleanup: release player on unmount
    return () => {
      manager.releasePlayer(id, isFullscreen);
    };
  }, [id, videoUrl, enabled, isFullscreen]);

  // ============================================================================
  // VIDEO ELEMENT EVENT HANDLERS
  // ============================================================================

  /**
   * Attach event listeners to video element
   */
  useEffect(() => {
    const video = player?.videoElement;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(video.duration || 0);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleVolumeChange = () => {
      setIsMuted(video.muted);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("durationchange", handleDurationChange);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("volumechange", handleVolumeChange);

    // Initialize state from current video state
    setCurrentTime(video.currentTime);
    setDuration(video.duration || 0);
    setIsPlaying(!video.paused);
    setIsMuted(video.muted);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("durationchange", handleDurationChange);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("volumechange", handleVolumeChange);
    };
  }, [player?.videoElement]);

  // ============================================================================
  // INTERSECTION OBSERVER FOR AUTO PLAY/PAUSE
  // ============================================================================

  useEffect(() => {
    if (!useIntersectionObserver || !containerRef.current || !player) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isVisible =
            entry.isIntersecting &&
            entry.intersectionRatio >= intersectionThreshold;

          if (isVisible) {
            // Pause all other players in this pool
            manager.pauseAllExcept(id, isFullscreen);
            // Play this player
            manager.playPlayer(id, isFullscreen);
          } else {
            // Pause this player when off-screen
            manager.pausePlayer(id, isFullscreen);
          }
        });
      },
      {
        threshold: intersectionThreshold,
        rootMargin: "0px",
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [
    useIntersectionObserver,
    player,
    id,
    isFullscreen,
    intersectionThreshold,
    manager,
  ]);

  // ============================================================================
  // GLOBAL MUTE STATE SUBSCRIPTION
  // ============================================================================

  useEffect(() => {
    const unsubscribe = manager.onMuteChange((globalMuted) => {
      setIsMuted(globalMuted);
    });
    return unsubscribe;
  }, [manager]);

  // ============================================================================
  // CONTROL METHODS
  // ============================================================================

  const play = useCallback(() => {
    manager.playPlayer(id, isFullscreen);
  }, [id, isFullscreen, manager]);

  const pause = useCallback(() => {
    manager.pausePlayer(id, isFullscreen);
  }, [id, isFullscreen, manager]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const toggleMute = useCallback(() => {
    const newMuted = !isMuted;
    manager.setGlobalMuted(newMuted);
  }, [isMuted, manager]);

  const setMuted = useCallback(
    (muted: boolean) => {
      manager.setGlobalMuted(muted);
    },
    [manager]
  );

  const seekTo = useCallback(
    (time: number) => {
      const video = player?.videoElement;
      if (video) {
        video.currentTime = time;
      }
    },
    [player]
  );

  const getVideoElement = useCallback(() => {
    return player?.videoElement ?? null;
  }, [player]);

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    containerRef,
    isReady,
    isPlaying,
    currentTime,
    duration,
    isMuted,
    play,
    pause,
    togglePlay,
    toggleMute,
    setMuted,
    seekTo,
    getVideoElement,
    player,
  };
}

export default usePooledPlayer;
