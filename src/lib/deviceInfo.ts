// Device information service for webview integration

interface DeviceInfo {
  deviceName: string;
  uuid: string;
  osVersion: string;
  appVersion: string;
}

// Default device info for web browsers
const defaultDeviceInfo: DeviceInfo = {
  deviceName: 'Web Browser',
  uuid: 'web-browser-uuid',
  osVersion: navigator.userAgent,
  appVersion: '1.0.0'
};

let deviceInfo: DeviceInfo = { ...defaultDeviceInfo };

// Define custom event type for device info
interface DeviceInfoEvent extends CustomEvent {
  detail: {
    deviceName?: string;
    uuid?: string;
    osVersion?: string;
    appVersion?: string;
  };
}

// Function to initialize device info listener
export const initDeviceInfoListener = (): void => {
  // Listen for the custom event from native app
  window.addEventListener('getDeviceInfo', ((event: DeviceInfoEvent) => {
    if (event.detail) {
      deviceInfo = {
        deviceName: event.detail.deviceName || defaultDeviceInfo.deviceName,
        uuid: event.detail.uuid || defaultDeviceInfo.uuid,
        osVersion: event.detail.osVersion || defaultDeviceInfo.osVersion,
        appVersion: "1.0.7.5"
      };
      console.log('Device info received:', deviceInfo);
    }
  }) as EventListener);
};

// Function to get current device info
export const getDeviceInfo = (): DeviceInfo => {
  return deviceInfo;
};

// Function to manually set device info (for testing or direct setting)
export const setDeviceInfo = (info: Partial<DeviceInfo>): void => {
  deviceInfo = {
    ...deviceInfo,
    ...info
  };
};

// Function to detect if running in iOS WebView
export const isIOSWebView = (): boolean => {
  return Boolean(
    (window as unknown as { webkit?: { messageHandlers?: { jsBridge?: unknown } } }).webkit?.messageHandlers?.jsBridge
  );
};

// Function to detect if running in any mobile WebView
export const isMobileWebView = (): boolean => {
  return isIOSWebView();
}; 