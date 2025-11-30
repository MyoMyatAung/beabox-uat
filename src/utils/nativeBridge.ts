/**
 * Native bridge communication utilities
 * Single Responsibility: Handle communication with native iOS/Android apps
 */

interface WebKitMessageHandlers {
  jsBridge?: {
    postMessage: (message: string) => void;
  };
}

interface WindowWithWebKit extends Window {
  webkit?: {
    messageHandlers?: WebKitMessageHandlers;
  };
}

/**
 * Native event types that can be sent to the native app
 */
export enum NativeEventType {
  ADS_STARTED = "beabox_ads_started",
  HOME_STARTED = "beabox_home_started",
}

/**
 * Checks if native bridge is available
 */
export const isNativeBridgeAvailable = (): boolean => {
  const windowWithWebKit = window as unknown as WindowWithWebKit;
  return Boolean(
    windowWithWebKit.webkit?.messageHandlers?.jsBridge
  );
};

/**
 * Sends a message to the native app via WebKit message handlers
 * @param message - The message to send
 */
export const sendNativeEvent = (message: string): void => {
  if (isNativeBridgeAvailable()) {
    const windowWithWebKit = window as unknown as WindowWithWebKit;
    windowWithWebKit.webkit?.messageHandlers?.jsBridge?.postMessage(message);
  }
};

