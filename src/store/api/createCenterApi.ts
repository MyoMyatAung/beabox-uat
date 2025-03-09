import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { convertToSecurePayload, convertToSecureUrl } from "@/lib/encrypt";
import { decryptWithAes } from "@/lib/decrypt";

export const createCenterApi = createApi({
  reducerPath: "createCenterApi",
  // baseQuery: fetchBaseQuery({ baseUrl: "https://77eewm.qdhgtch.com/api/v1" }),
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as any;
      const accessToken = state.persist?.user?.token;
      headers.set("encrypt", "true");
      headers.set("Accept-Language", "cn");
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
    getTopCreator: builder.query({
      query: () =>
        convertToSecureUrl(`/top/creator/dashboard?ranking=follower`),
    }),
    getMyPostStatusCount: builder.query({
      query: () => convertToSecureUrl(`/my/post/status/count`),
    }),
    getPostList: builder.query({
      query: () =>
        convertToSecureUrl(`/creator/post/list?pageSize=10&status=all&page=1`),
    }),
    getMyOwnProfile: builder.query({
      query: () => convertToSecureUrl(`/profile/get-own-profile`),
    }),
    getRecyclePosts: builder.query({
      query: () =>
        convertToSecureUrl(`/creator/recycle/post/list?page=1&pageSize=10`),
    }),
  }),
});

export const {
  useGetTopCreatorQuery,
  useGetMyPostStatusCountQuery,
  useGetPostListQuery,
  useGetMyOwnProfileQuery,
  useGetRecyclePostsQuery,
} = createCenterApi;
