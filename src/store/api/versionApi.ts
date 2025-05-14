import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { decryptWithAes } from "@/lib/decrypt";
import { convertToSecureUrl } from "@/lib/encrypt";

export const versionApi = createApi({
  reducerPath: "versionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      headers.set('accept-language', 'cn');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    checkAppVersion: builder.query({
      query: ({ platform, version }) => {
        return {
          url: convertToSecureUrl(`/app/update/version?platform=${platform}&version=${version}`),
          method: "GET",
        };
      },
      transformResponse: (encryptedData: { data?: string }) => {
        try {
          if (encryptedData && encryptedData.data) {
            const decryptedData = decryptWithAes(encryptedData.data);
            return JSON.parse(decryptedData);
          }
          // If the response is not encrypted, return it as is
          return encryptedData;
        } catch (err) {
          console.error("Error decrypting response:", err);
          throw new Error("Failed to decrypt response.");
        }
      },
    }),
  }),
});

export const { useCheckAppVersionQuery } = versionApi; 