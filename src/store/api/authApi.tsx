import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    // baseUrl: "http://107.148.47.94:8800/api/v1",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).persist?.user?.token;
      // const rtoken = (getState() as RootState).persist?.registerUser?.token;
      // Adjust 'auth.token' to match your Redux slice structure
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
      query: ({ username, password, captcha, captcha_key }: any) => ({
        url: "/login",
        method: "POST",
        body: { username, password, captcha, captcha_key },
      }),
    }),
    storeSecurityQues: builder.mutation<any, string>({
      query: ({ security_question, answer, rtoken }: any) => ({
        url: "/security-question/store",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${rtoken}`,
        },
        body: { security_question, answer },
      }),
    }),
  }),
});

export const {
  useGetCaptchaMutation,
  useRegisterMutation,
  useLoginMutation,
  useStoreSecurityQuesMutation,
} = authApi;
