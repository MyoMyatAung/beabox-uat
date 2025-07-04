// components/ApplicationPreloader.tsx
import { useGetApplicationAdsQuery } from "@/store/api/explore/exploreApi";
import useImagePreloader from "./useImagePreloader";

const ApplicationPreloader = () => {
  // Get application data
  const { data: application } = useGetApplicationAdsQuery("");
  const applicationData = application?.data;
  console.log(applicationData);

  // Extract all image URLs from application data
  const allImageUrls = applicationData
    ? [
        ...(applicationData.carousel?.map((item: any) => item.image) || []),
        ...(applicationData.header?.map((item: any) => item.image) || []),
        ...(applicationData.footer?.map((item: any) => item.image) || []),
        ...(applicationData.application?.flatMap(
          (section: any) => section.apps?.map((app: any) => app.image) || []
        ) || []),
      ]
    : [];

  useImagePreloader(allImageUrls);

  return null;
};

export default ApplicationPreloader;
