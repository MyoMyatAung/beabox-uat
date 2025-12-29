import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getDeviceInfo } from "@/lib/deviceInfo";

export interface GossipCategory {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface GossipPostMedia {
  id?: string;
  type: "image" | "video";
  url: string;
  download_url?: string;
  thumbnail?: string;
  thumbnail_url?: string;
}

export interface GossipPostUser {
  id: number | string;
  nickname: string;
  profile_image: string;
  is_following?: boolean;
  level?: string;
  badge?: string;
}

export interface GossipCommentUser {
  id: string;
  nickname: string;
  profile_image: string;
  level?: string;
  badge?: string;
  level_badge_color?: string;
  is_author?: boolean;
  is_verified?: boolean;
}

export interface GossipPost {
  id: string;
  category_id: string;
  description: string;
  media?: GossipPostMedia[];
  user?: GossipPostUser;
  created_at: string;
  updated_at: string;
  like_count?: number;
  comment_count?: number;
  share_count?: number;
  is_liked?: boolean;
  share_link?: string;
  time_ago?: string;
}

export interface GossipDetailPost {
  id: string;
  post_id: string;
  category_id?: string;
  user: GossipPostUser;
  content: string;
  description?: string;
  media: GossipPostMedia[];
  like_count: number;
  comment_count: number;
  share_count: number;
  is_liked: boolean;
  created_at: string;
  share_link?: string;
  time_ago?: string;
}

interface GossipPostDetailResponse {
  status: boolean;
  message: string;
  data?: GossipDetailPost;
}

interface GossipCategoryResponse {
  status: boolean;
  message: string;
  data: GossipCategory[];
}

interface GossipPagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

interface GossipPostListResponse {
  status: boolean;
  message: string;
  data: GossipPost[];
  pagination?: GossipPagination;
}

export interface GossipPostListResult {
  data: GossipPost[];
  pagination?: GossipPagination;
}

export interface GossipPostListParams {
  category_id: string;
  page?: number;
  pageSize?: number;
}

export interface GossipReply {
  hasMore: string | boolean;
  list: GossipComment[];
  replies_count: number;
}

export interface GossipComment {
  user?: GossipCommentUser;
  comment_id: string;
  post_id: string;
  content: string;
  created_at: string;
  is_liked?: boolean;
  like_count?: number;
  reply_id?: string;
  replies?: GossipReply;
}

interface GossipCommentListResponse {
  status: boolean;
  message: string;
  data: GossipComment[];
  total?: number;
  meta?: { total?: number };
  pagination?: { total?: number };
}

interface GossipReplyListResponse {
  status: boolean;
  message: string;
  data: GossipComment[];
}

export interface GossipCommentListParams {
  post_id: string;
  page?: number;
}

export interface GossipReplyListParams {
  comment_id: string;
  last_reply_id?: string | null;
}

export interface GossipPostCommentPayload {
  post_id: string;
  content: string;
  comment_id?: string;
  reply_id?: string;
  device?: string;
  app_version?: string;
}

export interface GossipPostCommentResponse {
  status: boolean;
  message: string;
  data: {
    type: string;
    data: GossipComment;
  };
}

export interface GossipPostActionResponse {
  status: boolean;
  message: string;
  data?: {
    post_id: string;
    like_count?: number;
    is_liked?: boolean;
  };
}

interface GossipGenericResponse {
  status: boolean;
  message: string;
  data?: Record<string, unknown>;
}

export interface GossipCommentLikePayload {
  id: string;
  is_reply: 0 | 1;
}

export interface GossipCommentLikeResponse {
  status: boolean;
  message: string;
}

export const gossipExternalApi = createApi({
  reducerPath: "gossipExternalApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_GOSSIP_API_BASE,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as {
        persist?: { user?: { token?: string } };
      };
      const token = state?.persist?.user?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      headers.set("Accept-Language", "cn");
      return headers;
    },
  }),
  tagTypes: ["gossipCategory", "gossipPosts", "gossipPostDetail"],
  endpoints: (builder) => ({
    getGossipCategories: builder.query<GossipCategory[], void>({
      query: () => "category/list",
      transformResponse: (response: GossipCategoryResponse) =>
        response?.data ?? [],
      providesTags: ["gossipCategory"],
    }),
    getGossipPosts: builder.query<GossipPostListResult, GossipPostListParams>({
      query: ({ category_id, page = 1, pageSize = 10 }) => {
        return {
          url: "post/list",
          params: { category_id, page, pageSize },
        }
      },
      transformResponse: (response: GossipPostListResponse) => ({
        data: response?.data ?? [],
        pagination: response?.pagination,
      }),
      // Cache key is based on category_id only (ignore page for caching)
      serializeQueryArgs: ({ queryArgs }) => {
        return queryArgs.category_id;
      },
      // Merge new results with existing cache for infinite scroll
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) {
          // Reset cache on first page (fresh load or category change)
          return newItems;
        }
        // Append new posts, deduplicate by id
        const existingIds = new Set(currentCache.data.map((p) => p.id));
        const uniqueNewPosts = newItems.data.filter(
          (p) => !existingIds.has(p.id)
        );
        return {
          data: [...currentCache.data, ...uniqueNewPosts],
          pagination: newItems.pagination,
        };
      },
      // Force refetch when page changes
      forceRefetch: ({ currentArg, previousArg }) => {
        return currentArg?.page !== previousArg?.page;
      },
      providesTags: (_result, _error, { category_id }) => [
        { type: "gossipPosts", id: category_id },
        "gossipPosts",
      ],
    }),
    getGossipPostDetail: builder.query<GossipDetailPost | null, string>({
      query: (postId) => ({
        url: "post/detail",
        params: { post_id: postId },
      }),
      transformResponse: (response: GossipPostDetailResponse) =>
        response?.data ?? null,
      providesTags: (_result, _error, postId) => [{ type: "gossipPostDetail", id: postId }],
    }),
    getGossipComments: builder.mutation<
      GossipCommentListResponse,
      GossipCommentListParams
    >({
      query: ({ post_id, page = 1 }) => ({
        url: `comments/list?page=${page}`,
        method: "POST",
        body: { post_id },
      }),
    }),
    getGossipReplies: builder.mutation<
      GossipReplyListResponse,
      GossipReplyListParams
    >({
      query: ({ comment_id, last_reply_id = null }) => ({
        url: `replies/list`,
        method: "POST",
        body: { comment_id, last_reply_id },
      }),
    }),
    postGossipComment: builder.mutation<
      GossipPostCommentResponse,
      GossipPostCommentPayload
    >({
      query: ({
        post_id,
        content,
        comment_id,
        reply_id,
        device,
        app_version,
      }) => {
        const deviceInfo = getDeviceInfo();
        const body: Record<string, unknown> = {
          post_id,
          content,
          device: device ?? deviceInfo.deviceName,
          app_version: app_version ?? deviceInfo.appVersion,
        };
        if (comment_id) {
          body.comment_id = comment_id;
        }
        if (reply_id) {
          body.reply_id = reply_id;
        }

        return {
          url: "post/comment",
          method: "POST",
          body,
        };
      },
    }),
    likeGossipPost: builder.mutation<
      GossipPostActionResponse,
      { post_id: string }
    >({
      query: ({ post_id }) => ({
        url: "post/like",
        method: "POST",
        body: { post_id },
      }),
      invalidatesTags: ["gossipPostDetail", "gossipPosts"],
      // Optimistically update is_liked and like_count in cache
      async onQueryStarted({ post_id }, { dispatch, getState, queryFulfilled }) {
        const patches: Array<{ undo: () => void }> = [];

        // Update all cached post lists
        const cachedListArgs =
          gossipExternalApi.util.selectCachedArgsForQuery(
            getState(),
            "getGossipPosts"
          ) || [];

        cachedListArgs.forEach((args: GossipPostListParams) => {
          patches.push(
            dispatch(
              gossipExternalApi.util.updateQueryData(
                "getGossipPosts",
                args,
                (draft) => {
                  draft.data?.forEach((post) => {
                    if (post.id === post_id) {
                      post.is_liked = true;
                      post.like_count = (post.like_count || 0) + 1;
                    }
                  });
                }
              )
            )
          );
        });

        // Update cached post detail
        patches.push(
          dispatch(
            gossipExternalApi.util.updateQueryData(
              "getGossipPostDetail",
              post_id,
              (draft) => {
                if (draft) {
                  draft.is_liked = true;
                  draft.like_count = (draft.like_count || 0) + 1;
                }
              }
            )
          )
        );

        try {
          await queryFulfilled;
        } catch {
          // Rollback all patches on error
          patches.forEach((patch) => patch.undo());
        }
      },
    }),
    unlikeGossipPost: builder.mutation<
      GossipPostActionResponse,
      { post_id: string }
    >({
      query: ({ post_id }) => ({
        url: "post/unlike",
        method: "POST",
        body: { post_id },
      }),
      invalidatesTags: ["gossipPosts", "gossipPostDetail"],
      // Optimistically update is_liked and like_count in cache
      async onQueryStarted({ post_id }, { dispatch, getState, queryFulfilled }) {
        const patches: Array<{ undo: () => void }> = [];

        // Update all cached post lists
        const cachedListArgs =
          gossipExternalApi.util.selectCachedArgsForQuery(
            getState(),
            "getGossipPosts"
          ) || [];

        cachedListArgs.forEach((args: GossipPostListParams) => {
          patches.push(
            dispatch(
              gossipExternalApi.util.updateQueryData(
                "getGossipPosts",
                args,
                (draft) => {
                  draft.data?.forEach((post) => {
                    if (post.id === post_id) {
                      post.is_liked = false;
                      post.like_count = Math.max(0, (post.like_count || 0) - 1);
                    }
                  });
                }
              )
            )
          );
        });

        // Update cached post detail
        patches.push(
          dispatch(
            gossipExternalApi.util.updateQueryData(
              "getGossipPostDetail",
              post_id,
              (draft) => {
                if (draft) {
                  draft.is_liked = false;
                  draft.like_count = Math.max(0, (draft.like_count || 0) - 1);
                }
              }
            )
          )
        );

        try {
          await queryFulfilled;
        } catch {
          // Rollback all patches on error
          patches.forEach((patch) => patch.undo());
        }
      },
    }),
    uninterestGossipPost: builder.mutation<
      GossipPostActionResponse,
      { post_id: string; category_id?: string }
    >({
      query: ({ post_id }) => ({
        url: "post/uninterest",
        method: "POST",
        body: { post_id },
      }),
      invalidatesTags: (_result, _error, { category_id }) =>
        category_id
          ? [{ type: "gossipPosts", id: category_id }]
          : ["gossipPosts"],
    }),
    reportGossipPost: builder.mutation<
      GossipGenericResponse,
      {
        model_id: string;
        type?: string;
        report_content: string;
        category_id?: string;
      }
    >({
      query: ({ model_id, type = "post", report_content }) => ({
        url: "report/store",
        method: "POST",
        body: { model_id, type, report_content },
      }),
      invalidatesTags: (_result, _error, { category_id }) =>
        category_id
          ? [{ type: "gossipPosts", id: category_id }]
          : ["gossipPosts"],
    }),
    followGossipUser: builder.mutation<
      GossipGenericResponse,
      { follow_user_id: string; status: string }
    >({
      query: ({ follow_user_id, status }) => ({
        url: "follower/change-follow-status",
        method: "POST",
        body: { follow_user_id, status },
      }),
      invalidatesTags: ["gossipPostDetail"],
      // Optimistically update is_following in all cached posts for this user
      async onQueryStarted(
        { follow_user_id, status },
        { dispatch, getState, queryFulfilled }
      ) {
        const newIsFollowing = status === "follow";
        const patches: Array<{ undo: () => void }> = [];

        // Update all cached post lists
        const cachedListArgs =
          gossipExternalApi.util.selectCachedArgsForQuery(
            getState(),
            "getGossipPosts"
          ) || [];

        cachedListArgs.forEach((args: GossipPostListParams) => {
          patches.push(
            dispatch(
              gossipExternalApi.util.updateQueryData(
                "getGossipPosts",
                args,
                (draft) => {
                  draft.data?.forEach((post) => {
                    if (
                      post.user &&
                      String(post.user.id) === String(follow_user_id)
                    ) {
                      post.user.is_following = newIsFollowing;
                    }
                  });
                }
              )
            )
          );
        });

        // Update all cached post details
        const cachedDetailArgs =
          gossipExternalApi.util.selectCachedArgsForQuery(
            getState(),
            "getGossipPostDetail"
          ) || [];

        cachedDetailArgs.forEach((postId: string) => {
          patches.push(
            dispatch(
              gossipExternalApi.util.updateQueryData(
                "getGossipPostDetail",
                postId,
                (draft) => {
                  if (
                    draft?.user &&
                    String(draft.user.id) === String(follow_user_id)
                  ) {
                    draft.user.is_following = newIsFollowing;
                  }
                }
              )
            )
          );
        });

        try {
          await queryFulfilled;
        } catch {
          // Rollback all patches on error
          patches.forEach((patch) => patch.undo());
        }
      },
    }),
    likeGossipComment: builder.mutation<
      GossipCommentLikeResponse,
      GossipCommentLikePayload
    >({
      query: (body) => ({
        url: "comment/like",
        method: "POST",
        body,
      }),
    }),
    unlikeGossipComment: builder.mutation<
      GossipCommentLikeResponse,
      GossipCommentLikePayload
    >({
      query: (body) => ({
        url: "comment/unlike",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetGossipCategoriesQuery,
  useGetGossipPostsQuery,
  useGetGossipPostDetailQuery,
  useLazyGetGossipPostDetailQuery,
  useGetGossipCommentsMutation,
  useGetGossipRepliesMutation,
  usePostGossipCommentMutation,
  useLikeGossipPostMutation,
  useUnlikeGossipPostMutation,
  useUninterestGossipPostMutation,
  useReportGossipPostMutation,
  useFollowGossipUserMutation,
  useLikeGossipCommentMutation,
  useUnlikeGossipCommentMutation,
} = gossipExternalApi;
