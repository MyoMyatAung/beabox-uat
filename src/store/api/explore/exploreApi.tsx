/* eslint-disable @typescript-eslint/no-explicit-any */
import { decryptWithAes } from "@/lib/decrypt";
import { convertToSecureUrl } from "@/lib/encrypt";
import { getDeviceInfo } from "@/lib/deviceInfo";
import { RootState } from "@/store/store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const exploreApi = createApi({
  reducerPath: "exploreApi",
  // baseQuery: fetchBaseQuery({ baseUrl: "https://77eewm.qdhgtch.com/api/v1" }),
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).persist?.user?.token; // Adjust 'auth.token' to match your Redux slice structure
      const deviceInfo = getDeviceInfo();
      
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Accept-Language", "cn");
      headers.set("X-Client-Version", "2001");
      headers.set("Device-Id", deviceInfo.uuid);
      headers.set("User-Agent", deviceInfo.osVersion);
      headers.set("encrypt", "true");

      return headers;
    },
    responseHandler: async (response) => {
      const encryptedData = await response.json(); // Get the encrypted response as a string

      try {
        const decryptedData = decryptWithAes(encryptedData?.data); // Decrypt the response data
        return JSON.parse(decryptedData); // Parse the decrypted data into JSON format
      } catch (err) {
        console.error("Error decrypting response:", err);
        throw new Error("Failed to decrypt response.");
      }
    },
  }),
  endpoints: (builder) => ({
    // getExploreHeader: builder.query<any, string>({
    //   query: () => ({
    //     url: `/explore/header`,
    //     method: "GET",
    //   }),
    // }),
    getExploreHeader: builder.query({
      query: () => convertToSecureUrl(`explore/header`),
      // query: () => `explore/header`,
    }),
    getAdsPopUp: builder.query<any, string>({
      query: () => ({
        url: convertToSecureUrl(`/app/ads`),
        // url: "app/ads",
        method: "GET",
      }),
    }),
    getAdsNotice: builder.query<any, string>({
      query: () => ({
        url: convertToSecureUrl(`/notice/list`),
        // url: "/notice/list",
        method: "GET",
      }),
    }),
    getExploreTag: builder.query<any, any>({
      query: ({ order, tag, page }) => ({
        url: convertToSecureUrl(
          `/post/search/tag?tag=${tag}&order=${order}&pageSize=10&page=${page}`
        ),
        // url: `/post/search/tag?tag=${tag}&order=${order}&pageSize=10&page=${page}`,
        method: "GET",
      }),
    }),
    getApplicationAds: builder.query<any, string>({
      query: () => ({
        url: convertToSecureUrl(`/application/ads`),
        method: "GET",
      }),
    }),
    // getExploreList: builder.query<any, any>({
    //   query: ({ id, page }) => ({
    //     url: `explore/list?id=${id}&page=${page}`,
    //     method: "GET",
    //   }),
    // }),
    getExploreList: builder.query<any, any>({
      query: ({ id, page }) =>
        convertToSecureUrl(`explore/list?id=${id}&page=${page}`),
      // `explore/list?id=${id}&page=${page}`,
    }),
  }),
});

export const {
  useGetExploreHeaderQuery,
  useGetExploreTagQuery,
  useGetApplicationAdsQuery,
  useGetExploreListQuery,
  useGetAdsPopUpQuery,
  useGetAdsNoticeQuery,
} = exploreApi;
