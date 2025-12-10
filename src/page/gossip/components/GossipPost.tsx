import {
  Plus,
  PlusCircle,
  User,
  Link,
  HeartOff,
  AlertTriangle,
  Volume2,
  VolumeX,
  Check,
  Minus,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MediaFullscreenViewer from "./MediaFullscreenViewer";
import SharePost from "./SharePost";
import {
  useLikeGossipPostMutation,
  useUnlikeGossipPostMutation,
  useUninterestGossipPostMutation,
  useFollowGossipUserMutation,
  GossipPostUser,
} from "../services/gossipSlice";
import { showToast } from "@/page/home/services/errorSlice";
import type { RootState } from "@/store/store";
import LoginDrawer from "@/components/profile/auth/login-drawer";
import AsyncDecryptedImage from "@/utils/asyncDecryptedImage";
import { getPlayerManager } from "../services/playerManager";

interface MediaItem {
  id: string;
  type: "image" | "video";
  url: string;
  download_url?: string;
  thumbnail_url?: string;
  thumbnail?: string;
}

interface Post {
  post_id: string;
  category_id?: string;
  user: GossipPostUser;
  content: string;
  media: MediaItem[];
  like_count: number;
  comment_count: number;
  share_count: number;
  is_liked: boolean;
  created_at: string;
  share_link: string;
  time_ago: string;
}

interface GossipPostProps {
  post: Post;
}

const GossipPost = ({ post }: GossipPostProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.persist?.user);
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(user?.token));
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [likeCount, setLikeCount] = useState(post.like_count);
  const [pendingLike, setPendingLike] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [showMoreOptionsPopover, setShowMoreOptionsPopover] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [isLoginDrawerOpen, setIsLoginDrawerOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const moreOptionsRef = useRef<HTMLButtonElement>(null);
  const moreOptionsPopoverRef = useRef<HTMLDivElement>(null);
  const postRef = useRef<HTMLDivElement>(null);

  // ============================================================================
  // POOLED VIDEO PLAYER - Memory Management
  // ============================================================================
  // Instead of creating a <video> element per post, we use the global player pool.
  // The pool maintains at most 3 player instances, recycling them as posts scroll.
  // This prevents memory leaks from accumulating video elements during fast scroll.
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const playerManager = getPlayerManager();

  const shouldExpand = post.content.length > 100;

  const [likePost] = useLikeGossipPostMutation();
  const [unlikePost] = useUnlikeGossipPostMutation();
  const [uninterestGossipPost, { isLoading: uninterestLoading }] =
    useUninterestGossipPostMutation();

  const [followGossipUser, { isLoading: followLoading }] =
    useFollowGossipUserMutation();

  // Update authentication state when user changes
  useEffect(() => {
    const authenticated = Boolean(user?.token);
    setIsAuthenticated(authenticated);
  }, [user?.token]);

  const ensureAuthenticated = () => {
    if (isAuthenticated) {
      return true;
    }
    setIsLoginDrawerOpen(true);
    return false;
  };

  const getErrorMessage = (error: unknown) => {
    if (typeof error === "string") {
      return error;
    }
    if (error && typeof error === "object") {
      const maybeError = error as {
        data?: { message?: string };
        error?: string;
        message?: string;
      };
      if (
        maybeError.data &&
        typeof maybeError.data === "object" &&
        "message" in maybeError.data &&
        maybeError.data.message
      ) {
        return maybeError.data.message;
      }
      if (typeof maybeError.message === "string" && maybeError.message) {
        return maybeError.message;
      }
      if (typeof maybeError.error === "string" && maybeError.error) {
        return maybeError.error;
      }
    }
    return "操作失败，请稍后再试";
  };

  const handleLike = async () => {
    if (!ensureAuthenticated()) {
      return;
    }

    if (pendingLike) return;
    const nextLiked = !isLiked;
    const delta = nextLiked ? 1 : -1;
    setIsLiked(nextLiked);
    setLikeCount((prev) => Math.max(0, prev + delta));
    setPendingLike(true);
    try {
      if (nextLiked) {
        await likePost({ post_id: post.post_id }).unwrap();
      } else {
        await unlikePost({ post_id: post.post_id }).unwrap();
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
      setIsLiked(!nextLiked);
      setLikeCount((prev) => Math.max(0, prev - delta));
    } finally {
      setPendingLike(false);
    }
  };

  const handleProfileClick = () => {
    setShowPopover(!showPopover);
  };

  const handlePersonalHomepage = () => {
    setShowPopover(false);
    navigate(`/user/${post.user.id}`);
  };

  const handleFollow = async () => {
    setShowPopover(false);
    if (!ensureAuthenticated()) {
      return;
    }
    const response = await followGossipUser({
      follow_user_id: post.user?.id?.toString() || "",
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

  const handleMoreOptionsClick = () => {
    setShowMoreOptionsPopover(!showMoreOptionsPopover);
  };

  const handleCopyLink = async (shareLink: string) => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setShowMoreOptionsPopover(false);
      dispatch(
        showToast({
          message: "链接已复制",
          type: "success",
        })
      );
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleNotInterested = async () => {
    setShowMoreOptionsPopover(false);
    if (uninterestLoading) return;
    if (!ensureAuthenticated()) {
      return;
    }
    try {
      const response = await uninterestGossipPost({
        post_id: post.post_id,
        category_id: post.category_id,
      }).unwrap();
      dispatch(
        showToast({
          message: response?.message || "将为您减少类似内容",
          type: "success",
        })
      );
    } catch (error) {
      dispatch(
        showToast({
          message: getErrorMessage(error),
          type: "error",
        })
      );
    }
  };

  const handleReport = () => {
    setShowMoreOptionsPopover(false);
    if (!ensureAuthenticated()) {
      return;
    }
    // Small delay to ensure Redux persist has flushed the state
    setTimeout(() => {
      navigate(`/gossip/reports/${post.post_id}`, {
        state: { categoryId: post.category_id },
      });
    }, 150);
  };

  // ============================================================================
  // MUTE TOGGLE - Uses global player manager for consistent mute state
  // ============================================================================
  const handleToggleMute = useCallback(() => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    playerManager.setGlobalMuted(newMuted);
  }, [isMuted, playerManager]);

  const handleMediaClick = (index: number) => {
    // Pause the auto-playing video if it's the first video
    if (isFirstVideo && index === 0) {
      // Release player back to pool when opening fullscreen
      playerManager.releasePlayer(`gossip-post-${post.post_id}`, false);
    }
    setFullscreenIndex(index);
    setIsFullscreenOpen(true);
  };

  const firstMedia = post.media && post.media.length > 0 ? post.media[0] : null;
  const isFirstVideo = firstMedia?.type === "video";

  // ============================================================================
  // POOLED PLAYER LIFECYCLE - IntersectionObserver with Player Pool
  // ============================================================================
  // This effect manages the player pool integration:
  // 1. When post becomes visible (>50% in viewport), request a player from pool
  // 2. When post goes off-screen, release player back to pool for recycling
  // 3. Pool automatically limits to 3 active players, preventing memory growth
  //
  // NOTE: We use a ref for muted state to avoid re-creating the observer when
  // mute changes. The observer only needs to be set up once per post.
  const isMutedRef = useRef(isMuted);
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Store firstMedia URL in a ref to avoid effect re-runs on object reference changes
  const firstMediaUrlRef = useRef(firstMedia?.url);
  useEffect(() => {
    firstMediaUrlRef.current = firstMedia?.url;
  }, [firstMedia?.url]);

  useEffect(() => {
    if (!isFirstVideo || !postRef.current || !videoContainerRef.current) return;
    if (!firstMedia?.url) return;

    const postElement = postRef.current;
    const container = videoContainerRef.current;
    const playerId = `gossip-post-${post.post_id}`;
    const mediaUrl = firstMedia.url;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isVisible =
            entry.isIntersecting && entry.intersectionRatio > 0.5;

          if (isVisible) {
            // ============================================================
            // MEMORY MANAGEMENT: Request player from pool when visible
            // Pool will recycle oldest inactive player if at capacity
            // ============================================================
            const player = playerManager.requestPlayer(
              playerId,
              container,
              mediaUrl,
              {
                autoplay: true,
                muted: isMutedRef.current, // Use ref to get current value
                loop: true,
                onReady: () => {
                  setIsVideoReady(true);
                },
                onError: (err: Error) => {
                  console.error("Error with pooled video player:", err);
                },
              },
              false // not fullscreen
            );

            if (player) {
              // Pause all other feed players to save resources
              playerManager.pauseAllExcept(playerId, false);
            }
          } else {
            // ============================================================
            // MEMORY MANAGEMENT: Release player when off-screen
            // Player is paused and marked inactive for recycling
            // ============================================================
            playerManager.releasePlayer(playerId, false);
            setIsVideoReady(false);
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the post is visible
        rootMargin: "0px",
      }
    );

    observer.observe(postElement);

    // ============================================================
    // CLEANUP: Release player on unmount to prevent leaks
    // ============================================================
    return () => {
      observer.disconnect();
      playerManager.releasePlayer(playerId, false);
    };
    // Dependencies: Only re-run when post identity changes, not on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFirstVideo, post.post_id, playerManager]);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Profile popover
      if (
        popoverRef.current &&
        profileRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowPopover(false);
      }

      // More options popover
      if (
        moreOptionsPopoverRef.current &&
        moreOptionsRef.current &&
        !moreOptionsPopoverRef.current.contains(event.target as Node) &&
        !moreOptionsRef.current.contains(event.target as Node)
      ) {
        setShowMoreOptionsPopover(false);
      }
    };

    if (showPopover || showMoreOptionsPopover) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopover, showMoreOptionsPopover]);

  useEffect(() => {
    setIsFollowing(post.user.is_following || false);
  }, [post.user.is_following]);

  return (
    <div
      ref={postRef}
      className="w-full bg-[#16131C] border-b border-white/10 pb-4"
    >
      {/* Header: Profile and More Options */}
      <div className="flex items-start justify-between px-4 pt-4 mb-3">
        <div className="flex items-start gap-3 flex-1">
          {/* Profile Picture with Follow Button */}
          <div className="relative" ref={profileRef}>
            <div className="cursor-pointer" onClick={handleProfileClick}>
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
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center border-2 border-black cursor-pointer">
                {isFollowing ? (
                  <Check size={14} className="text-white" />
                ) : (
                  <Plus size={14} className="text-white" />
                )}
              </div>
            </div>

            {/* Popover */}
            {showPopover && (
              <div
                ref={popoverRef}
                className="absolute top-12 left-0 z-50 bg-[#1E1C28] rounded-lg shadow-lg border border-[#1E1C28] min-w-32"
              >
                <button
                  onClick={handlePersonalHomepage}
                  className="w-full flex items-center justify-between px-4 py-2 text-white hover:bg-[#2E2C3A] transition-colors first:rounded-t-lg"
                >
                  <span className="text-sm">个人主页</span>
                  <User size={18} className="text-white" />
                </button>
                <hr className="border-white/10" />
                <button
                  onClick={handleFollow}
                  disabled={followLoading}
                  className="w-full px-4 py-2 text-white hover:bg-[#2E2C3A] transition-colors last:rounded-b-lg"
                >
                  {isFollowing ? (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm">已关注</span>
                      <Minus size={18} className="text-white" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm">关注</span>
                      <PlusCircle size={18} className="text-white" />
                    </div>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Username and Badges */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span
                className="text-white font-medium text-sm"
                onClick={handleProfileClick}
              >
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
                className="!w-10 !h-5 object-contain"
              />
            )}

            {/* Content Text */}
            <div className="mb-3">
              <p
                onClick={() =>
                  navigate(`/gossip/post/${post.post_id}`, { state: { post } })
                }
                className={`text-white text-sm leading-relaxed cursor-pointer transition-colors ${
                  shouldExpand && !isExpanded ? "line-clamp-3" : ""
                }`}
              >
                {post.content}
              </p>
              {shouldExpand && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-purple-400 text-sm mt-1"
                >
                  {isExpanded ? "收起" : "展开"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* More Options */}
        <div className="relative">
          <button
            ref={moreOptionsRef}
            onClick={handleMoreOptionsClick}
            className="text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>

          {/* More Options Popover */}
          {showMoreOptionsPopover && (
            <div
              ref={moreOptionsPopoverRef}
              className="absolute top-8 right-0 z-50 bg-[#1E1C28] rounded-lg shadow-lg border border-[#1E1C28] min-w-32"
            >
              <button
                onClick={() => handleCopyLink(post.share_link)}
                className="w-full flex items-center justify-between px-4 py-2 text-white hover:bg-[#2E2C3A] transition-colors first:rounded-t-lg"
              >
                <span className="text-sm">复制链接</span>
                <Link size={18} className="text-white" />
              </button>
              <hr className="border-white/10" />
              <button
                onClick={handleNotInterested}
                className="w-full flex items-center justify-between px-4 py-2 text-white hover:bg-[#2E2C3A] transition-colors"
              >
                <span className="text-sm">不感兴趣</span>
                <HeartOff size={18} className="text-white" />
              </button>
              <hr className="border-white/10" />
              <button
                onClick={handleReport}
                className="w-full flex items-center justify-between px-4 py-2 text-white hover:bg-[#2E2C3A] transition-colors last:rounded-b-lg"
              >
                <span className="text-sm">举报</span>
                <AlertTriangle size={18} className="text-white" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="pl-14">
        {/* Media: Horizontal Scroll */}
        {post.media && post.media.length > 0 && (
          <div className="px-3 mb-3">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {post.media.map((item, index) => (
                <div
                  key={item.id || item.url || item.download_url || index}
                  onClick={() => handleMediaClick(index)}
                  className="flex-shrink-0 w-[190px] h-[240px] rounded-lg overflow-hidden bg-gray-900 relative cursor-pointer"
                >
                  {item.type === "image" ? (
                    <AsyncDecryptedImage
                      imageUrl={item.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : index === 0 && isFirstVideo ? (
                    <div className="relative w-full h-full">
                      {/* ============================================================
                          POOLED VIDEO CONTAINER
                          ============================================================
                          This div serves as the mount point for the pooled Artplayer.
                          The player is managed by playerManager and attached/detached
                          based on visibility. This prevents creating N video elements
                          for N posts - instead we reuse at most 3 players.
                          ============================================================ */}
                      <div
                        ref={videoContainerRef}
                        className="w-full h-full"
                        style={{ pointerEvents: "none" }}
                      />
                      {/* Loading indicator while player initializes */}
                      {!isVideoReady && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        </div>
                      )}
                      {/* Mute/Unmute Button */}
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
        {/* Interaction Buttons and Timestamp */}
        <div className="px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Like Button */}
            <button
              onClick={handleLike}
              disabled={pendingLike}
              aria-pressed={isLiked}
              className={`flex items-center gap-1 transition-colors ${
                isLiked ? "text-[#F70F2D]" : "text-white"
              } ${pendingLike ? "opacity-60" : ""}`}
            >
              {isLiked ? (
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

              {likeCount > 0 && <span className="text-sm">{likeCount}</span>}
            </button>

            {/* Comment Button */}
            {/* <button
              className="flex items-center gap-1 text-white transition-colors"
              onClick={() => {
                navigate(`/gossip/post/${post.post_id}`, {
                  state: { post },
                });
              }}
            >
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
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              {post.comment_count > 0 && (
                <span className="text-sm">{post.comment_count}</span>
              )}
            </button> */}

            {/* Share Button */}
            <button
              className="flex items-center gap-1 text-white transition-colors"
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
                  stroke-width="1.5"
                />
              </svg>

              {post.share_count > 0 && (
                <span className="text-sm">{post.share_count}</span>
              )}
            </button>
          </div>

          {/* Timestamp */}
          <span className="text-gray-500 text-xs">{post.time_ago}</span>
        </div>
      </div>
      {/* Fullscreen Media Viewer */}
      <MediaFullscreenViewer
        media={post.media}
        initialIndex={fullscreenIndex}
        isOpen={isFullscreenOpen}
        onClose={() => setIsFullscreenOpen(false)}
        postData={{
          post_id: post.post_id,
          like_count: likeCount,
          comment_count: post.comment_count,
          share_count: post.share_count,
          is_liked: isLiked,
          share_link: post.share_link,
          onLike: handleLike,
          onComment: () => {},
          onShare: () => {
            // TODO: Implement share functionality
          },
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
              <div className="h-1 w-12 bg-gray-300 rounded-full" />
            </div>
            <SharePost
              shareUrl={post.share_link}
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

export default GossipPost;
