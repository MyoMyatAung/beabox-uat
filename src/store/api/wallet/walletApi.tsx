import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";
import { decryptWithAes } from "@/lib/decrypt";
import { convertToSecurePayload, convertToSecureUrl } from "@/lib/encrypt";
import { getDeviceInfo } from "@/lib/deviceInfo";

export const walletApi = createApi({
  reducerPath: "walletApi",
  // baseQuery: fetchBaseQuery({ baseUrl: "https://77eewm.qdhgtch.com/api/v1" }),
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState)?.persist?.user?.token; // Adjust 'auth.token' to match your Redux slice structure
      const deviceInfo = getDeviceInfo();

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Accept-Language", "cn");
      headers.set("X-Client-Version", "2002");
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
    getInvite: builder.query<any, string>({
      query: () => ({
        url: convertToSecureUrl(`/config/data`),
        method: "GET",
      }),
    }),
    getTransitionHistory: builder.query<any, any>({
      query: ({ period, type, page }) => ({
        url: convertToSecureUrl(
          `/wallet/transaction-history?period=${period}&type=${type}&page=${page}`
        ),
        method: "GET",
      }),
    }),
    getCoinList: builder.query<any, any>({
      query: () => ({
        url: convertToSecureUrl("/wallet/coin-list"),
        method: "GET",
      }),
    }),
    getPaymentMethod: builder.query<any, any>({
      query: () => ({
        url: convertToSecureUrl("/wallet/payment-methods"),
        method: "GET",
      }),
    }),
    postWalletWithdrawl: builder.mutation<any, any>({
      query: ({ formData }) => ({
        url: convertToSecureUrl("/wallet/withdrawl"),
        method: "POST",
        body: formData,
      }),
    }),
    postWalletRecharge: builder.mutation<any, any>({
      query: ({ formData }) => ({
        url: convertToSecureUrl("/wallet/purchase"),
        method: "POST",
        body: convertToSecurePayload(formData),
      }),
    }),
    WallUploadImage: builder.mutation<
      { url: string },
      { filePath: string; file: string }
    >({
      query: (body) => ({
        url: convertToSecureUrl("/storage/upload"),
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetInviteQuery,
  useGetTransitionHistoryQuery,
  useGetCoinListQuery,
  useGetPaymentMethodQuery,
  usePostWalletWithdrawlMutation,
  usePostWalletRechargeMutation,
  useWallUploadImageMutation
} = walletApi;
