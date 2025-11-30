/**
 * Browser detection utilities
 * Single Responsibility: Detect browser types and environments
 */

export interface InAppBrowserInfo {
  inWeChat: boolean;
  inAlipay: boolean;
  inWeibo: boolean;
  inQQ: boolean;
  inDouyin: boolean;
  inToutiao: boolean;
}

/**
 * Detects if the app is running in a WebClip (iOS standalone mode)
 */
export const isWebClip = (): boolean => {
  return (
    "standalone" in window.navigator && window.navigator.standalone === true
  );
};

/**
 * Detects if the user is on an Android device
 */
export const isAndroidDevice = (): boolean => {
  return /Android/i.test(navigator.userAgent);
};

/**
 * Detects if the app is running in an in-app browser
 */
export const detectInAppBrowser = (): InAppBrowserInfo => {
  const ua = navigator.userAgent.toLowerCase();
  return {
    inWeChat: ua.indexOf("micromessenger") !== -1,
    inAlipay: ua.indexOf("alipayclient") !== -1,
    inWeibo: ua.indexOf("weibo") !== -1,
    inQQ: ua.indexOf("qq/") !== -1,
    inDouyin: ua.includes("douyin"),
    inToutiao: ua.includes("newsarticle"),
  };
};

/**
 * Checks if any in-app browser is detected
 */
export const isInAppBrowser = (): boolean => {
  const browserInfo = detectInAppBrowser();
  return (
    browserInfo.inWeChat ||
    browserInfo.inAlipay ||
    browserInfo.inWeibo ||
    browserInfo.inQQ
  );
};

