import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

export const profileApi = createApi({
  reducerPath: "profileApi",
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
    getMyProfile: builder.query<any, string>({
      query: () => ({
        url: `/profile/me`,
        method: "GET",
      }),
    }),
    changeUsername: builder.mutation({
      query: ({ username }) => ({
        url: `/profile/change-username`,
        method: "POST",
        body: {
          username,
        },
      }),
    }),
    changeGender: builder.mutation({
      query: ({ gender }) => ({
        url: `/profile/change-gender`,
        method: "POST",
        body: {
          gender,
        },
      }),
    }),
    changeBio: builder.mutation({
      query: ({ bio }) => ({
        url: `/profile/save-bio`,
        method: "POST",
        body: {
          bio,
        },
      }),
    }),
    changeReferralCode: builder.mutation({
      query: ({ referral_code }) => ({
        url: `/profile/save-referral-code`,
        method: "POST",
        body: {
          referral_code,
        },
      }),
    }),
  }),
});

export const {
  useGetMyProfileQuery,
  useChangeUsernameMutation,
  useChangeGenderMutation,
  useChangeBioMutation,
  useChangeReferralCodeMutation,
} = profileApi;
