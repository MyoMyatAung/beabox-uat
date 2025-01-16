/* eslint-disable @typescript-eslint/no-explicit-any */
import { RootState } from "@/store/store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const exploreApi = createApi({
  reducerPath: "exploreApi",
  // baseQuery: fetchBaseQuery({ baseUrl: "https://77eewm.qdhgtch.com/api/v1" }),
  baseQuery: fetchBaseQuery({
    baseUrl: "https://77eewm.qdhgtch.com/api/v1",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).persist?.user?.token; // Adjust 'auth.token' to match your Redux slice structure
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getExploreHeader: builder.query<any, string>({
      query: () => ({
        url: `/explore/header`,
        method: "GET",
      }),
    }),
    getExploreTag: builder.query<any, any>({
      query: ({ order, tag ,page }) => ({
        url: `/post/search/tag?tag=${tag}&order=${order}&pageSize=10&page=${page}`,
        method: "GET",
      }),
    }),
    getApplicationAds: builder.query<any, string>({
      query: () => ({
        url: `/application/ads`,
        method: "GET",
      }),
    }),
    getExploreList: builder.query<any, any>({
      query: ({ id , page }) => ({
        url: `explore/list?id=${id}&page=${page}`,
        method: "GET",
      }),
    }),
    postCommentExp: builder.mutation<
    void,
    { post_id: any; content: any; comment_id?: any; reply_id?: any }
  >({
    query: ({ post_id, content, comment_id, reply_id }) => {

      const body: {
        post_id: any;
        content: any;
        comment_id?: any;
        reply_id?: any;
      } = {
        post_id,
        content,
      };

      if (comment_id != null) {
        body.comment_id = comment_id;
      }
      if (reply_id != null) {
        body.reply_id = reply_id;
      }
      return {
        url: `/post/comment`,
        method: "POST",
        body, 
      };
    },
  }),
  }),
});

export const {
  useGetExploreHeaderQuery,
  useGetExploreTagQuery,
  useGetApplicationAdsQuery,
  useGetExploreListQuery,
  usePostCommentExpMutation
} = exploreApi;
