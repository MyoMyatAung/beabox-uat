/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { decryptWithAes } from "@/lib/decrypt";
import { convertToSecureUrl } from "@/lib/encrypt";
import { getDeviceInfo } from "@/lib/deviceInfo";
import axios from "axios";

// Create an instance of Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Base URL for your API
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAdsData = async () => {
  const deviceInfo = getDeviceInfo();
  
  try {
    const response: any = await api.get(convertToSecureUrl("/app/ads"), {
      headers: {
        "X-Client-Version": 2001,
        "Accept-Language": "cn",
        "Device-Id": deviceInfo.uuid,
        "User-Agent": deviceInfo.osVersion,
        encrypt: "true",
      },
    });

    try {
      const decryptedData = decryptWithAes(response?.data?.data); // Decrypt the response data
      return JSON.parse(decryptedData); // Parse the decrypted data into JSON format
    } catch (err) {
      console.error("Error decrypting response:", err);
      throw new Error("Failed to decrypt response.");
    }
  } catch (error) {
    console.error("Error fetching ads data:", error);
    throw error;
  }
};

export const useGetAdsPopUpQuery = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchAdsPopupData = async (forceRefresh = false) => {
    try {
      const cachedData = localStorage.getItem("adsPopup");

      // **Step 1: Serve Cached Data Immediately**
      if (cachedData && !forceRefresh) {
        setData(JSON.parse(cachedData));
        setIsLoading(false);
        await new Promise((resolve) => setTimeout(resolve, 5000)); // 5000ms = 5 seconds
      }
      // **Step 2: Fetch Fresh Data in the Background**
      const response = await getAdsData();
      const newData = response.data ? response : await decryptWithAes(response);

      // **Step 3: Update Cache & UI**
      localStorage.setItem("adsPopup", JSON.stringify(newData));
      setData(newData);
    } catch (err) {
      console.error("Failed to fetch header topics:", err);
      setError(err);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchAdsPopupData();
  }, []);

  return {
    data,
    isLoading,
    error,
    isFetching,
    refetch: () => fetchAdsPopupData(true), // Force refresh when refetching
  };
};
