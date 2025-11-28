/**
 * Scroll Restriction Slice
 * 
 * PURPOSE:
 * ========
 * Manages scroll restriction state for the video feed.
 * Used to limit user scrolling to the second video during onboarding,
 * ensuring users see the Ad Popup before accessing all content.
 * 
 * BUSINESS LOGIC:
 * ===============
 * - When user guide is active, restrict scrolling to max 2 videos (index 0 and 1)
 * - When user reaches second video, mark as reached and trigger Ad Popup
 * - After Ad Popup closes, unlock all scrolling
 * 
 * USAGE:
 * ======
 * - ImmersiveUserGuide: Sets restriction when guide is active
 * - Home component: Enforces restriction by limiting scrollable content
 * - PopupLayer: Clears restriction when Ad Popup is closed
 */

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/**
 * Scroll restriction state interface
 */
interface ScrollRestrictionState {
  /** Whether scrolling should be restricted to first 2 videos */
  isRestricted: boolean;
  /** Whether user has reached the second video (index 1) */
  hasReachedSecondVideo: boolean;
  /** Maximum video index user can scroll to (when restricted) */
  maxScrollIndex: number;
}

// =============================================================================
// INITIAL STATE
// =============================================================================

/**
 * Initial state - no restrictions by default
 */
const initialState: ScrollRestrictionState = {
  isRestricted: false,
  hasReachedSecondVideo: false,
  maxScrollIndex: 1, // Allow scrolling to second video (index 0 and 1)
};

// =============================================================================
// SLICE DEFINITION
// =============================================================================

export const scrollRestrictionSlice = createSlice({
  name: "scrollRestriction",
  initialState,
  reducers: {
    /**
     * Enable scroll restriction
     * Business Logic: Called when user guide becomes active
     */
    enableScrollRestriction: (state) => {
      state.isRestricted = true;
      state.hasReachedSecondVideo = false;
    },

    /**
     * Disable scroll restriction
     * Business Logic: Called when Ad Popup is closed, allowing unlimited scrolling
     */
    disableScrollRestriction: (state) => {
      state.isRestricted = false;
    },

    /**
     * Mark second video as reached
     * Business Logic: Called when user scrolls to second video (index 1)
     */
    markSecondVideoReached: (state) => {
      state.hasReachedSecondVideo = true;
    },

    /**
     * Reset scroll restriction state
     * Business Logic: Called on app reset or user logout
     */
    resetScrollRestriction: (state) => {
      state.isRestricted = false;
      state.hasReachedSecondVideo = false;
    },

    /**
     * Set maximum scroll index
     * Business Logic: Allows dynamic control of scroll limit
     */
    setMaxScrollIndex: (state, action: PayloadAction<number>) => {
      state.maxScrollIndex = action.payload;
    },
  },
});

// =============================================================================
// EXPORTS
// =============================================================================

// Export actions
export const {
  enableScrollRestriction,
  disableScrollRestriction,
  markSecondVideoReached,
  resetScrollRestriction,
  setMaxScrollIndex,
} = scrollRestrictionSlice.actions;

// Export reducer
export default scrollRestrictionSlice.reducer;

