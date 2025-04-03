// Device information service for webview integration

/**
 * Device information interface
 */
interface DeviceInfo {
  deviceName: string;
  uuid: string;
  osVersion: string;
  appVersion: string;
}

// Application version - single source of truth
const APP_VERSION = '1.1.0.7';

/**
 * Simple but fast hash function to generate consistent device fingerprint 
 */
const simpleHash = (str: string): string => {
  let hash = 0;
  if (str.length === 0) return hash.toString(36);
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Convert to alphanumeric format that looks like a UUID
  const hashStr = (hash & 0x7FFFFFFF).toString(36);
  // Format like a UUID to maintain compatibility
  return `${hashStr.padStart(8, '0')}-${hashStr.slice(0, 4)}-4${hashStr.slice(4, 7)}-${hashStr.slice(7, 11)}-${hashStr.slice(11, 23).padEnd(12, '0')}`;
};

/**
 * Gets a canvas fingerprint that works across browsers including Safari
 */
const getCanvasFingerprint = (): string => {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    
    canvas.width = 200;
    canvas.height = 50;
    
    // Text with different styles
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = 'rgba(100, 150, 200, 0.5)';
    ctx.fillRect(10, 10, 100, 30);
    ctx.fillStyle = 'rgba(200, 100, 150, 0.7)';
    ctx.fillText('BeaBoxFP', 15, 15);
    
    // Add some shapes with gradients
    const gradient = ctx.createLinearGradient(0, 0, 170, 0);
    gradient.addColorStop(0, "magenta");
    gradient.addColorStop(0.5, "blue");
    gradient.addColorStop(1.0, "red");
    ctx.fillStyle = gradient;
    ctx.fillRect(30, 30, 120, 10);
    
    return canvas.toDataURL().slice(0, 64);
  } catch (e) {
    console.warn('Canvas fingerprinting not available:', e);
    return '';
  }
};

// Define types for non-standard browser properties
interface NavigatorExtras {
  deviceMemory?: number;
}

/**
 * Get or create a persistent UUID for this device/browser using multiple techniques
 * for resilience across browsers and cache clearing
 */
const getPersistentUUID = (): string => {
  const storageKey = 'app_device_uuid';
  
  // Try to get from localStorage first
  let uuid = localStorage.getItem(storageKey);
  
  // Try to get from sessionStorage if not in localStorage
  if (!uuid) {
    uuid = sessionStorage.getItem(storageKey);
  }
  
  // Try to get from cookies if not in storage
  if (!uuid) {
    const cookieMatch = document.cookie.match(new RegExp(`(^| )${storageKey}=([^;]+)`));
    if (cookieMatch) {
      uuid = cookieMatch[2];
    }
  }
  
  // If we still don't have a UUID, generate one from device fingerprint
  if (!uuid) {
    // Access non-standard properties safely
    const navigatorExtras = navigator as Navigator & NavigatorExtras;
    
    // Collect various browser and device characteristics
    const components = [
      navigator.userAgent,
      navigator.language,
      navigator.languages?.join(',') || '',
      screen.colorDepth,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 1,
      navigatorExtras.deviceMemory || 1,
      !!navigator.cookieEnabled,
      navigator.platform,
      getCanvasFingerprint()
    ];
    
    uuid = simpleHash(components.join('||'));
    
    // Store in multiple locations for persistence
    try {
      localStorage.setItem(storageKey, uuid);
      sessionStorage.setItem(storageKey, uuid);
      
      // Set as cookie that expires in 1 year
      const expiry = new Date();
      expiry.setFullYear(expiry.getFullYear() + 1);
      document.cookie = `${storageKey}=${uuid}; expires=${expiry.toUTCString()}; path=/`;
      
      // Try IndexedDB storage (often persists when localStorage doesn't)
      if (window.indexedDB) {
        const request = indexedDB.open('DeviceDatabase', 1);
        request.onupgradeneeded = function(e) {
          const db = (e.target as IDBOpenDBRequest).result;
          if (db && !db.objectStoreNames.contains('deviceInfo')) {
            db.createObjectStore('deviceInfo', { keyPath: 'id' });
          }
        };
        request.onsuccess = function(e) {
          const db = (e.target as IDBOpenDBRequest).result;
          const transaction = db.transaction(['deviceInfo'], 'readwrite');
          const store = transaction.objectStore('deviceInfo');
          store.put({ id: 'fingerprint', value: uuid });
        };
      }
    } catch (e) {
      console.warn('Could not store device fingerprint:', e);
    }
  }
  
  return uuid;
};

/**
 * Detect device name from user agent
 */
const detectDeviceName = (): string => {
  const ua = navigator.userAgent;
  const platform = navigator.platform;
  
  // Check for mobile devices first
  if (/iPhone|iPad|iPod/.test(ua)) {
    return /iPad/.test(ua) ? 'iPad' : 'iPhone';
  }
  
  if (/Android/.test(ua)) {
    return 'Android Device';
  }
  
  // Desktop detection
  if (/Win/.test(platform)) {
    return 'Windows Device';
  }
  
  if (/Mac/.test(platform)) {
    return 'Mac Device';
  }
  
  if (/Linux/.test(platform)) {
    return 'Linux Device';
  }
  
  // Fallback
  return 'Unknown Device';
};

// Default device info for web browsers
const defaultDeviceInfo: DeviceInfo = {
  deviceName: detectDeviceName(),
  uuid: getPersistentUUID(),
  osVersion: navigator.userAgent,
  appVersion: APP_VERSION
};

let deviceInfo: DeviceInfo = { ...defaultDeviceInfo };

/**
 * Device info event from native applications
 */
interface DeviceInfoEvent extends CustomEvent {
  detail: Partial<DeviceInfo>;
}

/**
 * Initialize device info listener for WebView communication
 */
export const initDeviceInfoListener = (): void => {
  window.addEventListener('getDeviceInfo', ((event: DeviceInfoEvent) => {
    if (event.detail) {
      deviceInfo = {
        ...defaultDeviceInfo,
        ...event.detail,
      };
      console.log('Device info received:', deviceInfo);
    }
  }) as EventListener);
};

/**
 * Get current device information
 */
export const getDeviceInfo = (): DeviceInfo => {
  return { ...deviceInfo };
};

/**
 * Set device information manually
 * @param info Partial device information to update
 */
export const setDeviceInfo = (info: Partial<DeviceInfo>): void => {
  deviceInfo = {
    ...deviceInfo,
    ...info
  };
};

/**
 * Check if running in an iOS WebView
 */
export const isIOSWebView = (): boolean => {
  return Boolean(
    (window as unknown as { webkit?: { messageHandlers?: { jsBridge?: unknown } } }).webkit?.messageHandlers?.jsBridge
  );
};

/**
 * Check if running in an Android WebView
 */
export const isAndroidWebView = (): boolean => {
  return Boolean(
    (window as unknown as { Android?: unknown }).Android ||
    navigator.userAgent.includes('wv')
  );
};

/**
 * Check if running in any mobile WebView
 */
export const isMobileWebView = (): boolean => {
  return isIOSWebView() || isAndroidWebView();
}; 