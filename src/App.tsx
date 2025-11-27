import { useEffect } from "react";
import Routing from "./routes/Routing";
import { useSelector } from "react-redux";
import ErrorToast from "./page/home/services/ErrorToast";
import { Toaster } from "./components/ui/toaster";
import { useGetApplicationAdsQuery } from "./store/api/explore/exploreApi";
import { initDeviceInfoListener, initDeviceInfo } from "./lib/deviceInfo";
import { InAppBrowserAlert } from "./components/InAppBrowserAlert";
import { selectPanding } from "./types/store";

// Custom hooks
import { useDeviceDetection } from "./hooks/useDeviceDetection";
import { useVersionCheck } from "./hooks/useVersionCheck";
import { useVideoHeightAdjustment } from "./hooks/useVideoHeightAdjustment";
import { useInAppBrowserDetection } from "./hooks/useInAppBrowserDetection";
import { useNativeBridge } from "./hooks/useNativeBridge";
import { useLandingPageSession } from "./hooks/useLandingPageSession";
import { usePasswordStateReset } from "./hooks/usePasswordStateReset";

/**
 * Main App component
 * Single Responsibility: Orchestrate app initialization and render main UI
 * 
 * This component follows SOLID principles:
 * - Single Responsibility: Each concern is handled by a dedicated custom hook
 * - Open/Closed: Extensible through custom hooks without modifying this component
 * - Dependency Inversion: Depends on abstractions (hooks) rather than concrete implementations
 */
const App = () => {
  const panding = useSelector(selectPanding);
  const showInAppBrowserAlert = useInAppBrowserDetection();

  // Initialize device info on mount
  useEffect(() => {
    initDeviceInfoListener();
    initDeviceInfo();
  }, []);

  // Custom hooks for different concerns
  useDeviceDetection(); // Detects device type and sets CSS classes
  useVersionCheck(); // Checks for app version updates
  useVideoHeightAdjustment(); // Adjusts video height based on screen size
  useLandingPageSession(); // Manages landing page session state
  usePasswordStateReset();
  useNativeBridge(panding); // Handles native bridge communication based on landing page state

  return (
    <>
      {showInAppBrowserAlert ? (
        <InAppBrowserAlert />
      ) : (
        <>
          <Routing />
          <Toaster />
          <ErrorToast />
        </>
      )}
    </>
  );
};

export default App;
