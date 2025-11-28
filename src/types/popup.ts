/**
 * Popup-related types and constants
 * Business Logic: Shared types and enums used across popup components and hooks
 */

/**
 * Animation and timing constants
 * Business Logic: These values control the popup animation timing and display duration
 */
export const ANIMATION_DELAY_MS = 500; // Delay before showing popup to ensure smooth animation

/**
 * Popup display stages
 * Business Logic: The popup flow follows a sequential order:
 * 1. Start Images (index_popup) - Multiple promotional images shown in sequence
 * 2. App Content (popup_application) - Grid of downloadable apps
 * 3. Notice - System announcements and updates
 */
export enum PopupStage {
  START_IMAGES = "start_images",
  APP_CONTENT = "app_content",
  NOTICE = "notice",
  CLOSED = "closed",
}

/**
 * Application item from API
 * Business Logic: Represents a downloadable app shown in the app grid
 */
export interface AppItem {
  id: string | number;
  image: string;
  title: string;
  url: string;
}

/**
 * Popup image from API
 * Business Logic: Represents a promotional image shown at the start of popup sequence
 */
export interface PopupImage {
  id: string | number;
  image: string;
  jump_url: string;
}

/**
 * Notice group from API
 * Business Logic: Represents a group of system announcements and updates
 * Each group contains multiple notices organized by category
 */
export interface NoticeGroup {
  title: string;
  notices: Array<{
    id: string | number;
    title: string;
    content: string;
  }>;
}

/**
 * Popup state management
 * Business Logic: Centralized state for managing popup display flow
 */
export interface PopupState {
  stage: PopupStage;
  currentImageIndex: number;
  isMounted: boolean;
}
