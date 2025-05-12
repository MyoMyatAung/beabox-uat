import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { convertToSecurePayload, convertToSecureUrl } from "@/lib/encrypt";
import { decryptWithAes } from "@/lib/decrypt";
import { getDeviceInfo } from "@/lib/deviceInfo";

export const profileApi = createApi({
  reducerPath: "profileApi",
  // baseQuery: fetchBaseQuery({ baseUrl: "https://77eewm.qdhgtch.com/api/v1" }),
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
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
      console.log(encryptedData, "encryptedData");
      if (encryptedData?.status === false)
        localStorage.setItem("profile-error", encryptedData?.message);
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
    getMyProfile: builder.query<any, string>({
      query: () => ({
        url: convertToSecureUrl(`/profile/me`),
        method: "GET",
      }),
    }),
    getMyOwnProfile: builder.query<any, string>({
      query: () => ({
        url: convertToSecureUrl(`/profile/get-own-profile`),
        method: "GET",
      }),
    }),
    getUserProfile: builder.query<any, string>({
      query: (id) => ({
        url: convertToSecureUrl(`/profile/get-profile?user_id=${id}`),
        method: "GET",
      }),
    }),
    getRegion: builder.query<any, string>({
      // query: () => `/pcities-and-provinces`,
      query: () => ({
        url: convertToSecureUrl(`/cities-and-provinces`),
        method: "GET",
      }),
    }),
    changeUsername: builder.mutation({
      query: ({ username }) => ({
        url: convertToSecureUrl(`/profile/change-username`),
        method: "POST",
        body: convertToSecurePayload({
          username,
        }),
      }),
    }),
    changeNickname: builder.mutation({
      query: ({ nickname }) => ({
        url: convertToSecureUrl(`/profile/change-nickname`),
        method: "POST",
        body: convertToSecurePayload({
          nickname,
        }),
      }),
    }),
    changeGender: builder.mutation({
      query: ({ gender }) => ({
        url: convertToSecureUrl(`/profile/change-gender`),
        method: "POST",
        body: convertToSecurePayload({
          gender,
        }),
      }),
    }),
    changeBio: builder.mutation({
      query: ({ bio }) => ({
        url: convertToSecureUrl(`/profile/save-bio`),
        method: "POST",
        body: convertToSecurePayload({
          bio,
        }),
      }),
    }),
    changeReferralCode: builder.mutation({
      query: ({ referral_code }) => ({
        url: convertToSecureUrl(`/profile/save-referral-code`),
        method: "POST",
        body: convertToSecurePayload({
          referral_code,
        }),
      }),
    }),
    uploadProfilePic: builder.mutation({
      query: ({ file_url }) => ({
        url: convertToSecureUrl(`/profile/upload`),
        method: "POST",
        body: convertToSecurePayload({
          file_url,
        }),
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: convertToSecureUrl(`/profile/logout`),
        method: "POST",
      }),
    }),
    changePassword: builder.mutation({
      query: ({ current_password, new_password }) => ({
        url: convertToSecureUrl(`/profile/change-password`),
        method: "POST",
        body: convertToSecurePayload({
          current_password,
          new_password,
        }),
      }),
    }),
    changePrivateProfileStats: builder.mutation({
      query: (status) => ({
        url: convertToSecureUrl(`/profile/private-profile-status`),
        method: "POST",
        body: convertToSecurePayload({
          status,
        }),
      }),
    }),
    changeVisibility: builder.mutation({
      query: ({ status }) => ({
        url: convertToSecureUrl(`/profile/liked-video-visibility`),
        method: "POST",
        body: convertToSecurePayload({
          status,
        }),
      }),
    }),
    changeCVis: builder.mutation({
      query: ({ status }) => ({
        url: convertToSecureUrl(`/profile/content-visibility`),
        method: "POST",
        body: convertToSecurePayload({
          status,
        }),
      }),
    }),
    changeRegion: builder.mutation({
      query: (region) => ({
        url: convertToSecureUrl(`/profile/change-region`),
        method: "POST",
        body: region,
      }),
    }),
    getLikedPost: builder.query<any, any>({
      query: ({ user_id, page }) => ({
        url: convertToSecureUrl(
          `/user/liked-post?user_id=${user_id}&page=${page}`
        ),
        method: "GET",
      }),
    }),
    getPosts: builder.query<any, any>({
      query: ({ id, page, sort }) => ({
        url: convertToSecureUrl(
          `/user/post?user_id=${id}&page=${page}&sort=${sort}`
        ),
        method: "GET",
      }),
    }),
    getMyPosts: builder.query<any, any>({
      query: ({ page }) => ({
        url: convertToSecureUrl(
          `/my/post/list?status=published&pageSize=12&page=${page}`
        ),
        method: "GET",
      }),
    }),
    getSecurityQuestions: builder.mutation<any, string>({
      query: () => ({
        url: convertToSecureUrl(`/get-security-question`),
        method: "Post",
      }),
    }),
    removeSecurityQuestion: builder.mutation<any, string>({
      query: () => ({
        url: convertToSecureUrl(`/profile/remove-security-question`),
        method: "Post",
      }),
    }),
    getFollowerList: builder.query<any, any>({
      query: ({ user_id, page }) => ({
        url: convertToSecureUrl(
          `/follower/follower-list?user_id=${user_id}&page=${page}`
        ),
        method: "GET",
      }),
    }),
    filterFollower: builder.query<any, any>({
      query: ({ user_id, search }) => ({
        url: convertToSecureUrl(
          `/follower/follower-list?user_id=${user_id}&search=${search}`
        ),
        method: "GET",
      }),
    }),
    getFollowingList: builder.query<any, any>({
      query: ({ user_id, page }) => ({
        url: convertToSecureUrl(
          `/follower/following-list?user_id=${user_id}&page=${page}`
        ),
        method: "GET",
      }),
    }),
    filterFollowing: builder.query<any, any>({
      query: ({ user_id, search }) => ({
        url: convertToSecureUrl(
          `/follower/following-list?user_id=${user_id}&search=${search}`
        ),
        method: "GET",
      }),
    }),
    changeFollowStatus: builder.mutation<any, any>({
      query: ({ follow_user_id, status }: any) => ({
        url: convertToSecureUrl(`/follower/change-follow-status`),
        method: "Post",
        body: convertToSecurePayload({ follow_user_id, status }),
      }),
    }),
    getNoti: builder.query<any, string>({
      query: (type) => ({
        url: convertToSecureUrl(
          `/notification/list?type=general&pageSize=10&page=1&type=${type}`
        ),
        method: "GET",
      }),
    }),
    settingUpload: builder.mutation<any, any>({
      query: ({ filedata, filePath }: any) => ({
        url: convertToSecureUrl(`/storage/upload`),
        method: "Post",
        body: { filePath, file: filedata },
      }),
    }),
    profileUpload: builder.mutation<any, any>({
      query: ({ file_url }: any) => ({
        url: convertToSecureUrl(`/profile/upload`),
        method: "Post",
        body: { file_url },
      }),
    }),
    avatarUpload: builder.mutation<any, any>({
      query: ({ id }: any) => ({
        url: convertToSecureUrl(`/avatar/upload`),
        method: "Post",
        body: { avatar_id: id },
      }),
    }),
    coverUpload: builder.mutation<any, any>({
      query: ({ id }: any) => ({
        url: convertToSecureUrl(`/cover-photo/upload`),
        method: "Post",
        body: { cover_photo_id: id },
      }),
    }),
    changeCover: builder.mutation<any, any>({
      query: ({ file_url }: any) => ({
        url: convertToSecureUrl(`/profile/change-cover-photo`),
        method: "Post",
        body: { file_url },
      }),
    }),
    removeCover: builder.mutation<any, any>({
      query: () => ({
        url: convertToSecureUrl(`/profile/remove-cover-photo`),
        method: "Post",
      }),
    }),
    getlikePostList: builder.query<any, any>({
      query: ({ id, page }) => ({
        url: convertToSecureUrl(`/user/liked-post?user_id=${id}&page=${page}`),
        method: "Get",
      }),
    }),
    checkUsername: builder.mutation<any, any>({
      query: ({ username, captcha, captcha_key }) => ({
        url: convertToSecureUrl(`/check-username`),
        method: "Post",
        body: convertToSecurePayload({
          username,
          captcha,
          captcha_key,
        }),
      }),
    }),

    checkAnswer: builder.mutation<any, any>({
      query: ({ token, answer }) => ({
        url: convertToSecureUrl(`/check-security-answer`),
        method: "Post",
        body: convertToSecurePayload({
          token,
          answer,
        }),
      }),
    }),
    checkSAnswer: builder.mutation<any, any>({
      query: ({ answer }) => ({
        url: convertToSecureUrl(`/profile/check-security-answer`),
        method: "Post",
        body: convertToSecurePayload({
          answer,
        }),
      }),
    }),
    setPassword: builder.mutation<any, any>({
      query: ({ token, password }) => ({
        url: convertToSecureUrl(`/set-password`),
        method: "Post",
        body: convertToSecurePayload({
          token,
          password,
        }),
      }),
    }),
    changeFollowReq: builder.mutation<any, any>({
      query: (status) => ({
        url: convertToSecureUrl(`/profile/disallow-follow-request`),
        method: "Post",
        body: convertToSecurePayload({
          status,
        }),
      }),
    }),
    changeHideBio: builder.mutation<any, any>({
      query: (status) => ({
        url: convertToSecureUrl(`/profile/hide-bio`),
        method: "Post",
        body: convertToSecurePayload({
          status,
        }),
      }),
    }),
    changeShareRegion: builder.mutation<any, any>({
      query: (status) => ({
        url: convertToSecureUrl(`/profile/share-region`),
        method: "Post",
        body: convertToSecurePayload({
          status,
        }),
      }),
    }),
    getConfig: builder.query<any, any>({
      query: (os) => ({
        url: convertToSecureUrl(`/app/version?platform=${os}`),
        method: "GET",
      }),
    }),
    getWatchHistory: builder.query<any, any>({
      query: ({ page }) => ({
        url: convertToSecureUrl(`/watch-history?pageSize=12&page=${page}`),
        method: "GET",
      }),
    }),
    userShareInfo: builder.query<any, any>({
      query: () => ({
        url: convertToSecureUrl(`/user/share/info`),
        method: "GET",
      }),
    }),
    shareInfo: builder.mutation({
      query: ({ id }) => ({
        url: convertToSecureUrl(`/profile/share/info?user_id=${id}`),
        method: "GET",
      }),
    }),
    postsSearch: builder.mutation({
      query: ({ page, search, user_id }) => ({
        url: convertToSecureUrl(`/posts/search`),
        method: "POST",
        body: convertToSecurePayload({
          page,
          pageSize: 12,
          search,
          user_id,
        }),
      }),
    }),
    removeAvatar: builder.mutation({
      query: () => ({
        url: convertToSecureUrl(`/profile/remove-avatar`),
        method: "POST",
      }),
    }),
    postPersonalization: builder.mutation({
      query: ({ tags, interest }) => ({
        url: convertToSecureUrl(`user/personalize/update`),
        method: "POST",
        body: convertToSecurePayload({
          tags: tags,
          interest: interest,
        }),
      }),
    }),
  }),
});

export const {
  useRemoveAvatarMutation,
  useCoverUploadMutation,
  useAvatarUploadMutation,
  useUserShareInfoQuery,
  usePostsSearchMutation,
  useShareInfoMutation,
  useGetMyPostsQuery,
  useGetPostsQuery,
  useFilterFollowingQuery,
  useFilterFollowerQuery,
  useCheckSAnswerMutation,
  useGetConfigQuery,
  useChangeShareRegionMutation,
  useChangeHideBioMutation,
  useChangeFollowReqMutation,
  useChangeCVisMutation,
  useSetPasswordMutation,
  useCheckAnswerMutation,
  useCheckUsernameMutation,
  useGetlikePostListQuery,
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
  useGetUserProfileQuery,
  useGetNotiQuery,
  useRemoveSecurityQuestionMutation,
  useSettingUploadMutation,
  useProfileUploadMutation,
  useChangeCoverMutation,
  useRemoveCoverMutation,
  useGetWatchHistoryQuery,
  useGetMyOwnProfileQuery,
  usePostPersonalizationMutation,
} = profileApi;
