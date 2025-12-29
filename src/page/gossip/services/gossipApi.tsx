import { decryptWithAes } from "@/lib/decrypt";
import { convertToSecureUrl } from "@/lib/encrypt";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getDeviceInfo } from "@/lib/deviceInfo";

export const gossipApi = createApi({
  reducerPath: "gossipApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as any;
      const accessToken = state.persist?.user?.token;
      const deviceInfo = getDeviceInfo();

      headers.set("encrypt", "true");
      headers.set("Accept-Language", "cn");
      headers.set("X-Client-Version", "2002");
      headers.set("Device-Id", deviceInfo.uuid);
      headers.set("User-Agent", deviceInfo.osVersion);

      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
      return headers;
    },
    responseHandler: async (response) => {
      if (response.status === 401) {
        const persistRoot = localStorage.getItem("persist:root");

        if (persistRoot) {
          const persistData = JSON.parse(persistRoot);
          const persistUserData = JSON.parse(persistData.persist);

          if (persistUserData.user && persistUserData.user.token) {
            persistUserData.user.token = null;
          }

          persistData.persist = JSON.stringify(persistUserData);
          localStorage.setItem("persist:root", JSON.stringify(persistData));
        }

        return Promise.reject("Unauthorized - Token Expired");
      }

      const encryptedData = await response.json();

      try {
        const decryptedData = decryptWithAes(encryptedData?.data);
        return JSON.parse(decryptedData);
      } catch (err) {
        console.error("Error decrypting response:", err);
        throw new Error("Failed to decrypt response.");
      }
    },
  }),
  tagTypes: ["gossip"],
  endpoints: (builder) => ({
    getGossipPosts: builder.query({
      query: ({ page, filter }) =>
        convertToSecureUrl(
          `posts/gossip?pageSize=10&page=${page}&filter=${filter}`
        ),
      providesTags: ["gossip"],
    }),
  }),
});

export const { useGetGossipPostsQuery } = gossipApi;
