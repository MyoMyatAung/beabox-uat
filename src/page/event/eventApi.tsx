import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { convertToSecurePayload, convertToSecureUrl } from "@/lib/encrypt";
import { decryptWithAes } from "@/lib/decrypt";
import { getDeviceInfo } from "@/lib/deviceInfo";

export const eventApi = createApi({
  reducerPath: "profileApi",
  // baseQuery: fetchBaseQuery({ baseUrl: "https://77eewm.qdhgtch.com/api/v1" }),
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as any;
      const accessToken = state.persist?.user?.token;
      const deviceInfo = getDeviceInfo();

      headers.set("encrypt", "true");
      headers.set("Accept-Language", "cn");
      headers.set("X-Client-Version", "2001");
      headers.set("Device-Id", deviceInfo.uuid);
      headers.set("User-Agent", deviceInfo.osVersion);
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
      return headers;
    },
    responseHandler: async (response) => {
      const encryptedData = await response.json();
      if (encryptedData?.status === false)
        localStorage.setItem("profile-error", encryptedData?.message);
      try {
        const decryptedData = decryptWithAes(encryptedData?.data);
        return JSON.parse(decryptedData);
      } catch (err) {
        console.error("Error decrypting response:", err);
        throw new Error("Failed to decrypt response.");
      }
    },
  }),
  endpoints: (builder) => ({
    getUserByReferal: builder.query<any, any>({
      query: ({ referral_code }) => ({
        url: convertToSecureUrl(
          `/user/by-referral?referral_code=${referral_code}`
        ),
        method: "GET",
      }),
    }),
  }),
});

export const { useGetUserByReferalQuery } = eventApi;
