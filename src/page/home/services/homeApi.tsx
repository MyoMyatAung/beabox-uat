import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const homeApi = createApi({
  reducerPath: "homeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as any;
      const accessToken = state.persist?.user?.token;
      headers.set("Accept-Language", "cn");
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: ({ page }) => `posts/list?pageSize=10&page=${page}`,
    }),
    getLatestPosts: builder.query({
      query: ({ page }) => `posts/latest?pageSize=10&page=${page}`,
    }),
    getFollowedPosts: builder.query({
      query: ({ page }) => `posts/following?pageSize=10&page=${page}`,
    }),

    getConfig: builder.query({
      query: () => `config/data`,
    }),
    getExplorePosts: builder.query({
      query: ({ page }) => `posts/explore?pageSize=10&page=${page}`,
    }),
    getFollowPosts: builder.query({
      query: () => `posts/following`,
    }),

    likePost: builder.mutation<void, { post_id: any; count: any }>({
      query: ({ post_id, count }) => ({
        url: `post/like`,
        method: "POST",
        body: {
          post_id,
          count,
        },
      }),
    }),
    followStatus: builder.mutation<void, { follow_user_id: any; status: any }>({
      query: ({ follow_user_id, status }) => ({
        url: `follower/change-follow-status`,
        method: "POST",
        body: {
          follow_user_id,
          status,
        },
      }),
    }),
    commentList: builder.mutation<void, { post_id: any }>({
      query: ({ post_id }) => ({
        url: `comments/list`,
        method: "POST",
        body: {
          post_id,
        },
      }),
    }),
    postComment: builder.mutation<
      void,
      { post_id: any; content: any; comment_id?: any; reply_id?: any }
    >({
      query: ({ post_id, content, comment_id, reply_id }) => {
        // Construct the body object conditionally
        const body: {
          post_id: any;
          content: any;
          comment_id?: any;
          reply_id?: any;
        } = {
          post_id,
          content,
        };

        // Only add comment_id and reply_id if they are provided (not null or undefined)
        if (comment_id != null) {
          body.comment_id = comment_id;
        }
        if (reply_id != null) {
          body.reply_id = reply_id;
        }

        return {
          url: `post/comment`,
          method: "POST",
          body, // Pass the body object
        };
      },
    }),

    replyList: builder.mutation<void, { comment_id: any; last_reply_id: any }>({
      query: ({ comment_id, last_reply_id }) => ({
        url: `replies/list`,
        method: "POST",
        body: {
          comment_id,
          last_reply_id,
          limit: 5,
        },
      }),
    }),
    commentReaction: builder.mutation<
      void,
      { id: any; is_reply: any; status: any }
    >({
      query: ({ id, is_reply, status }) => ({
        url: `comment/reaction`,
        method: "POST",
        body: {
          id,
          is_reply,
          status,
        },
      }),
    }),
    top20Posts: builder.query({
      query: () => `posts/top?pageSize=20&page=1`,
    }),
    getReports: builder.query({
      query: () => `report-content/list`,
    }),
    storeReport: builder.mutation<
      void,
      { model_id: any; type: any; report_content: any }
    >({
      query: ({ model_id, type, report_content }) => ({
        url: `report/store`,
        method: "POST",
        body: {
          model_id,
          type,
          report_content,
        },
      }),
    }),
  }),
});

export const {
  useFollowStatusMutation,
  useGetLatestPostsQuery,
  useGetFollowedPostsQuery,
  useTop20PostsQuery,
  useCommentReactionMutation,
  usePostCommentMutation,
  useCommentListMutation,
  useReplyListMutation,
  useGetConfigQuery,
  useGetPostsQuery,
  useGetExplorePostsQuery,
  useGetFollowPostsQuery,
  useLikePostMutation,
  useGetReportsQuery,
  useStoreReportMutation,
} = homeApi;
