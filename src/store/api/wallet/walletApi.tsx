import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";

export const walletApi = createApi({
  reducerPath: "walletApi",
  // baseQuery: fetchBaseQuery({ baseUrl: "http://107.148.47.94:8800/api/v1" }),
  baseQuery: fetchBaseQuery({
    baseUrl: "http://107.148.47.94:8800/api/v1",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).persist.user.token; // Adjust 'auth.token' to match your Redux slice structure
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getInvite: builder.query<any, string>({
      query: () => ({
        url: `/config/data`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetInviteQuery } = walletApi;
