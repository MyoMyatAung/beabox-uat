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
const APP_VERSION = '1.1.4.5';

/**
 * Generate a UUID v4
 * @returns a random UUID
 */
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Get or create a persistent UUID for this device/browser using IndexedDB
 * Returns a promise that resolves to the UUID
 */
const getPersistentUUIDFromIndexedDB = async (): Promise<string> => {
  const storageKey = 'app_device_uuid';
  
  return new Promise<string>((resolve) => {
    // Try to get UUID from IndexedDB
    const request = indexedDB.open('AppDatabase', 1);
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('deviceInfo')) {
        db.createObjectStore('deviceInfo');
      }
    };
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction('deviceInfo', 'readwrite');
      const store = transaction.objectStore('deviceInfo');
      
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
        console.warn('Could not retrieve UUID from IndexedDB');
        const uuid = generateUUID();
        resolve(uuid);
      };
    };
    
    request.onerror = () => {
      console.warn('Could not open IndexedDB, falling back to localStorage');
      // Fallback to localStorage
      let uuid = localStorage.getItem(storageKey);
      
      if (!uuid) {
        uuid = generateUUID();
        try {
          localStorage.setItem(storageKey, uuid);
        } catch {
          console.warn('Could not store UUID in localStorage');
        }
      }
      
      resolve(uuid);
    };
  });
};

/**
 * Get or create a persistent UUID for this device/browser
 * Maintains backward compatibility with synchronous API
 */
const getPersistentUUID = (): string => {
  const storageKey = 'app_device_uuid';
  let uuid = localStorage.getItem(storageKey);
  
  if (!uuid) {
    uuid = generateUUID();
    try {
      localStorage.setItem(storageKey, uuid);
    } catch {
      console.warn('Could not store UUID in localStorage');
    }
  }
  
  // Initialize IndexedDB storage in the background
  void getPersistentUUIDFromIndexedDB().then((persistentId: string) => {
    if (persistentId !== uuid) {
      setDeviceInfo({ uuid: persistentId });
    }
  }).catch((err: Error) => {
    console.warn('IndexedDB error:', err);
  });
  
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