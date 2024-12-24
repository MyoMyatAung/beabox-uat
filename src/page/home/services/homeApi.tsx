import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const homeApi = createApi({
  reducerPath: "homeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://107.148.47.94:8800/api/v1",
    prepareHeaders: (headers) => {
      const storedAuth = JSON.parse(localStorage.getItem("authToken") || "{}");
      const accessToken = storedAuth?.data?.access_token;
      headers.set("Accept-Language", "en");
      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      } else {
        headers.set(
          "Authorization",
          `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTA3LjE0OC40Ny45NDo4ODAwL2FwaS92MS9sb2dpbiIsImlhdCI6MTczNDY5OTgwNywiZXhwIjoxNzM1MzA0NjA3LCJuYmYiOjE3MzQ2OTk4MDcsImp0aSI6InpEQjM3SUkycU5waW5hb0oiLCJzdWIiOiI1MSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.xR_zLWUvsRsP-vmc1KzJ8QNgVf2Z21vcY1Kd7lZDo3g`
        );
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: ({ page }) => `posts/list?pageSize=10&page=${page}`,
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

    likePost: builder.mutation<void, { post_id: any }>({
      query: ({ post_id }) => ({
        url: `post/like`,
        method: "POST",
        body: {
          post_id,
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
  }),
});

export const {
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
} = homeApi;
