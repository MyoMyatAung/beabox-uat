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
  }),
});

export const { useGetExploreHeaderQuery } = exploreApi;
