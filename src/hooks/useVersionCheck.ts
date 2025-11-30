import { useEffect } from "react";
import { useCheckAppVersionQuery } from "@/store/api/versionApi";
import { convertVersionToNumeric } from "@/utils/versionUtils";
import { isWebClip } from "@/utils/browserDetection";
import { APP_VERSION } from "@/lib/deviceInfo";

/**
 * Custom hook for app version checking
 * Single Responsibility: Handle version checking and auto-reload logic
 */
export const useVersionCheck = (): void => {
  const numericVersion = convertVersionToNumeric(APP_VERSION);

  const { data: versionData, isSuccess: versionCheckSuccess } =
    useCheckAppVersionQuery(
      {
        platform: "ios",
        version: numericVersion,
      },
      {
        skip: !numericVersion,
      }
    );

  useEffect(() => {
    if (versionCheckSuccess && versionData) {
      const needsUpdate = versionData?.data?.update_status;
      if (needsUpdate && isWebClip()) {
        window.location.reload();
      }
    }
  }, [versionCheckSuccess, versionData]);
};

