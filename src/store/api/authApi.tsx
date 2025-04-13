import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { decryptWithAes } from "@/lib/decrypt";
import { convertToSecurePayload, convertToSecureUrl } from "@/lib/encrypt";
import { getDeviceInfo } from "@/lib/deviceInfo";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    // baseUrl: "http://107.148.47.94:8800/api/v1",
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as any;
      const accessToken = state.persist?.user?.token;
      const deviceInfo = getDeviceInfo();

      headers.set("encrypt", "true");
      headers.set("Accept-Language", "cn");
      headers.set("X-Client-Version", "2001");
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
        localStorage.setItem("auth-error", encryptedData?.message);
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
    getCaptcha: builder.mutation<any, string>({
      query: (arg: any) => convertToSecureUrl(`/captcha`),
    }),
    register: builder.mutation<any, string>({
      query: ({
        username,
        password,
        captcha,
        captcha_key,
        referral_code,
      }: any) => ({
        url: "/register",
        method: "POST",
        body: convertToSecurePayload({
          username,
          password,
          captcha,
          captcha_key,
          referral_code,
        }),
      }),
    }),
    login: builder.mutation<any, string>({
      query: ({ username, password, captcha, captcha_key }: any) => ({
        url: "/login",
        method: "POST",
        body: convertToSecurePayload({
          username,
          password,
          captcha,
          captcha_key,
        }),
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
        body: convertToSecurePayload({ security_question, answer }),
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
