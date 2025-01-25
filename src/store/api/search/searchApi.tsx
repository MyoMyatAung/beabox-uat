/* eslint-disable @typescript-eslint/no-explicit-any */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const searchApi = createApi({
  reducerPath: "searchApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      headers.set("Accept-Language", "cn");
    },
  }),
  endpoints: (builder) => ({
    getTabList: builder.query<any, string>({
      query: () => ({
        url: `/post/tab-list`,
        method: "GET",
      }),
    }),
    postSearch: builder.mutation<any, any>({
      query: ({ search, tab, page }: any) => ({
        url: `/posts/search?search=${search}&tab=${tab}&page=${page}`,
        method: "POST",
      }),
    }),
    getSuggestions: builder.query<any, string>({
      query: (query: any) => ({
        url: `/post-suggestions?search=${query}`,
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
