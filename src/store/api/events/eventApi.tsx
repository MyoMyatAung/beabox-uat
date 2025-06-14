import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";
import { decryptWithAes } from "@/lib/decrypt";
import { convertToSecureUrl } from "@/lib/encrypt";
import { getDeviceInfo } from "@/lib/deviceInfo";

export const eventApi = createApi({
  reducerPath: "eventApi",
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
    getCurrentEvent: builder.query<any, string>({
      query: () => ({
        url: convertToSecureUrl(`/events/current`),
        method: "GET",
      }),
    }),
    getEventDetails: builder.query<any, any>({
      query: (id) => convertToSecureUrl(`/events/detail?event_id=${id}`),
    }),
    getUserShareInfo: builder.query<any, any>({
      query: () => convertToSecureUrl(`/user/share/info`),
    }),
  }),
});

export const {
  useGetCurrentEventQuery,
  useLazyGetEventDetailsQuery,
  useGetUserShareInfoQuery,
  // useLazyGetUserShareInfoQuery
} = eventApi;
