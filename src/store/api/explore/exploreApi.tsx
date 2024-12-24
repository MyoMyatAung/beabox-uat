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
    getExploreTag: builder.query<any, string>({
      query: () => ({
        url: `/post/search/tag?tag=Chinese Drama&order=popular&pageSize=10`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetExploreHeaderQuery, useGetExploreTagQuery } = exploreApi;
