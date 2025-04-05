/* eslint-disable @typescript-eslint/no-explicit-any */

import { decryptWithAes } from "@/lib/decrypt";
import { convertToSecureUrl } from "@/lib/encrypt";
import { getDeviceInfo } from "@/lib/deviceInfo";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const searchApi = createApi({
  reducerPath: "searchApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      const deviceInfo = getDeviceInfo();
      
      headers.set("Accept-Language", "cn");
      headers.set("encrypt", "true");
      headers.set("X-Client-Version", "2001");
      headers.set("Device-Id", deviceInfo.uuid);
      headers.set("User-Agent", deviceInfo.osVersion);
      
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
    getTabList: builder.query<any, string>({
      query: () => ({
        url: convertToSecureUrl(`/post/tab-list`),
        method: "GET",
      }),
    }),
    postSearch: builder.mutation<any, any>({
      query: ({ search, tab, page }: any) => ({
        url: convertToSecureUrl(
          `/posts/search?search=${search}&tab=${tab}&page=${page}`
        ),
        method: "POST",
      }),
    }),
    getSuggestions: builder.query<any, any>({
      query: ({ query, page }: any) => ({
        url: convertToSecureUrl(
          `/post-suggestions?search=${query}&page=${page}`
        ),
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetTabListQuery,
  usePostSearchMutation,
  useGetSuggestionsQuery,
  useLazyGetSuggestionsQuery,
} = searchApi;
// post-suggestions?search=a

// // /* eslint-disable @typescript-eslint/no-explicit-any */

// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export const searchApi = createApi({
//   reducerPath: "searchApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: import.meta.env.VITE_API_URL,
//     prepareHeaders: (headers) => {
//       headers.set("Accept-Language", "cn");
//     },
//   }),
//   endpoints: (builder) => ({
//     getTabList: builder.query<any, string>({
//       query: () => ({
//         url: `/post/tab-list`,
//         method: "GET",
//       }),
//     }),
//     postSearch: builder.mutation<any, any>({
//       query: ({ search, tab, page }: any) => ({
//         url: `/posts/search?search=${search}&tab=${tab}&page=${page}`,
//         method: "POST",
//       }),
//     }),
//     getSuggestions: builder.query<any, string>({
//       query: (query: any) => ({
//         url: `/post-suggestions?search=${query}`,
//         method: "GET",
//       }),
//     }),
//   }),
// });

// export const {
//   useGetTabListQuery,
//   usePostSearchMutation,
//   useGetSuggestionsQuery,
//   useLazyGetSuggestionsQuery,
// } = searchApi;
// // post-suggestions?search=a
