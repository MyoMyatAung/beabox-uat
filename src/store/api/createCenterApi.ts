import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { convertToSecurePayload, convertToSecureUrl } from "@/lib/encrypt";
import { decryptWithAes } from "@/lib/decrypt";
import { getDeviceInfo } from "@/lib/deviceInfo";

export const createCenterApi = createApi({
  reducerPath: "createCenterApi",
  // baseQuery: fetchBaseQuery({ baseUrl: "https://77eewm.qdhgtch.com/api/v1" }),
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
      query: ({ tag, page, type }) =>
        convertToSecureUrl(
          `/top/creator/dashboard?ranking=${tag}&page=${page}&type=${type}`
        ),
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
      query: (page) =>
        convertToSecureUrl(
          `/creator/recycle/post/list?page=${page}&pageSize=10`
        ),
    }),
    restorePost: builder.mutation({
      query: ({ id, type }: any) => ({
        url: convertToSecureUrl("/creator/restore/post"),
        method: "POST",
        body: convertToSecurePayload({
          post_id: id,
          type: type,
        }),
      }),
    }),
    deletePost: builder.mutation({
      query: ({ id }: any) => ({
        url: convertToSecureUrl("/post/delete"),
        method: "POST",
        body: convertToSecurePayload({
          post_id: id,
        }),
      }),
    }),
    moveToRecycle: builder.mutation({
      query: ({ id }: any) => ({
        url: convertToSecureUrl(`/creator/make/post/recycle?post_id=${id}`),
        method: "GET",
      }),
    }),
    createPosts: builder.mutation({
      query: ({
        update_id,
        title,
        tags,
        description,
        privacy,
        cover_url,
        files,
      }) => {
        // Create the payload
        const payload: any = {
          title,
          tags,
          description,
          privacy,
          cover_url,
          files,
        };

        // Conditionally add update_id if it's provided
        if (update_id) {
          payload.update_id = update_id;
        }

        // Return the query with the modified payload
        return {
          url: `/post/create`,
          method: "POST",
          body: convertToSecurePayload(payload),
        };
      },
    }),
    getPosts: builder.query({
      query: ({ page, status }) =>
        convertToSecureUrl(
          `/creator/post/list?pageSize=10&status=${status}&page=${page}`
        ),
    }),
    getConfig: builder.query({
      query: () => convertToSecureUrl(`/config/data`),
    }),
    getS3: builder.query({
      query: () => convertToSecureUrl(`/s3/signed-url`),
    }),
    getAds: builder.query({
      query: () => convertToSecureUrl(`/app/ads`),
    }),
    getAvatarList: builder.query({
      query: () => convertToSecureUrl(`/avatar/list`),
    }),
    getCoverList: builder.query({
      query: () => convertToSecureUrl(`/cover-photo/list`),
    }),
    getTopList: builder.query({
      query: () => convertToSecureUrl(`/top/account/list`),
    }),
  }),
});

export const {
  useGetTopListQuery,
  useGetCoverListQuery,
  useGetAvatarListQuery,
  useGetAdsQuery,
  useGetS3Query,
  useGetConfigQuery,
  useGetPostsQuery,
  useCreatePostsMutation,
  useGetTopCreatorQuery,
  useGetMyPostStatusCountQuery,
  useGetPostListQuery,
  useGetMyOwnProfileQuery,
  useGetRecyclePostsQuery,
  useRestorePostMutation,
  useDeletePostMutation,
  useMoveToRecycleMutation,
} = createCenterApi;
