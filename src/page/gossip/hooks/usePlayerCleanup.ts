/**
 * ============================================================================
 * USE PLAYER CLEANUP HOOK
 * ============================================================================
 *
 * Custom hook for managing video player memory cleanup.
 *
 * RESPONSIBILITIES:
 * - Clean up feed players when switching tabs
 * - Clean up all players when leaving the gossip page
 *
 * MEMORY MANAGEMENT STRATEGY:
 * Video players consume significant memory (HLS buffers, video elements).
 * This hook ensures proper cleanup to prevent memory leaks:
 *
 * 1. Tab Change Cleanup:
 *    - When switching tabs, destroy feed players from the previous tab
 *    - Prevents memory buildup from videos the user is no longer viewing
 *    - Preserves fullscreen player pool for smooth viewer experience
 *
 * 2. Unmount Cleanup:
 *    - When leaving the gossip page entirely, destroy ALL players
 *    - Includes both feed and fullscreen player pools
 *    - Ensures complete memory release when feature is not in use
 *
 * WHY THIS MATTERS:
 * - Each video player can consume 20-50MB+ of memory
 * - HLS.js workers and buffers need explicit cleanup
 * - Without cleanup, memory grows unbounded during infinite scroll
 *
 * @see playerManager.ts for the underlying pool implementation
 */

import { useRef, useEffect } from "react";
import { getPlayerManager } from "../services/playerManager";

interface UsePlayerCleanupOptions {
  /** Current active tab ID - cleanup triggers on change */
  activeTab: string;
}

/**
 * Hook for managing video player memory cleanup on tab changes and unmount.
 *
 * @param options - Configuration with current active tab
 *
 * @example
 * ```tsx
 * // In the main Gossip component
 * usePlayerCleanup({ activeTab });
 *
 * // Players are automatically cleaned up when:
 * // 1. User switches tabs (feed players destroyed)
 * // 2. User leaves the gossip page (all players destroyed)
 * ```
 */
export function usePlayerCleanup({ activeTab }: UsePlayerCleanupOptions): void {
  // Track previous tab to detect actual tab changes
  // Prevents cleanup on initial mount or pagination
  const prevTabRef = useRef<string | null>(null);

  /**
   * Effect: Clean up feed players on tab change.
   *
   * Only triggers when activeTab actually changes, not on:
   * - Initial mount (prevTabRef is null)
   * - Pagination (activeTab stays the same)
   *
   * Destroys feed players only (isFullscreen=false) to preserve
   * fullscreen viewer state during tab switches.
   */
  useEffect(() => {
    // Skip cleanup on initial mount
    if (prevTabRef.current !== null && prevTabRef.current !== activeTab) {
      const playerManager = getPlayerManager();
      // Destroy feed players only, preserve fullscreen pool
      playerManager.destroyAllPlayers(false);
    }
    prevTabRef.current = activeTab;
  }, [activeTab]);

  /**
   * Effect: Clean up all players on unmount.
   *
   * When leaving the gossip feature entirely, destroy both:
   * - Feed player pool (isFullscreen=false)
   * - Fullscreen player pool (isFullscreen=true)
   *
   * This ensures complete memory release when the component unmounts.
   */
  useEffect(() => {
    const playerManager = getPlayerManager();

    return () => {
      // Destroy all players (both pools) on unmount
      playerManager.destroyAllPlayers();
    };
  }, []);
}

export default usePlayerCleanup;
