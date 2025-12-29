/**
 * ============================================================================
 * GOSSIP MODULE CONSTANTS
 * ============================================================================
 *
 * Centralized constants for the Gossip feature module.
 * Keeping constants in a separate file improves maintainability and makes
 * it easy to adjust configuration without modifying business logic.
 */

// ============================================================================
// STORAGE KEYS
// ============================================================================

/**
 * LocalStorage key for persisting the active tab across sessions.
 * Used to restore user's last viewed category when returning to the page.
 */
export const GOSSIP_TAB_STORAGE_KEY = "gossip-active-tab";

// ============================================================================
// PAGINATION SETTINGS
// ============================================================================

/**
 * Number of posts to fetch per API request.
 * Balanced for performance and user experience.
 */
export const DEFAULT_PAGE_SIZE = 20;

/**
 * Initial page number for pagination.
 */
export const INITIAL_PAGE = 1;

// ============================================================================
// UI SETTINGS
// ============================================================================

/**
 * Number of skeleton posts to show during initial loading.
 */
export const SKELETON_COUNT = 2;

// ============================================================================
// DOM ELEMENT IDS
// ============================================================================

/**
 * ID of the main scroll container element.
 * Used for scroll position management and infinite scroll.
 */
export const SCROLL_CONTAINER_ID = "gossip-scroll-container";
