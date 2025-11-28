import { useEffect, useState } from "react";
import { DeviceType } from "./useDeviceDetection";

/**
 * Custom hook for managing dialog configuration based on device type
 * 
 * Business Logic:
 * - Fetches device-specific dialog configuration from API
 * - Configures whether to show download dialog and what URL to redirect to
 * - Different devices (iOS/Android) may have different app download links
 * - Dialog is typically shown to prompt users to download the native app
 * 
 * Configuration includes:
 * - jump_url: URL to redirect user to app store or download page
 * - show_dialog: Boolean flag to enable/disable dialog for this device type
 */
export const useDialogConfig = (
  config: any,
  deviceType: DeviceType
) => {
  const [showDialog, setShowDialog] = useState(false);
  const [jumpUrl, setJumpUrl] = useState("");

  useEffect(() => {
    /**
     * Configure dialog settings based on device type
     * 
     * Business Rule:
     * - Only configure if we have both config data and device type detected
     * - Find the dialog config item matching the current device type
     * - Extract jump_url (app download link) and show_dialog flag
     * - show_dialog can be boolean, number (1/0), or string ("true"/"1")
     */
    if (config?.data?.dialog_config && deviceType) {
      const dialogConfigItem = config.data.dialog_config.find(
        (item: any) => item.device === deviceType
      );

      if (dialogConfigItem) {
        // Set download URL if provided
        if (dialogConfigItem.jump_url) {
          setJumpUrl(dialogConfigItem.jump_url);
        }

        // Normalize show_dialog flag (handles various formats from API)
        const shouldShowDialog =
          dialogConfigItem.show_dialog === 1 ||
          dialogConfigItem.show_dialog === true ||
          dialogConfigItem.show_dialog === "1" ||
          dialogConfigItem.show_dialog === "true";
        
        setShowDialog(shouldShowDialog);
      }
    }
  }, [config, deviceType]);

  return { showDialog, jumpUrl };
};

