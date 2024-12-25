/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const exploreApi = createApi({
  reducerPath: "exploreApi",
  // baseQuery: fetchBaseQuery({ baseUrl: "http://107.148.47.94:8800/api/v1" }),
  baseQuery: fetchBaseQuery({
    baseUrl: "http://107.148.47.94:8800/api/v1",
  }),
  endpoints: (builder) => ({
    getExploreHeader: builder.query<any, string>({
      query: () => ({
        url: `/explore/header`,
        method: "GET",
      }),
    }),
    getExploreTag: builder.query<any, any>({
      query: ({ order, tag }) => ({
        url: `/post/search/tag?tag=${tag}&order=${order}&pageSize=10`,
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
      query: ({ id }) => ({
        url: `explore/list?id=${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetExploreHeaderQuery,
  useGetExploreTagQuery,
  useGetApplicationAdsQuery,
  useGetExploreListQuery
} = exploreApi;
