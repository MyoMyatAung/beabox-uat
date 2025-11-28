import { useEffect, useState } from "react";
import { useGetAdsNoticeQuery } from "@/store/api/explore/exploreApi";
import { useGetAdsPopUpQuery } from "@/utils/helperService";
import type { PopupImage, AppItem, NoticeGroup } from "@/types/popup";

/**
 * Custom hook to manage popup data from APIs
 * Business Logic:
 * - Fetches popup images (index_popup) and app list (popup_application) from ads API
 * - Fetches notice data from notice API
 * - Updates local state when API data is available
 * 
 * @returns Object containing popup images, app list, and notice list
 */
export const usePopupData = () => {
  const [popupImages, setPopupImages] = useState<PopupImage[]>([]);
  const [appList, setAppList] = useState<AppItem[]>([]);
  const [noticeList, setNoticeList] = useState<NoticeGroup[]>([]);

  const { data: adsData } = useGetAdsPopUpQuery();
  const { data: noticeData } = useGetAdsNoticeQuery("");

  useEffect(() => {
    // Update popup images and app list when ads data is available
    if (adsData?.data?.popup_application) {
      setAppList(adsData.data.popup_application.apps || []);
      setPopupImages(adsData.data?.index_popup || []);
    }

    // Update notice list when notice data is available
    if (noticeData?.data) {
      setNoticeList(noticeData.data);
    }
  }, [adsData, noticeData]);

  return { popupImages, appList, noticeList };
};
