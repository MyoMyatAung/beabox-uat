import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";

export const walletApi = createApi({
  reducerPath: "walletApi",
  // baseQuery: fetchBaseQuery({ baseUrl: "https://77eewm.qdhgtch.com/api/v1" }),
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState)?.persist?.user?.token; // Adjust 'auth.token' to match your Redux slice structure
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
    getTransitionHistory: builder.query<any, any>({
      query: ({ period, type }) => ({
        url: `/wallet/transaction-history?period=${period}&type=${type}`,
        method: "GET",
      }),
    }),
    getCoinList: builder.query<any, any>({
      query: () => ({
        url: "/wallet/coin-list",
        method: "GET",
      }),
    }),
    getPaymentMethod: builder.query<any, any>({
      query: () => ({
        url: "/wallet/payment-methods",
        method: "GET",
      }),
    }),
    postWalletWithdrawl: builder.mutation<any, any>({
      query: ({ formData }) => ({
        url: "/wallet/withdrawl",
        method: "POST",
        body: formData,
      }),
    }),
    postWalletRecharge: builder.mutation<any, any>({
      query: ({ formData }) => ({
        url: "/wallet/buy",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetInviteQuery,
  useGetTransitionHistoryQuery,
  useGetCoinListQuery,
  useGetPaymentMethodQuery,
  usePostWalletWithdrawlMutation,
  usePostWalletRechargeMutation
} = walletApi;
