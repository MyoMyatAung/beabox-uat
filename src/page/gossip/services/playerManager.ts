/**
 * ============================================================================
 * GLOBAL VIDEO PLAYER POOL MANAGER
 * ============================================================================
 *
 * This module implements a singleton player pool to prevent memory leaks
 * in infinite scroll video feeds. Instead of creating a new video/HLS/Artplayer
 * instance for every post, components request a player from this pool.
 *
 * KEY FEATURES:
 * - Fixed pool size (default: 3 players for prev/current/next pattern)
 * - Automatic recycling: when a player is released, it's cleaned and reused
 * - Proper cleanup: HLS instances destroyed, video src cleared, listeners removed
 * - Priority system: active (visible) players are never recycled
 *
 * MEMORY MANAGEMENT STRATEGY:
 * 1. Pool maintains at most MAX_POOL_SIZE active players
 * 2. When a new player is requested and pool is full:
 *    - Find the oldest inactive player
 *    - Fully destroy its HLS/video resources
 *    - Recycle the slot for the new request
 * 3. Components must call releasePlayer() when they unmount or go off-screen
 *
 * USAGE:
 *   const manager = getPlayerManager();
 *   const player = manager.requestPlayer('post-123', containerElement, videoUrl);
 *   // ... later, when component unmounts or goes off-screen:
 *   manager.releasePlayer('post-123');
 *
 * ============================================================================
 */

import Hls from "hls.js";
import Artplayer from "artplayer";

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Maximum number of player instances in the pool.
 * 3 is optimal for prev/current/next viewport pattern.
 * Increase if you need more simultaneous players (e.g., for grid layouts).
 */
const MAX_POOL_SIZE = 3;

/**
 * Maximum number of fullscreen viewer players.
 * Fullscreen viewer may need more for smooth swiping.
 */
const MAX_FULLSCREEN_POOL_SIZE = 3;

// ============================================================================
// TYPES
// ============================================================================

export interface PooledPlayer {
  /** Unique identifier for this player slot (usually post_id or media index) */
  id: string;
  /** The Artplayer instance (if using Artplayer) */
  artplayer: Artplayer | null;
  /** The HLS.js instance (for m3u8 streams) */
  hls: Hls | null;
  /** The underlying HTMLVideoElement */
  videoElement: HTMLVideoElement | null;
  /** The container element this player is attached to */
  container: HTMLDivElement | null;
  /** The video URL currently loaded */
  currentUrl: string;
  /** Whether this player is currently active (visible/playing) */
  isActive: boolean;
  /** Timestamp when this player was last used */
  lastUsedAt: number;
  /** AbortController for any pending fetch operations */
  abortController: AbortController | null;
  /** Saved playback position for resuming */
  savedTime: number;
  /** Type of video: 'hls' | 'mp4' | 'unknown' */
  videoType: "hls" | "mp4" | "unknown";
}

export interface PlayerRequestOptions {
  /** Whether to autoplay when ready */
  autoplay?: boolean;
  /** Whether to start muted */
  muted?: boolean;
  /** Whether to loop playback */
  loop?: boolean;
  /** Callback when player is ready */
  onReady?: (player: PooledPlayer) => void;
  /** Callback on playback error */
  onError?: (error: Error) => void;
  /** Custom HLS config overrides */
  hlsConfig?: Partial<Hls["config"]>;
}

// ============================================================================
// PLAYER MANAGER CLASS
// ============================================================================

class PlayerPoolManager {
  /** Main pool for feed/list players */
  private pool: Map<string, PooledPlayer> = new Map();

  /** Separate pool for fullscreen viewer (to avoid conflicts) */
  private fullscreenPool: Map<string, PooledPlayer> = new Map();

  /** Global muted state (shared across all players) */
  private globalMuted: boolean = true;

  /** Listeners for global mute state changes */
  private muteListeners: Set<(muted: boolean) => void> = new Set();

  constructor() {
    // Bind methods to preserve `this` context
    this.requestPlayer = this.requestPlayer.bind(this);
    this.releasePlayer = this.releasePlayer.bind(this);
    this.destroyPlayer = this.destroyPlayer.bind(this);
  }

  // ==========================================================================
  // PUBLIC API
  // ==========================================================================

  /**
   * Request a player from the pool.
   * If the player for this ID already exists, returns it.
   * If pool is full, recycles the oldest inactive player.
   *
   * @param id - Unique identifier (e.g., post_id)
   * @param container - DOM element to attach the player to
   * @param videoUrl - URL of the video to play
   * @param options - Playback options
   * @param isFullscreen - Whether this is for fullscreen viewer
   */
  requestPlayer(
    id: string,
    container: HTMLDivElement,
    videoUrl: string,
    options: PlayerRequestOptions = {},
    isFullscreen: boolean = false
  ): PooledPlayer | null {
    const targetPool = isFullscreen ? this.fullscreenPool : this.pool;
    const maxSize = isFullscreen ? MAX_FULLSCREEN_POOL_SIZE : MAX_POOL_SIZE;

    // Check if player already exists for this ID
    const existing = targetPool.get(id);
    if (existing) {
      // If same URL, just reactivate
      if (existing.currentUrl === videoUrl && existing.container === container) {
        existing.isActive = true;
        existing.lastUsedAt = Date.now();
        return existing;
      }
      // Different URL or container - destroy and recreate
      this.destroyPlayer(id, isFullscreen);
    }

    // If pool is full, recycle oldest inactive player
    if (targetPool.size >= maxSize) {
      const recycled = this.recycleOldestInactive(isFullscreen);
      if (!recycled) {
        console.warn(
          `[PlayerManager] Pool full and no inactive players to recycle. ` +
          `Consider increasing MAX_POOL_SIZE or releasing players properly.`
        );
        // Force recycle the oldest player regardless of active state
        this.forceRecycleOldest(isFullscreen);
      }
    }

    // Create new player
    const player = this.createPlayer(id, container, videoUrl, options, isFullscreen);
    if (player) {
      targetPool.set(id, player);
    }
    return player;
  }

  /**
   * Release a player back to the pool (mark as inactive).
   * The player is NOT destroyed - it can be reused.
   * Call this when a component goes off-screen.
   *
   * @param id - The player ID to release
   * @param isFullscreen - Whether this is a fullscreen player
   */
  releasePlayer(id: string, isFullscreen: boolean = false): void {
    const targetPool = isFullscreen ? this.fullscreenPool : this.pool;
    const player = targetPool.get(id);

    if (player) {
      // Pause playback
      if (player.videoElement) {
        player.savedTime = player.videoElement.currentTime || 0;
        player.videoElement.pause();
      }
      if (player.artplayer) {
        try {
          player.artplayer.pause();
        } catch {
          // Ignore pause errors
        }
      }

      player.isActive = false;
      player.lastUsedAt = Date.now();
    }
  }

  /**
   * Fully destroy a player and remove from pool.
   * Call this when you want to completely clean up a player.
   *
   * @param id - The player ID to destroy
   * @param isFullscreen - Whether this is a fullscreen player
   */
  destroyPlayer(id: string, isFullscreen: boolean = false): void {
    const targetPool = isFullscreen ? this.fullscreenPool : this.pool;
    const player = targetPool.get(id);

    if (player) {
      this.cleanupPlayerResources(player);
      targetPool.delete(id);
    }
  }

  /**
   * Destroy all players in a pool.
   * Call this when leaving the gossip feature entirely.
   *
   * @param isFullscreen - Which pool to destroy
   */
  destroyAllPlayers(isFullscreen?: boolean): void {
    if (isFullscreen === undefined || !isFullscreen) {
      this.pool.forEach((_, id) => this.destroyPlayer(id, false));
      this.pool.clear();
    }
    if (isFullscreen === undefined || isFullscreen) {
      this.fullscreenPool.forEach((_, id) => this.destroyPlayer(id, true));
      this.fullscreenPool.clear();
    }
  }

  /**
   * Get an existing player by ID.
   */
  getPlayer(id: string, isFullscreen: boolean = false): PooledPlayer | undefined {
    const targetPool = isFullscreen ? this.fullscreenPool : this.pool;
    return targetPool.get(id);
  }

  /**
   * Check if a player exists for the given ID.
   */
  hasPlayer(id: string, isFullscreen: boolean = false): boolean {
    const targetPool = isFullscreen ? this.fullscreenPool : this.pool;
    return targetPool.has(id);
  }

  /**
   * Get current pool size.
   */
  getPoolSize(isFullscreen: boolean = false): number {
    const targetPool = isFullscreen ? this.fullscreenPool : this.pool;
    return targetPool.size;
  }

  /**
   * Set global mute state for all players.
   */
  setGlobalMuted(muted: boolean): void {
    this.globalMuted = muted;

    // Apply to all existing players
    this.pool.forEach((player) => {
      if (player.videoElement) {
        player.videoElement.muted = muted;
      }
    });
    this.fullscreenPool.forEach((player) => {
      if (player.videoElement) {
        player.videoElement.muted = muted;
      }
    });

    // Notify listeners
    this.muteListeners.forEach((listener) => listener(muted));
  }

  /**
   * Get current global mute state.
   */
  getGlobalMuted(): boolean {
    return this.globalMuted;
  }

  /**
   * Subscribe to global mute state changes.
   */
  onMuteChange(listener: (muted: boolean) => void): () => void {
    this.muteListeners.add(listener);
    return () => this.muteListeners.delete(listener);
  }

  /**
   * Play a specific player by ID.
   */
  playPlayer(id: string, isFullscreen: boolean = false): void {
    const player = this.getPlayer(id, isFullscreen);
    if (player?.videoElement) {
      player.videoElement.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  }

  /**
   * Pause a specific player by ID.
   */
  pausePlayer(id: string, isFullscreen: boolean = false): void {
    const player = this.getPlayer(id, isFullscreen);
    if (player?.videoElement) {
      player.videoElement.pause();
    }
  }

  /**
   * Pause all players except the specified one.
   */
  pauseAllExcept(exceptId: string, isFullscreen: boolean = false): void {
    const targetPool = isFullscreen ? this.fullscreenPool : this.pool;
    targetPool.forEach((player, id) => {
      if (id !== exceptId && player.videoElement) {
        player.videoElement.pause();
      }
    });
  }

  // ==========================================================================
  // PRIVATE METHODS
  // ==========================================================================

  /**
   * Create a new player instance.
   */
  private createPlayer(
    id: string,
    container: HTMLDivElement,
    videoUrl: string,
    options: PlayerRequestOptions,
    isFullscreen: boolean
  ): PooledPlayer | null {
    const {
      autoplay = true,
      muted = this.globalMuted,
      loop = true,
      onReady,
      onError,
      hlsConfig,
    } = options;

    // Determine video type from URL
    const normalizedUrl = videoUrl.split("?")[0].toLowerCase();
    const isHls = normalizedUrl.endsWith(".m3u8");
    const isMp4 = normalizedUrl.endsWith(".mp4");
    const videoType: PooledPlayer["videoType"] = isHls ? "hls" : isMp4 ? "mp4" : "unknown";

    const player: PooledPlayer = {
      id,
      artplayer: null,
      hls: null,
      videoElement: null,
      container,
      currentUrl: videoUrl,
      isActive: true,
      lastUsedAt: Date.now(),
      abortController: null,
      savedTime: 0,
      videoType,
    };

    try {
      // Build custom type handlers for Artplayer
      const customTypeHandlers: Record<
        string,
        (video: HTMLVideoElement, url: string) => void
      > = {};

      if (isHls) {
        customTypeHandlers.m3u8 = (video: HTMLVideoElement, url: string) => {
          if (Hls.isSupported()) {
            const hls = new Hls({
              enableWorker: true,
              lowLatencyMode: true,
              // Memory-optimized settings
              backBufferLength: 15, // Reduced from 30
              maxBufferLength: 20, // Reduced from 30
              maxMaxBufferLength: 30, // Reduced from 60
              maxBufferSize: 30 * 1000 * 1000, // Reduced from 50MB to 30MB
              maxBufferHole: 0.5,
              startLevel: -1,
              abrEwmaDefaultEstimate: 500000,
              abrBandWidthFactor: 0.95,
              abrBandWidthUpFactor: 0.7,
              abrMaxWithRealBitrate: true,
              startFragPrefetch: false,
              capLevelToPlayerSize: true,
              // Timeouts
              manifestLoadingTimeOut: 10000,
              manifestLoadingMaxRetry: 2, // Reduced from 3
              levelLoadingTimeOut: 10000,
              levelLoadingMaxRetry: 2, // Reduced from 3
              fragLoadingTimeOut: 15000, // Reduced from 20000
              fragLoadingMaxRetry: 3, // Reduced from 6
              ...hlsConfig,
            });

            hls.on(Hls.Events.ERROR, (_, data) => {
              if (!data.fatal) return;
              console.error(`[PlayerManager] HLS fatal error for ${id}:`, data);
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  hls.recoverMediaError();
                  break;
                default:
                  hls.destroy();
                  onError?.(new Error(`HLS error: ${data.type}`));
                  break;
              }
            });

            hls.loadSource(url);
            hls.attachMedia(video);
            player.hls = hls;
          } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            // Safari native HLS
            video.src = url;
          } else {
            video.src = url;
          }
        };
      }

      if (isMp4) {
        customTypeHandlers.mp4 = (video: HTMLVideoElement, url: string) => {
          const abortController = new AbortController();
          player.abortController = abortController;

          // Try range request for progressive loading
          fetch(url, {
            headers: { Range: "bytes=0-1048576" },
            signal: abortController.signal,
          })
            .then((response) => {
              video.src = url;
              video.preload = response.status === 206 ? "auto" : "metadata";
            })
            .catch((error) => {
              if (error.name !== "AbortError") {
                console.error(`[PlayerManager] MP4 fetch error for ${id}:`, error);
                video.src = url;
                video.preload = "metadata";
              }
            });
        };
      }

      // Create Artplayer instance
      const typeOrder = isHls ? ["m3u8", "normal"] : isMp4 ? ["mp4", "normal"] : ["normal"];

      const art = new Artplayer({
        container,
        url: videoUrl,
        muted,
        autoplay,
        loop,
        type: typeOrder[0],
        ...(Object.keys(customTypeHandlers).length > 0
          ? { customType: customTypeHandlers }
          : {}),
        moreVideoAttr: {
          playsInline: true,
          preload: "auto",
          crossOrigin: "anonymous",
        },
        // Hide default UI - we use custom controls
        icons: {
          loading: `<div style="display:none"></div>`,
          state: `<div style="display:none"></div>`,
        },
      });

      player.artplayer = art;

      art.on("ready", () => {
        const video = art.video;
        video.style.width = "100%";
        video.style.height = "100%";
        video.style.objectFit = "contain";
        video.style.pointerEvents = "none";

        player.videoElement = video;
        video.muted = this.globalMuted;

        // Restore saved position if any
        if (player.savedTime > 0) {
          try {
            video.currentTime = player.savedTime;
          } catch {
            // Ignore seeking errors
          }
        }

        onReady?.(player);
      });

      art.on("destroy", () => {
        // Clean up references when Artplayer is destroyed
        player.artplayer = null;
        player.videoElement = null;
        if (player.hls) {
          player.hls.destroy();
          player.hls = null;
        }
      });

      return player;
    } catch (error) {
      console.error(`[PlayerManager] Failed to create player for ${id}:`, error);
      onError?.(error as Error);
      return null;
    }
  }

  /**
   * Clean up all resources for a player.
   * This is the critical memory management function.
   */
  private cleanupPlayerResources(player: PooledPlayer): void {
    // 1. Abort any pending network requests
    if (player.abortController) {
      player.abortController.abort();
      player.abortController = null;
    }

    // 2. Destroy HLS instance (releases workers and buffers)
    if (player.hls) {
      try {
        player.hls.destroy();
      } catch {
        // Ignore cleanup errors
      }
      player.hls = null;
    }

    // 3. Clean up video element
    if (player.videoElement) {
      try {
        player.videoElement.pause();
        player.videoElement.removeAttribute("src");
        player.videoElement.load(); // Forces browser to release buffers
      } catch {
        // Ignore cleanup errors
      }
      player.videoElement = null;
    }

    // 4. Destroy Artplayer instance
    if (player.artplayer) {
      try {
        player.artplayer.pause();
        player.artplayer.destroy(false);
      } catch {
        try {
          player.artplayer.destroy();
        } catch {
          // Ignore cleanup errors
        }
      }
      player.artplayer = null;
    }

    // 5. Clear container reference
    player.container = null;
    player.currentUrl = "";
  }

  /**
   * Find and recycle the oldest inactive player.
   * Returns true if a player was recycled.
   */
  private recycleOldestInactive(isFullscreen: boolean): boolean {
    const targetPool = isFullscreen ? this.fullscreenPool : this.pool;

    let oldestInactive: { id: string; lastUsed: number } | null = null;

    targetPool.forEach((player, id) => {
      if (!player.isActive) {
        if (!oldestInactive || player.lastUsedAt < oldestInactive.lastUsed) {
          oldestInactive = { id, lastUsed: player.lastUsedAt };
        }
      }
    });

    if (oldestInactive) {
      this.destroyPlayer(oldestInactive.id, isFullscreen);
      return true;
    }

    return false;
  }

  /**
   * Force recycle the oldest player regardless of active state.
   * Used as last resort when pool is full and all players are active.
   */
  private forceRecycleOldest(isFullscreen: boolean): void {
    const targetPool = isFullscreen ? this.fullscreenPool : this.pool;

    let oldest: { id: string; lastUsed: number } | null = null;

    targetPool.forEach((player, id) => {
      if (!oldest || player.lastUsedAt < oldest.lastUsed) {
        oldest = { id, lastUsed: player.lastUsedAt };
      }
    });

    if (oldest) {
      console.warn(
        `[PlayerManager] Force recycling active player ${oldest.id} - ` +
        `this may cause visible glitches. Consider increasing pool size.`
      );
      this.destroyPlayer(oldest.id, isFullscreen);
    }
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

let managerInstance: PlayerPoolManager | null = null;

/**
 * Get the singleton PlayerPoolManager instance.
 * Use this to access the global player pool.
 */
export function getPlayerManager(): PlayerPoolManager {
  if (!managerInstance) {
    managerInstance = new PlayerPoolManager();
  }
  return managerInstance;
}

/**
 * Reset the singleton (useful for testing or hard reset).
 */
export function resetPlayerManager(): void {
  if (managerInstance) {
    managerInstance.destroyAllPlayers();
    managerInstance = null;
  }
}

export default PlayerPoolManager;
