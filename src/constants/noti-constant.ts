export const NOTIFICATION_CONFIG = {
  FADE_IN_DELAY: 100,
  FADE_OUT_DURATION: 300,
  AUTO_CLOSE_DELAY: 5000,
  // COOLDOWN_MS: 5 * 1000, // 5 seconds for testing
  COOLDOWN_MS: 0, // No cooldown to allow showing on every app open
  STORAGE_KEY: "notipopup_data",
  Z_INDEX: 99999,
  MAX_SHOWN_IDS: 50, // Prevent localStorage from growing too large
} as const;
