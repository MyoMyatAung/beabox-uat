import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://107.148.47.94:8800/api/v1",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).persist?.user?.token; // Adjust 'auth.token' to match your Redux slice structure
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getCaptcha: builder.mutation<any, string>({
      query: (arg: any) => `/captcha`,
    }),
    register: builder.mutation<any, string>({
      query: ({ username, password, captcha, captcha_key }: any) => ({
        url: "/register",
        method: "POST",
        body: { username, password, captcha, captcha_key },
      }),
    }),
    login: builder.mutation<any, string>({
      query: ({ username, password }: any) => ({
        url: "/login",
        method: "POST",
        body: { username, password },
      }),
    }),
  }),
});

export const { useGetCaptchaMutation, useRegisterMutation, useLoginMutation } =
  authApi;
