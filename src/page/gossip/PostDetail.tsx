import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector, useStore } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { ChevronLeft, User, Volume2, VolumeX } from "lucide-react";
import { getPlayerManager } from "./services/playerManager";
import SharePost from "./components/SharePost";
import CommentSection, {
  CommentSectionProps,
} from "./components/CommentSection";
import MediaFullscreenViewer from "./components/MediaFullscreenViewer";
import {
  useGetGossipCommentsMutation,
  usePostGossipCommentMutation,
  useLikeGossipPostMutation,
  useUnlikeGossipPostMutation,
  useFollowGossipUserMutation,
  useGetGossipPostDetailQuery,
  gossipExternalApi,
} from "./services/gossipSlice";
import type {
  GossipComment as GossipCommentType,
  GossipDetailPost,
  GossipPostListParams,
} from "./services/gossipSlice";
import { getDeviceInfo } from "@/lib/deviceInfo";
import AsyncDecryptedImage from "@/utils/asyncDecryptedImage";
import LoginDrawer from "@/components/profile/auth/login-drawer";
import { showToast } from "../home/services/errorSlice";

const decodeUnicodeEscapes = (text?: string | null) => {
  if (!text) return "";
  try {
    const safeText = text
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r");
    return JSON.parse(`"${safeText}"`);
  } catch {
    return text;
  }
};

interface CommentListApiPayload {
  data?: GossipCommentType[];
  total?: number;
  meta?: { total?: number };
  pagination?: { total?: number };
}

interface CommentListApiResponse {
  data?: CommentListApiPayload;
}

type NormalizedMediaItem = GossipDetailPost["media"][number] & { id: string };

const PostDetail = () => {
  const dispatch = useDispatch<AppDispatch>();
  const store = useStore<RootState>();
  const user = useSelector((state: RootState) => state.persist?.user);
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(user?.token));
  const { postId } = useParams<{ postId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const locationPost = (
    location.state as { post?: GossipDetailPost } | undefined
  )?.post;
  const [post, setPost] = useState<GossipDetailPost | null>(
    locationPost ?? null
  );

  const [isMuted, setIsMuted] = useState(true);
  const [isFollowing, setIsFollowing] = useState(
    post?.user?.is_following ?? false
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const [getComments] = useGetGossipCommentsMutation();
  const [postCommentMutation] = usePostGossipCommentMutation();
  const [comments, setComments] = useState<GossipCommentType[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [totalComments, setTotalComments] = useState(post?.comment_count ?? 0);
  const [highlightCommentId, setHighlightCommentId] = useState<string | null>(
    null
  );
  const [isLoginDrawerOpen, setIsLoginDrawerOpen] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [postIsLiked, setPostIsLiked] = useState(post?.is_liked ?? false);
  const [postLikeCount, setPostLikeCount] = useState(post?.like_count ?? 0);
  const [likePost] = useLikeGossipPostMutation();
  const [unlikePost] = useUnlikeGossipPostMutation();
  const [followGossipUser, { isLoading: followLoading }] =
    useFollowGossipUserMutation();
  const {
    data: fetchedPostDetail,
    isLoading: isPostDetailLoading,
    isFetching: isPostDetailFetching,
    isError: isPostDetailError,
    error: postDetailError,
    refetch: refetchPostDetail,
  } = useGetGossipPostDetailQuery(postId ?? "", {
    skip: !postId,
  });
  const detailLoading = isPostDetailLoading || isPostDetailFetching;

  const currentUser = useSelector((state: RootState) => state?.persist?.user);
  const fallbackCommentUser = useMemo<GossipCommentType["user"]>(
    () => ({
      id: String(currentUser?.id ?? currentUser?.user_id ?? "self"),
      nickname:
        currentUser?.nickname ??
        currentUser?.username ??
        currentUser?.name ??
        "我",
      profile_image:
        currentUser?.profile_image ??
        currentUser?.profile_photo ??
        currentUser?.avatar ??
        "",
      level: currentUser?.level,
      level_badge_color: currentUser?.level_badge_color,
      is_author: false,
      is_verified: currentUser?.is_verified ?? false,
    }),
    [currentUser]
  );
  useEffect(() => {
    if (locationPost) {
      setPost(locationPost);
    }
  }, [locationPost]);

  useEffect(() => {
    if (fetchedPostDetail) {
      setPost(fetchedPostDetail);
    }
  }, [fetchedPostDetail]);

  useEffect(() => {
    if (!post) return;
    setIsFollowing(post.user?.is_following ?? false);
    setPostIsLiked(post.is_liked ?? false);
    setPostLikeCount(post.like_count ?? 0);
    setTotalComments(post.comment_count ?? 0);
  }, [post]);

  const detailErrorMessage = useMemo(() => {
    if (!postDetailError) {
      return null;
    }
    if ("status" in postDetailError) {
      const errData = postDetailError.data as { message?: string };
      return errData?.message || "帖子加载失败，请稍后重试";
    }
    if ("message" in postDetailError && postDetailError.message) {
      return postDetailError.message;
    }
    return "帖子加载失败，请稍后重试";
  }, [postDetailError]);
  const sortCommentsAsc = useCallback(
    (list: GossipCommentType[]) =>
      [...list].sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      ),
    []
  );

  const ensureAuthenticated = () => {
    if (isAuthenticated) {
      return true;
    }
    setIsLoginDrawerOpen(true);
    return false;
  };

  // Update authentication state when user changes
  useEffect(() => {
    const authenticated = Boolean(user?.token);
    setIsAuthenticated(authenticated);
  }, [user?.token]);

  const normalizeComment = useCallback(
    (payload: Partial<GossipCommentType>): GossipCommentType => ({
      comment_id: payload.comment_id ?? `temp-${Date.now()}`,
      reply_id: payload.reply_id, // Preserve reply_id if it exists
      post_id: payload.post_id ?? post?.post_id ?? postId ?? "",
      content: payload.content ?? "",
      created_at: payload.created_at ?? new Date().toISOString(),
      user: payload.user ?? fallbackCommentUser,
      like_count: payload.like_count ?? 0,
      is_liked: payload.is_liked ?? false,
      replies: payload.replies ?? {
        list: [],
        replies_count: 0,
        hasMore: false,
      },
    }),
    [fallbackCommentUser, post?.post_id, postId]
  );

  useEffect(() => {
    if (!postId) {
      navigate("/gossip", { replace: true });
    }
  }, [postId, navigate]);

  // ============================================================================
  // MEMORY MANAGEMENT: Clean up fullscreen players on unmount
  // ============================================================================
  // When leaving the post detail page, destroy fullscreen players to free memory.
  useEffect(() => {
    const playerManager = getPlayerManager();

    return () => {
      // Destroy fullscreen pool when leaving post detail
      playerManager.destroyAllPlayers(true);
    };
  }, []);

  const togglePostLike = useCallback(async () => {
    if (!ensureAuthenticated()) {
      return;
    }

    if (!post?.post_id) return;
    const nextLiked = !postIsLiked;
    const delta = nextLiked ? 1 : -1;
    setPostIsLiked(nextLiked);
    setPostLikeCount((prev) => Math.max(0, prev + delta));
    try {
      if (nextLiked) {
        await likePost({ post_id: post.post_id }).unwrap();
      } else {
        await unlikePost({ post_id: post.post_id }).unwrap();
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
      setPostIsLiked(!nextLiked);
      setPostLikeCount((prev) => Math.max(0, prev - delta));
    }
  }, [likePost, post?.post_id, postIsLiked, unlikePost]);

  const fetchComments = useCallback(async (): Promise<void> => {
    const targetPostId = post?.post_id ?? postId ?? "";
    if (!targetPostId) return;
    setCommentsLoading(true);
    setCommentsError(null);
    try {
      const response = (await getComments({
        post_id: targetPostId,
        page: 1,
      })) as CommentListApiResponse;
      if (response?.data) {
        const payload = response.data;
        const sorted = sortCommentsAsc(payload.data ?? []);
        setComments(sorted);
        const fallbackTotal = post?.comment_count ?? 0;
        setTotalComments(
          payload.total ??
            payload.meta?.total ??
            payload.pagination?.total ??
            fallbackTotal
        );
      }
    } catch (err) {
      console.error("Failed to load comments:", err);
      setCommentsError("评论加载失败，请稍后再试");
    } finally {
      setCommentsLoading(false);
    }
  }, [
    getComments,
    post?.comment_count,
    post?.post_id,
    postId,
    sortCommentsAsc,
  ]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleFollow = async () => {
    if (!ensureAuthenticated()) {
      return;
    }

    const response = await followGossipUser({
      follow_user_id: post?.user?.id?.toString() || "",
      status: isFollowing ? "unfollow" : "follow",
    }).unwrap();

    dispatch(
      showToast({
        message: response?.message || "关注成功",
        type: "success",
      })
    );
    setIsFollowing((prev) => !prev);
  };

  const appendCommentToState = useCallback(
    (incoming: GossipCommentType) => {
      setComments((prev) => sortCommentsAsc([...prev, incoming]));
      setTotalComments((prev) => prev + 1);
      setHighlightCommentId(incoming.comment_id);
    },
    [sortCommentsAsc]
  );

  const appendReplyToState = useCallback(
    (parentId: string, reply: GossipCommentType) => {
      setComments((prev) =>
        prev.map((comment) => {
          if (comment.comment_id !== parentId) return comment;
          const existingReplies = comment.replies?.list ?? [];
          const list = sortCommentsAsc([...existingReplies, reply]);
          return {
            ...comment,
            replies: {
              list,
              replies_count:
                (comment.replies?.replies_count ?? existingReplies.length) + 1,
              hasMore: comment.replies?.hasMore ?? false,
            },
          };
        })
      );
      setHighlightCommentId(parentId);
    },
    [sortCommentsAsc]
  );

  const applySubmissionResponse = useCallback(
    (
      response: Awaited<ReturnType<typeof postCommentMutation>>,
      context?: { parentCommentId?: string }
    ): boolean => {
      const submission = response.data?.data;
      const payload = submission?.data;
      const submissionType = submission?.type;
      if (!payload) {
        return false;
      }
      const normalized = normalizeComment(payload);
      if (submissionType === "comment" || !submissionType) {
        appendCommentToState(normalized);
        return true;
      }
      if (submissionType === "reply" && context?.parentCommentId) {
        appendReplyToState(context.parentCommentId, normalized);
        return true;
      }
      return false;
    },
    [appendCommentToState, appendReplyToState, normalizeComment]
  );

  const syncPostListCommentCount = useCallback(
    (delta: number) => {
      if (!delta) return;
      const categoryId = post?.category_id;
      const targetPostId = post?.post_id ?? postId ?? "";
      if (!categoryId || !targetPostId) {
        return;
      }
      const cachedArgs =
        gossipExternalApi.util.selectCachedArgsForQuery(
          store.getState(),
          "getGossipPosts"
        ) || [];
      cachedArgs.forEach((args: GossipPostListParams) => {
        if (!args?.category_id || args.category_id !== categoryId) return;
        dispatch(
          gossipExternalApi.util.updateQueryData(
            "getGossipPosts",
            args,
            (draft) => {
              const target = draft?.data?.find(
                (item) => item.id === targetPostId
              );
              if (target) {
                target.comment_count = Math.max(
                  0,
                  (target.comment_count ?? 0) + delta
                );
              }
            }
          )
        );
      });
    },
    [dispatch, post?.category_id, post?.post_id, postId, store]
  );

  const handleCommentSubmit = async (content: string) => {
    const trimmed = content.trim();
    const targetPostId = post?.post_id ?? postId ?? "";
    if (!trimmed || !targetPostId) {
      return;
    }
    try {
      const deviceInfo = getDeviceInfo();
      const response = await postCommentMutation({
        post_id: targetPostId,
        content: trimmed,
        device: deviceInfo.deviceName,
        app_version: deviceInfo.appVersion,
      });
      const submissionType = response?.data?.data?.type ?? "comment";
      if (response?.data?.status && submissionType !== "reply") {
        syncPostListCommentCount(1);
        setPost((prev) =>
          prev
            ? {
                ...prev,
                comment_count: Math.max(0, (prev.comment_count ?? 0) + 1),
              }
            : prev
        );
      }
      const handled = applySubmissionResponse(response);
      if (!handled) {
        await fetchComments();
      }
    } catch (err) {
      console.error("Failed to submit comment:", err);
      setCommentsError("发表评论失败，请稍后重试");
    }
  };

  const handleReplySubmit = async (commentId: string, content: string) => {
    const trimmed = content.trim();
    const targetPostId = post?.post_id ?? postId ?? "";
    if (!trimmed || !targetPostId) {
      return;
    }
    try {
      const deviceInfo = getDeviceInfo();
      const response = await postCommentMutation({
        post_id: targetPostId,
        content: trimmed,
        comment_id: commentId,
        device: deviceInfo.deviceName,
        app_version: deviceInfo.appVersion,
      });
      const handled = applySubmissionResponse(response, {
        parentCommentId: commentId,
      });
      if (!handled) {
        await fetchComments();
        setHighlightCommentId(commentId);
      }
    } catch (err) {
      console.error("Failed to submit reply:", err);
      setCommentsError("回复失败，请稍后重试");
    }
  };

  const handleLikeComment = (commentId: string) => {
    // TODO: Implement like comment
    console.log("Like comment:", commentId);
  };

  const handleReportComment = (modelId: string) => {
    if (!ensureAuthenticated()) {
      return;
    }
    // Small delay to ensure Redux persist has flushed the state
    setTimeout(() => {
      navigate(`/gossip/reports/${modelId}?type=comment`);
    }, 150);
  };

  const rawPostContent = post?.content ?? post?.description ?? "";
  const decodedPostContent = useMemo(
    () => decodeUnicodeEscapes(rawPostContent),
    [rawPostContent]
  );

  const normalizedMedia: NormalizedMediaItem[] = useMemo(() => {
    if (!post?.media) {
      return [];
    }
    return post.media.map((item, index) => ({
      ...item,
      id: item.id ?? `${post.post_id ?? postId ?? "post"}-media-${index}`,
    }));
  }, [post, postId]);
  const firstMedia = normalizedMedia.length > 0 ? normalizedMedia[0] : null;
  const isFirstVideo = firstMedia?.type === "video";

  const handleMediaClick = useCallback(
    (index: number) => {
      if (!normalizedMedia.length) return;
      if (isFirstVideo && index === 0 && videoRef.current) {
        videoRef.current.pause();
      }
      setFullscreenIndex(index);
      setIsFullscreenOpen(true);
    },
    [isFirstVideo, normalizedMedia.length]
  );

  const shareUrl = useMemo(
    () =>
      post?.share_link ||
      `${window.location.origin}/gossip/post/${post?.post_id ?? postId ?? ""}`,
    [post?.post_id, post?.share_link, postId]
  );

  if (!post) {
    const fallbackMessage =
      detailLoading && !isPostDetailError
        ? "帖子加载中..."
        : detailErrorMessage || "帖子不存在或已被删除";
    return (
      <div className="w-full min-h-screen flex flex-col bg-[#16131C] px-5 pt-5 z-[9999] max-w-[480px] mx-auto">
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
          <p className="text-white text-sm">{fallbackMessage}</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-1.5 rounded-2xl border border-gray-600 text-sm font-medium text-white hover:bg-gray-800/40 transition-colors"
            >
              返回
            </button>
            {!detailLoading && postId && (
              <button
                onClick={() => refetchPostDetail()}
                className="px-4 py-1.5 rounded-2xl bg-pink-500 text-sm font-medium text-white hover:bg-pink-400 transition-colors"
              >
                重试
              </button>
            )}
          </div>
        </div>
        <LoginDrawer
          isOpen={isLoginDrawerOpen}
          setIsOpen={setIsLoginDrawerOpen}
        />
      </div>
    );
  }

  const detailCommentSectionProps: CommentSectionProps = {
    comments,
    commentCount: totalComments,
    postId: post.post_id || postId || "",
    onCommentSubmit: handleCommentSubmit,
    onReplySubmit: handleReplySubmit,
    onLikeComment: handleLikeComment,
    onReportComment: handleReportComment,
    showInput: true,
    loading: commentsLoading,
    error: commentsError,
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#16131C] px-5 pt-5 z-[9999] max-w-[480px] mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#16131C] border-b border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-white p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-3 flex-1 ml-4">
            {post.user.profile_image ? (
              <AsyncDecryptedImage
                imageUrl={post.user.profile_image}
                alt={post.user.nickname}
                className="!w-10 !h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#FFFFFF12] flex items-center justify-center object-cover">
                <User size={22} className="text-white" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-white font-medium text-sm">
                  {post.user.nickname}
                </span>
                {post.user.badge && (
                  <AsyncDecryptedImage
                    imageUrl={post.user.badge}
                    alt="badge"
                    className="!w-4 !h-4"
                  />
                )}
              </div>
              {post.user.level && (
                <AsyncDecryptedImage
                  imageUrl={post.user.level}
                  alt="level"
                  className="!w-11 !h-6 object-contain"
                />
              )}
            </div>
            <button
              onClick={handleFollow}
              disabled={followLoading}
              className={`px-4 py-1.5 rounded-2xl border text-sm font-medium transition-all text-white ${
                isFollowing
                  ? "bg-transparent border-pink-400 text-pink-400"
                  : "hover:opacity-90 hover:brightness-110 border-pink-400"
              }`}
              style={
                !isFollowing
                  ? {
                      background:
                        "linear-gradient(315deg, #CD3EFF 0%, #FFB2E0 100%)",
                    }
                  : undefined
              }
            >
              {isFollowing ? "已关注" : "+关注"}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 border-b border-[#FFFFFF14]">
        <p className="text-white text-sm leading-relaxed mb-4 whitespace-pre-line">
          {decodedPostContent}
        </p>

        {/* Media */}
        {normalizedMedia.length > 0 && (
          <div className="mb-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {normalizedMedia.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => handleMediaClick(index)}
                  className="flex-shrink-0 w-[190px] h-[240px] rounded-lg overflow-hidden bg-gray-900 relative cursor-pointer"
                  role="button"
                  tabIndex={0}
                >
                  {item.type === "image" ? (
                    <AsyncDecryptedImage
                      imageUrl={item.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : index === 0 && isFirstVideo ? (
                    <div className="relative w-full h-full">
                      <video
                        ref={videoRef}
                        src={item.url}
                        className="w-full h-full object-cover"
                        muted={isMuted}
                        playsInline
                        loop
                        autoPlay
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleMute();
                        }}
                        className="absolute bottom-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors z-10"
                      >
                        {isMuted ? (
                          <VolumeX size={16} className="text-white" />
                        ) : (
                          <Volume2 size={16} className="text-white" />
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="relative w-full h-full">
                      {item.thumbnail_url || item.thumbnail ? (
                        <AsyncDecryptedImage
                          imageUrl={item.thumbnail_url || item.thumbnail || ""}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-900" />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="white"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Engagement Stats */}
        <div className="flex justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <button
              onClick={togglePostLike}
              className={`flex items-center gap-1 transition-colors ${
                postIsLiked ? "text-[#F70F2D]" : "text-white"
              }`}
              aria-pressed={postIsLiked}
            >
              {postIsLiked ? (
                <svg
                  width="18"
                  height="16"
                  viewBox="0 0 18 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M14.292 0.694091C16.1073 1.75208 17.3845 3.90012 17.3282 6.40602C17.258 9.53406 14.824 12.293 10.6744 14.7573C10.0592 15.123 9.41105 15.5969 8.665 15.5969C7.93281 15.5969 7.25695 15.1143 6.65473 14.7564C2.50683 12.293 0.0719777 9.5332 0.00179165 6.40602C-0.0545305 3.90012 1.22268 1.75295 3.03799 0.694091C4.73632 -0.294579 6.86963 -0.300644 8.665 1.1594C10.4604 -0.300644 12.5937 -0.295445 14.292 0.694091ZM13.4195 2.19226C12.2116 1.48867 10.7021 1.51379 9.39546 2.83606C9.29977 2.93242 9.18597 3.0089 9.06061 3.06109C8.93524 3.11327 8.80079 3.14014 8.665 3.14014C8.52921 3.14014 8.39476 3.11327 8.26939 3.06109C8.14403 3.0089 8.03023 2.93242 7.93455 2.83606C6.62787 1.51379 5.11844 1.48867 3.91055 2.19226C2.65933 2.92185 1.69232 4.46941 1.73478 6.36876C1.7833 8.54453 3.50243 10.8693 7.54029 13.2678C7.89382 13.4783 8.26295 13.7478 8.665 13.8596C9.06705 13.7478 9.43618 13.4783 9.78971 13.2678C13.8276 10.8693 15.5467 8.54539 15.5952 6.3679C15.6385 4.47027 14.6707 2.92185 13.4195 2.19226Z"
                    fill="#F70F2D"
                  />
                  <path
                    d="M13.4195 2.19226C12.2116 1.48867 10.7021 1.51379 9.39546 2.83606C9.29977 2.93242 9.18597 3.0089 9.06061 3.06109C8.93524 3.11327 8.80079 3.14014 8.665 3.14014C8.52921 3.14014 8.39476 3.11327 8.26939 3.06109C8.14403 3.0089 8.03023 2.93242 7.93455 2.83606C6.62787 1.51379 5.11844 1.48867 3.91055 2.19226C2.65933 2.92185 1.69232 4.46941 1.73478 6.36876C1.7833 8.54453 3.50243 10.8693 7.54029 13.2678C7.89382 13.4783 8.26295 13.7478 8.665 13.8596C9.06705 13.7478 9.43618 13.4783 9.78971 13.2678C13.8276 10.8693 15.5467 8.54539 15.5952 6.3679C15.6385 4.47027 14.6707 2.92185 13.4195 2.19226Z"
                    fill="#F70F2D"
                  />
                </svg>
              ) : (
                <svg
                  width="18"
                  height="16"
                  viewBox="0 0 18 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14.292 0.694091C16.1073 1.75208 17.3845 3.90012 17.3282 6.40602C17.258 9.53406 14.824 12.293 10.6744 14.7573C10.0592 15.123 9.41105 15.5969 8.665 15.5969C7.93281 15.5969 7.25695 15.1143 6.65473 14.7564C2.50683 12.293 0.0719777 9.5332 0.00179165 6.40602C-0.0545305 3.90012 1.22268 1.75295 3.03799 0.694091C4.73632 -0.294579 6.86962 -0.300644 8.665 1.1594C10.4604 -0.300644 12.5937 -0.295445 14.292 0.694091ZM13.4195 2.19226C12.2116 1.48867 10.7021 1.51379 9.39545 2.83606C9.29977 2.93242 9.18597 3.0089 9.06061 3.06109C8.93524 3.11327 8.80079 3.14014 8.665 3.14014C8.52921 3.14014 8.39476 3.11327 8.26939 3.06109C8.14403 3.0089 8.03023 2.93242 7.93455 2.83606C6.62787 1.51379 5.11844 1.48867 3.91055 2.19226C2.65933 2.92185 1.69232 4.46941 1.73478 6.36876C1.7833 8.54453 3.50243 10.8693 7.54029 13.2678C7.89382 13.4783 8.26295 13.7478 8.665 13.8596C9.06705 13.7478 9.43618 13.4783 9.78971 13.2678C13.8276 10.8693 15.5467 8.54539 15.5952 6.3679C15.6385 4.47027 14.6707 2.92185 13.4195 2.19226Z"
                    fill="currentColor"
                  />
                </svg>
              )}
              <span className="text-sm">{postLikeCount}</span>
            </button>
            <div className="flex items-center gap-1 text-white">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.75 14.75C6.36553 14.75 5.01215 14.3395 3.86101 13.5703C2.70987 12.8011 1.81266 11.7079 1.28285 10.4288C0.753032 9.1497 0.614409 7.74224 0.884505 6.38437C1.1546 5.0265 1.82129 3.77922 2.80026 2.80026C3.77922 1.82129 5.0265 1.1546 6.38437 0.884506C7.74224 0.61441 9.1497 0.753033 10.4288 1.28285C11.7079 1.81266 12.8011 2.70987 13.5703 3.86101C14.3395 5.01215 14.75 6.36553 14.75 7.75C14.75 8.90733 14.47 9.99856 13.9722 10.9599L14.75 14.75L10.9599 13.9722C9.99856 14.47 8.90656 14.75 7.75 14.75Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-sm">{totalComments}</span>
            </div>
            <div className="flex items-center gap-1 text-white">
              <button
                className="flex items-center gap-1 text-white"
                onClick={() => setShowShareSheet(true)}
              >
                <svg
                  width="19"
                  height="15"
                  viewBox="0 0 19 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.5006 7.82434L11.5501 13.5122C11.307 13.7445 10.942 13.8138 10.624 13.6881C10.3069 13.5624 10.0997 13.2661 10.0997 12.9378V10.5132C4.43758 10.6975 2.21734 12.6833 2.19511 12.7046H2.19431C1.92575 12.9544 1.51694 13.0062 1.1886 12.8326C0.860269 12.6581 0.689737 12.2993 0.769424 11.949C0.786956 11.872 2.57842 4.54649 10.0996 4.02857V1.56218C10.0996 1.23388 10.3068 0.93757 10.624 0.811871C10.9419 0.686187 11.3069 0.755504 11.55 0.98783L17.5006 6.67565C17.6599 6.828 17.75 7.03442 17.75 7.24999C17.75 7.46557 17.66 7.67201 17.5006 7.82434Z"
                    stroke="white"
                    strokeWidth="1.5"
                  />
                </svg>
                {post.share_count > 0 && (
                  <span className="text-sm">{post.share_count}</span>
                )}
              </button>
            </div>
          </div>
          <span className="text-gray-500 text-xs">{post.time_ago}</span>
        </div>
      </div>

      {/* Comment Section */}
      <div className="flex-1 relative">
        <CommentSection
          {...detailCommentSectionProps}
          highlightCommentId={highlightCommentId}
          onHighlightHandled={() => setHighlightCommentId(null)}
        />
      </div>

      <MediaFullscreenViewer
        media={normalizedMedia}
        initialIndex={fullscreenIndex}
        isOpen={isFullscreenOpen}
        onClose={() => setIsFullscreenOpen(false)}
        postData={{
          like_count: postLikeCount,
          comment_count: totalComments,
          share_count: post.share_count,
          is_liked: postIsLiked,
          onLike: togglePostLike,
          onComment: () => {},
          onShare: () => setShowShareSheet(true),
        }}
        commentSectionProps={detailCommentSectionProps}
      />

      {/* Share Bottom Sheet */}
      {showShareSheet && (
        <div className="fixed inset-0 z-[1000000] flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowShareSheet(false)}
          />
          <div className="relative w-full max-w-md bg-[#191721] rounded-t-2xl shadow-xl transform transition-transform duration-200 translate-y-0">
            <div className="flex justify-center py-2">
              <div className="h-1 w-12 bg-gray-500 rounded-full" />
            </div>
            <SharePost
              shareUrl={shareUrl}
              onClose={() => setShowShareSheet(false)}
            />
          </div>
        </div>
      )}

      {/* Login Drawer */}
      <LoginDrawer
        isOpen={isLoginDrawerOpen}
        setIsOpen={setIsLoginDrawerOpen}
      />
    </div>
  );
};

export default PostDetail;
