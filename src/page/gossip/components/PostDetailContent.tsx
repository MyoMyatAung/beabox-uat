/**
 * ============================================================================
 * POST DETAIL CONTENT COMPONENT
 * ============================================================================
 *
 * Reusable content component for displaying post details in fullscreen.
 * Used by PostDetailDialog for in-page post viewing without navigation.
 *
 * KEY FEATURES:
 * - Full post details with user info, content, and media
 * - Video player support with mute state management
 * - Like/Unlike functionality with optimistic updates
 * - Follow/Unfollow user functionality
 * - Comments section with real-time count updates
 * - Share functionality via SharePost component
 * - Fullscreen media viewer for images and videos
 *
 * PERFORMANCE OPTIMIZATIONS:
 * - Memoized media normalization
 * - Lazy loading of heavy components
 * - Player memory cleanup on unmount
 *
 * STATE MANAGEMENT:
 * - Local state for UI interactions (like, follow, comments)
 * - RTK Query for post detail fetching
 * - Redux for global states (mute, auth drawer)
 *
 * @see PostDetailDialog for the dialog wrapper
 * @see GossipPost for post card display
 */

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { User, X } from "lucide-react";
import { getPlayerManager } from "../services/playerManager";
import SharePost from "./SharePost";
import MediaFullscreenViewer from "./MediaFullscreenViewer";
import ImageGrid from "./ImageGrid";
import {
  useLikeGossipPostMutation,
  useUnlikeGossipPostMutation,
  useFollowGossipUserMutation,
  useGetGossipPostDetailQuery,
} from "../services/gossipSlice";
import type {
  GossipDetailPost,
} from "../services/gossipSlice";
import AsyncDecryptedImage from "@/utils/asyncDecryptedImage";
import AuthDrawer from "@/components/profile/auth/auth-drawer";
import { setPostMuted } from "../services/gossipMuteSlice";
import FollowSuccessToast from "./FollowSuccessToast";
import { useAuthentication } from "../hooks/useAuthentication";
import { setAuthToggle } from "@/store/slices/profileSlice";
import { showToast } from "@/page/home/services/errorSlice";
import { getErrorMessage } from "../utils/errorUtils";
import type { GossipPostData } from "../types";

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

type NormalizedMediaItem = GossipDetailPost["media"][number] & { id: string };

interface PostDetailContentProps {
  postId: string;
  initialPost?: GossipPostData | null;
  onClose: () => void;
}

const PostDetailContent = ({
  postId,
  initialPost,
  onClose,
}: PostDetailContentProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { ensureAuthenticated } = useAuthentication();
  const isOpen = useSelector((state: RootState) => state.profile.isDrawerOpen);

  // Transform initialPost to GossipDetailPost format if provided
  const transformedInitialPost: GossipDetailPost | null = useMemo(() => {
    if (!initialPost) return null;
    return {
      id: initialPost.post_id,
      post_id: initialPost.post_id,
      category_id: initialPost.category_id,
      user: initialPost.user,
      content: initialPost.content,
      description: initialPost.content,
      media: initialPost.media,
      like_count: initialPost.like_count,
      comment_count: initialPost.comment_count,
      share_count: initialPost.share_count,
      is_liked: initialPost.is_liked,
      created_at: initialPost.created_at,
      share_link: initialPost.share_link,
      time_ago: initialPost.time_ago,
    };
  }, [initialPost]);

  const [post, setPost] = useState<GossipDetailPost | null>(
    transformedInitialPost
  );

  const currentPostId = post?.id ?? postId ?? "";
  const isMuted = useSelector(
    (state: RootState) => state.gossipMute?.muteAll ?? false
  );
  const [isFollowing, setIsFollowing] = useState(
    post?.user?.is_following ?? false
  );
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [totalComments, setTotalComments] = useState(post?.comment_count ?? 0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [showFollowToast, setShowFollowToast] = useState(false);
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

  useEffect(() => {
    if (transformedInitialPost) {
      setPost(transformedInitialPost);
    }
  }, [transformedInitialPost]);

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

  // Memory management: Clean up players on unmount
  useEffect(() => {
    const playerManager = getPlayerManager();

    return () => {
      if (currentPostId) {
        playerManager.destroyPlayer(currentPostId, false);
      }
      playerManager.destroyAllPlayers(true);
    };
  }, [currentPostId]);

  // Video player management
  useEffect(() => {
    const actualFirstMedia =
      normalizedMedia.length > 0 ? normalizedMedia[0] : null;
    const actualIsFirstVideo = actualFirstMedia?.type === "video";

    if (!actualIsFirstVideo || !actualFirstMedia || !currentPostId) return;

    const playerManager = getPlayerManager();
    const container = videoContainerRef.current;
    if (!container) return;

    let isMounted = true;

    const initPlayer = async () => {
      try {
        const player = playerManager.requestPlayer(
          currentPostId,
          container,
          actualFirstMedia.url,
          {
            muted: isMuted,
            autoplay: false,
            loop: true,
          },
          false
        );

        if (isMounted && player) {
          setIsVideoReady(true);
        }
      } catch (error) {
        console.error("Failed to init player in PostDetailContent:", error);
      }
    };

    initPlayer();

    return () => {
      isMounted = false;
      playerManager.releasePlayer(currentPostId, false);
    };
  }, [normalizedMedia, currentPostId, isMuted]);

  const togglePostLike = useCallback(async () => {
    if (!ensureAuthenticated()) {
      dispatch(setAuthToggle(true));
      return;
    }

    if (!post?.id) return;
    const nextLiked = !postIsLiked;
    const delta = nextLiked ? 1 : -1;
    setPostIsLiked(nextLiked);
    setPostLikeCount((prev) => Math.max(0, prev + delta));
    try {
      if (nextLiked) {
        await likePost({ post_id: post.id }).unwrap();
      } else {
        await unlikePost({ post_id: post.id }).unwrap();
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
      setPostIsLiked(!nextLiked);
      setPostLikeCount((prev) => Math.max(0, prev - delta));
    }
  }, [
    dispatch,
    ensureAuthenticated,
    likePost,
    post?.id,
    postIsLiked,
    unlikePost,
  ]);

  const handleToggleMute = () => {
    if (currentPostId) {
      const playerManager = getPlayerManager();
      const player = playerManager.getPlayer(currentPostId, false);
      if (player?.artplayer) {
        const newMuted = !player.artplayer.muted;
        player.artplayer.muted = newMuted;
        dispatch(setPostMuted({ postId: currentPostId, muted: newMuted }));
      }
    }
  };

  const handleFollow = async () => {
    if (!ensureAuthenticated()) {
      dispatch(setAuthToggle(true));
      return;
    }

    try {
      await followGossipUser({
        follow_user_id: post?.user?.id?.toString() || "",
        status: post?.user?.is_following ? "unfollow" : "follow",
      }).unwrap();

      setShowFollowToast(true);
    } catch (error) {
      console.error("Failed to toggle follow:", error);
      dispatch(
        showToast({
          message: getErrorMessage(error),
          type: "error",
        })
      );
    }
  };

  const handleMediaClick = useCallback(
    (index: number) => {
      if (!normalizedMedia.length) return;
      const actualFirstMedia =
        normalizedMedia.length > 0 ? normalizedMedia[0] : null;
      const actualIsFirstVideo = actualFirstMedia?.type === "video";

      if (actualIsFirstVideo && index === 0) {
        const playerManager = getPlayerManager();
        const player = playerManager.getPlayer(currentPostId, false);
        if (player?.artplayer) {
          player.artplayer.pause();
        }
      }
      setFullscreenIndex(index);
      setIsFullscreenOpen(true);
    },
    [normalizedMedia, currentPostId]
  );

  const rawPostContent = post?.content ?? post?.description ?? "";
  const decodedPostContent = useMemo(
    () => decodeUnicodeEscapes(rawPostContent),
    [rawPostContent]
  );

  const shareUrl = useMemo(
    () =>
      post?.share_link ||
      `${window.location.origin}/gossip/post/${post?.post_id ?? postId ?? ""}`,
    [post?.post_id, post?.share_link, postId]
  );

  // Loading/Error state
  if (!post) {
    const fallbackMessage =
      detailLoading && !isPostDetailError
        ? "帖子加载中..."
        : detailErrorMessage || "帖子不存在或已被删除";
    return (
      <div className="w-full min-h-screen flex flex-col bg-[#16131C] z-[9999] max-w-[480px] mx-auto">
        <div className="sticky top-0 z-50 bg-[#16131C] border-b border-gray-800 p-4">
          <button
            onClick={onClose}
            className="text-white hover:bg-gray-800/50 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
          <p className="text-white text-sm">{fallbackMessage}</p>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-2xl border border-gray-600 text-sm font-medium text-white hover:bg-gray-800/40 transition-colors"
            >
              关闭
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
        {isOpen && <AuthDrawer />}
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#16131C] z-[9999] max-w-[480px] mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#16131C] border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-white hover:bg-gray-800/50 rounded-lg transition-colors"
          >
            <X size={20} />
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
                post.user.is_following
                  ? "bg-transparent border-pink-400 text-pink-400"
                  : "hover:opacity-90 hover:brightness-110 border-pink-400"
              }`}
              style={
                !post.user.is_following
                  ? {
                      background:
                        "linear-gradient(315deg, #CD3EFF 0%, #FFB2E0 100%)",
                    }
                  : undefined
              }
            >
              {post.user.is_following ? "已关注" : "+关注"}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 border-b border-[#FFFFFF14] flex-1 overflow-y-auto">
        <p className="text-white text-sm leading-relaxed mb-4 whitespace-pre-line">
          {decodedPostContent}
        </p>

        {/* Media Grid */}
        {normalizedMedia.length > 0 && (
          <ImageGrid
            media={normalizedMedia}
            onMediaClick={handleMediaClick}
            videoContainerRef={videoContainerRef}
            isFirstVideo={isFirstVideo}
            isVideoReady={isVideoReady}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            showAllMedia={true}
          />
        )}

        {/* Engagement Stats */}
        <div className="flex justify-between items-center gap-6 mt-4">
          <div className="flex items-center gap-4">
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
                    fillRule="evenodd"
                    clipRule="evenodd"
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
              {postLikeCount > 0 && (
                <span className="text-sm">{postLikeCount}</span>
              )}
            </button>
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

      <MediaFullscreenViewer
        media={normalizedMedia}
        initialIndex={fullscreenIndex}
        isOpen={isFullscreenOpen}
        onClose={() => setIsFullscreenOpen(false)}
        initialMuted={isMuted}
        postData={{
          post_id: currentPostId,
          like_count: postLikeCount,
          comment_count: totalComments,
          share_count: post.share_count,
          is_liked: postIsLiked,
          onLike: togglePostLike,
          onComment: () => {},
          onShare: () => setShowShareSheet(true),
        }}
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

      {/* Auth Drawer */}
      {isOpen && <AuthDrawer />}

      {/* Custom Follow Success Toast */}
      <FollowSuccessToast
        show={showFollowToast}
        isFollowed={isFollowing}
        onHide={() => setShowFollowToast(false)}
      />
    </div>
  );
};

export default PostDetailContent;
