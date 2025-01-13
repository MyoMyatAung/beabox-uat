import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

export const profileApi = createApi({
  reducerPath: "profileApi",
  // baseQuery: fetchBaseQuery({ baseUrl: "https://77eewm.qdhgtch.com/api/v1" }),
  baseQuery: fetchBaseQuery({
    baseUrl: "https://77eewm.qdhgtch.com/api/v1",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).persist?.user?.token;
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
    getRegion: builder.query<any, string>({
      // query: () => `/pcities-and-provinces`,
      query: () => ({
        url: `/cities-and-provinces`,
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
    changeNickname: builder.mutation({
      query: ({ nickname }) => ({
        url: `/profile/change-nickname`,
        method: "POST",
        body: {
          nickname,
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
    uploadProfilePic: builder.mutation({
      query: ({ file_url }) => ({
        url: `/profile/upload`,
        method: "POST",
        body: {
          file_url,
        },
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `/profile/logout`,
      }),
    }),
    changePassword: builder.mutation({
      query: ({ current_password, new_password }) => ({
        url: `/profile/change-password`,
        method: "POST",
        body: {
          current_password,
          new_password,
        },
      }),
    }),
    changePrivateProfileStats: builder.mutation({
      query: ({ status }) => ({
        url: `/profile/private-profile-status`,
        method: "POST",
        body: {
          status,
        },
      }),
    }),
    changeVisibility: builder.mutation({
      query: ({ status }) => ({
        url: `/profile/liked-video-visibility`,
        method: "POST",
        body: {
          status,
        },
      }),
    }),
    changeRegion: builder.mutation({
      query: (region) => ({
        url: `/profile/change-region`,
        method: "POST",
        body: region,
      }),
    }),
    getLikedPost: builder.query<any, string>({
      query: (user_id) => ({
        url: `/user/liked-post?user_id=${user_id}`,
        method: "GET",
      }),
    }),
    getSecurityQuestions: builder.mutation<any, string>({
      query: () => ({
        url: `/get-security-question`,
        method: "Post",
      }),
    }),
    getFollowerList: builder.query<any, string>({
      query: (user_id) => ({
        url: `/follower/follower-list?user_id=${user_id}`,
        method: "GET",
      }),
    }),
    getFollowingList: builder.query<any, string>({
      query: (user_id) => ({
        url: `/follower/following-list?user_id=${user_id}`,
        method: "GET",
      }),
    }),
    changeFollowStatus: builder.mutation<any, string>({
      query: ({ follow_user_id, status }: any) => ({
        url: `/follower/change-follow-status`,
        method: "Post",
        body: { follow_user_id, status },
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
  useUploadProfilePicMutation,
  useLogoutMutation,
  useChangePasswordMutation,
  useChangePrivateProfileStatsMutation,
  useChangeVisibilityMutation,
  useGetRegionQuery,
  useChangeRegionMutation,
  useChangeNicknameMutation,
  useGetLikedPostQuery,
  useGetSecurityQuestionsMutation,
  useGetFollowerListQuery,
  useGetFollowingListQuery,
  useChangeFollowStatusMutation,
} = profileApi;
