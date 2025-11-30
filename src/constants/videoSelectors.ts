/**
 * CSS selectors for video-related elements
 * Single Responsibility: Centralize selector constants
 */

export const VIDEO_SELECTORS = {
  VIDEO: ".video",
  VIDEO1: ".video1",
  VIDEO_FOOTER: ".videoFooter",
} as const;

export const VIDEO_STYLES = {
  MOBILE_VIDEO_HEIGHT: "calc(100dvh - 64px)",
  MOBILE_VIDEO1_HEIGHT: "calc(100dvh - 0px)",
  MOBILE_FOOTER_BOTTOM: "40px",
} as const;

