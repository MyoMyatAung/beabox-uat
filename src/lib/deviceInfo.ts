/* eslint-disable @typescript-eslint/no-explicit-any */
import FingerprintJS from "@fingerprintjs/fingerprintjs";
// Device information service for webview integration

/**
 * Device information interface
 */
interface DeviceInfo {
  deviceName: string;
  uuid: string;
  osVersion: string;
  appVersion: string;
  [key: string]: any; // Allow additional properties for fingerprinting data
}

// Application version - single source of truth
export const APP_VERSION = "1.2.0.5";

/**
 * Generate a UUID v4
 * @returns a random UUID
 */
const generateUUID = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Get or create a persistent UUID for this device/browser using IndexedDB
 * Returns a promise that resolves to the UUID
 */
const getPersistentUUIDFromIndexedDB = async (): Promise<string> => {
  const storageKey = "app_device_uuid";

  return new Promise<string>((resolve) => {
    // Try to get UUID from IndexedDB
    const request = indexedDB.open("AppDatabase", 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("deviceInfo")) {
        db.createObjectStore("deviceInfo");
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction("deviceInfo", "readwrite");
      const store = transaction.objectStore("deviceInfo");

      const getRequest = store.get(storageKey);

      getRequest.onsuccess = () => {
        let uuid: string | null = getRequest.result;

        if (!uuid) {
          uuid = generateUUID();
          store.put(uuid, storageKey);
        }

        resolve(uuid);
      };

      getRequest.onerror = () => {
        console.warn("Could not retrieve UUID from IndexedDB");
        const uuid = generateUUID();
        resolve(uuid);
      };
    };

    request.onerror = () => {
      console.warn("Could not open IndexedDB");
      // Generate temporary UUID if IndexedDB fails
      const uuid = generateUUID();
      resolve(uuid);
    };
  });
};

/**
 * Detect device name from user agent
 */
const detectDeviceName = (): string => {
  const ua = navigator.userAgent;
  const platform = navigator.platform;

  // Check for mobile devices first
  if (/iPhone|iPad|iPod/.test(ua)) {
    return /iPad/.test(ua) ? "iPad" : "iPhone";
  }

  if (/Android/.test(ua)) {
    return "Android Device";
  }

  // Desktop detection
  if (/Win/.test(platform)) {
    return "Windows Device";
  }

  if (/Mac/.test(platform)) {
    return "Mac Device";
  }

  if (/Linux/.test(platform)) {
    return "Linux Device";
  }

  // Fallback
  return "Unknown Device";
};

let deviceInfo: DeviceInfo = {
  deviceName: detectDeviceName(),
  osVersion: navigator.userAgent,
  appVersion: APP_VERSION,
  uuid: "", // Will be set by IndexedDB (browser) or native side (webview)
};

/**
 * Collect environment flags that might indicate emulation or suspicious environments
 */
const collectEnvironmentFlags = (): string[] => {
  const flags: string[] = [];

  // Check WebGL renderer for emulation signs
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (gl) {
      // Type assert to WebGLRenderingContext
      const webGl = gl as WebGLRenderingContext;
      const renderer = webGl.getParameter(webGl.RENDERER);
      if (/SwiftShader|llvmpipe|ANGLE/i.test(renderer)) {
        flags.push(`suspicious_webgl:${renderer}`);
      } else {
        // Always add the renderer info even if not suspicious
        flags.push(`webgl:${renderer}`);
      }

      // Add WebGL vendor information
      const vendor = webGl.getParameter(webGl.VENDOR);
      flags.push(`webgl_vendor:${vendor}`);
    }
  } catch {
    // Silently catch any WebGL errors
    flags.push("webgl_error");
  }

  // Check for automation-related properties
  if (navigator.webdriver) {
    flags.push("webdriver_detected");
  }

  // Check for headless browser indicators
  if (!("ontouchstart" in window) && navigator.maxTouchPoints === 0) {
    flags.push("no_touch_support");
  }

  // Check for inconsistent platform/userAgent
  const ua = navigator.userAgent.toLowerCase();
  const platform = navigator.platform.toLowerCase();

  if (ua.includes("android") && !platform.includes("linux")) {
    flags.push("platform_ua_mismatch");
  }

  if (ua.includes("iphone") && !platform.includes("iphone")) {
    flags.push("platform_ua_mismatch");
  }

  // Add browser features as flags
  flags.push(`screen:${window.screen.width}x${window.screen.height}`);
  flags.push(`dpr:${window.devicePixelRatio}`);
  flags.push(`lang:${navigator.language}`);

  // Ensure we always have at least one flag
  if (flags.length === 0) {
    flags.push("standard_environment");
  }

  return flags;
};

/**
 * Simple hash function for strings
 */
const hashString = async (str: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

/**
 * Initialize device info with persistent UUID from IndexedDB (browser only)
 */
export const initPersistentDeviceInfo = async (): Promise<void> => {
  // Only generate UUID if not in webview (browser usage)
  if (!isMobileWebView()) {
    try {
      const persistentUuid = await getPersistentUUIDFromIndexedDB();
      setDeviceInfo({ uuid: persistentUuid });
    } catch (err) {
      console.warn("Failed to initialize persistent device info:", err);
    }
  }
};

/**
 * Initialize and collect comprehensive device information for identification and analytics.
 * 
 * This function performs two main tasks:
 * 1. Initializes a persistent UUID (for browser environments) or uses native-provided UUID
 * 2. Collects device fingerprinting data using FingerprintJS library
 * 
 * The collected data is used for:
 * - Device identification and tracking
 * - Security and fraud detection
 * - Analytics and user behavior analysis
 * - Ensuring consistent device recognition across sessions
 * 
 * @async
 * @returns {Promise<void>} Resolves when device info initialization is complete
 * 
 * @example
 * // Called once during app initialization
 * await initDeviceInfo();
 * const info = getDeviceInfo(); // Retrieve collected device info
 */
export const initDeviceInfo = async () => {
  // Step 1: Initialize persistent UUID for browser environments
  // This creates or retrieves a UUID from IndexedDB that persists across sessions.
  // In WebView environments, the UUID will be provided by the native app via initDeviceInfoListener()
  // so this step is skipped for WebViews to avoid conflicts.
  await initPersistentDeviceInfo();

  try {
    // Step 2: Load FingerprintJS library
    // FingerprintJS is a browser fingerprinting library that collects various device/browser
    // characteristics to create a unique identifier. This helps identify devices even when
    // cookies/localStorage are cleared.
    const fp = await FingerprintJS.load();
    const result = await fp.get();

    // Step 3: Extract fingerprinting components from FingerprintJS result
    // These components contain detailed information about the browser/device configuration
    const c = result.components;

    // Step 4: Build comprehensive device fingerprinting payload
    // This payload combines standard browser APIs with FingerprintJS data to create
    // a detailed device profile. Each property helps uniquely identify the device.
    const payload = {
      // Standard browser identification
      userAgent: navigator.userAgent, // Browser and OS information
      screenResolution: `${screen.width}x${screen.height}`, // Display dimensions
      colorDepth: screen.colorDepth, // Color bit depth (e.g., 24-bit, 32-bit)
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // User's timezone (e.g., "America/New_York")
      language: navigator.language, // Browser language preference (e.g., "en-US")

      // Font detection (from FingerprintJS)
      // List of available fonts - different devices/browsers have different font sets
      // This is a strong fingerprinting signal as font availability varies by OS/device
      fonts:
        c.fonts && "value" in c.fonts
          ? c.fonts.value
          : ["Arial", "Times New Roman"], // Fallback to common fonts if detection fails

      // Canvas fingerprinting (hashed for privacy)
      // Canvas rendering produces slightly different outputs based on hardware/OS/drivers
      // We hash this data to reduce size while maintaining uniqueness
      canvas: await hashString(
        JSON.stringify(c.canvas && "value" in c.canvas ? c.canvas.value : "")
      ),

      // WebGL fingerprinting (hashed for privacy)
      // WebGL renderer information reveals GPU details and driver versions
      // Similar to canvas, this varies by hardware and helps identify devices
      // Hashed to reduce payload size and protect sensitive hardware information
      webgl: await hashString(
        JSON.stringify(
          (c as any).webgl && "value" in (c as any).webgl
            ? (c as any).webgl.value
            : ""
        )
      ),

      // Browser plugins/extensions
      // List of installed browser plugins (becoming less common in modern browsers)
      plugins: Array.from(navigator.plugins).map((p) => p.name),

      // System information
      platform: navigator.platform, // Operating system platform (e.g., "MacIntel", "Win32")
      hardwareConcurrency: navigator.hardwareConcurrency || 0, // Number of CPU cores
      deviceMemory: (navigator as any).deviceMemory || 0, // Device RAM in GB (if available)
      touchPoints: navigator.maxTouchPoints || 0, // Maximum number of simultaneous touch points
      devicePixelRatio: window.devicePixelRatio || 1, // Screen pixel density ratio

      // Environment flags for security detection
      // Flags that indicate suspicious environments (emulators, automation tools, etc.)
      // Used for fraud detection and security purposes
      env_flags: collectEnvironmentFlags(),
    };

    // Step 5: Merge collected data into global deviceInfo object
    // Important: We spread existing deviceInfo first to preserve:
    // - UUID from IndexedDB (browser) or native app (WebView)
    // - Any device info already set by initDeviceInfoListener() from native side
    // Then we overlay the fingerprinting payload on top
    deviceInfo = {
      ...deviceInfo, // Preserve existing UUID and any native-provided data
      ...payload, // Add comprehensive fingerprinting data
    };
  } catch (e) {
    // Error handling: If FingerprintJS fails (e.g., blocked by privacy extensions),
    // we log a warning but don't throw. The app can still function with basic device info
    // that was collected in initPersistentDeviceInfo().
    console.warn("FingerprintJS failed:", e);
    // Note: deviceInfo still contains basic info (UUID, deviceName, etc.) even if fingerprinting fails
  }
};

/**
 * Device info event from native applications
 */
interface DeviceInfoEvent extends CustomEvent {
  detail: Partial<any>;
}

/**
 * Listens for device information sent from the native app and merges it into the global deviceInfo object.
 * Used to enhance browser-collected data with native-specific details.
 */
export const initDeviceInfoListener = (): void => {
  // Listen for the custom 'getDeviceInfo' event dispatched by the native layer
  window.addEventListener(
    "getDeviceInfo",
    ((event: DeviceInfoEvent) => {
      // If the event contains device information details
      if (event.detail) {
        // Merge received native device info with current deviceInfo object
        deviceInfo = {
          ...deviceInfo,
          ...event.detail, // Properties from native are spread into deviceInfo
        };
        // Output device info for debugging/tracing
        console.log("Device info received from native:", deviceInfo);
      }
    }) as EventListener
  );
};

/**
 * Get current device information
 */
export const getDeviceInfo = (): any => {
  return { ...deviceInfo };
};

/**
 * Set device information manually
 * @param info Partial device information to update
 */
export const setDeviceInfo = (info: Partial<any>): void => {
  deviceInfo = {
    ...deviceInfo,
    ...info,
  };
};

/**
 * Check if running in an iOS WebView
 */
export const isIOSWebView = (): boolean => {
  return Boolean(
    (
      window as unknown as {
        webkit?: { messageHandlers?: { jsBridge?: unknown } };
      }
    ).webkit?.messageHandlers?.jsBridge
  );
};

/**
 * Check if running in an Android WebView
 */
export const isAndroidWebView = (): boolean => {
  return Boolean(
    (window as unknown as { Android?: unknown }).Android ||
      navigator.userAgent.includes("wv")
  );
};

/**
 * Check if running in any mobile WebView
 */
export const isMobileWebView = (): boolean => {
  return isIOSWebView() || isAndroidWebView();
};

/**
 * Check if app version needs update
 * @returns Promise that resolves to true if update is needed
 */
// This function is now replaced by RTK Query in versionApi.ts

// Check if device is iOS
export const isIOSDevice = (): boolean => {
  return /iPhone|iPad|iPod/.test(navigator.userAgent);
};
