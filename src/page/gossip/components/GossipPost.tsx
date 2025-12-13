/**
 * ============================================================================
 * GOSSIP POST COMPONENT
 * ============================================================================
 *
 * Main component for displaying a single gossip post in the feed.
 * Orchestrates all post-related functionality including:
 * - Post header (author info, badges)
 * - Post content (text with expand/collapse)
 * - Media display (images/videos with grid layout)
 * - Post actions (like, share, timestamp)
 * - Popovers (profile, more options)
 * - Fullscreen media viewer
 * - Share sheet
 *
 * This component follows the Single Responsibility Principle by delegating
 * specific concerns to specialized hooks and sub-components:
 * - Business logic → Custom hooks (usePostLike, usePostFollow, etc.)
 * - UI components → Sub-components (PostHeader, PostContent, etc.)
 * - State management → Redux + custom hooks
 *
 * PERFORMANCE OPTIMIZATIONS:
 * - Uses pooled video player system to prevent memory leaks
 * - IntersectionObserver for lazy video loading
 * - Optimistic updates for like/follow actions
 */

import { useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { User, Check, Plus } from "lucide-react";
import MediaFullscreenViewer from "./MediaFullscreenViewer";
import ImageGrid from "./ImageGrid";
import PostContent from "./PostContent";
import PostActions from "./PostActions";
import ProfilePopover from "./ProfilePopover";
import MoreOptionsPopover from "./MoreOptionsPopover";
import ShareSheet from "./ShareSheet";
import AsyncDecryptedImage from "@/utils/asyncDecryptedImage";
import {
  useUninterestGossipPostMutation,
  GossipPostUser,
} from "../services/gossipSlice";
import { showToast } from "@/page/home/services/errorSlice";
import { getErrorMessage } from "../utils/errorUtils";
import { useAuthentication } from "../hooks/useAuthentication";
import { usePostLike } from "../hooks/usePostLike";
import { usePostFollow } from "../hooks/usePostFollow";
import { usePostVideoPlayer } from "../hooks/usePostVideoPlayer";
import { usePostPopovers } from "../hooks/usePostPopovers";
import FollowSuccessToast from "./FollowSuccessToast";

// ============================================================================
// TYPES
// ============================================================================

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

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const GossipPost = ({ post }: GossipPostProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const postRef = useRef<HTMLDivElement>(null);
  const [showFollowToast, setShowFollowToast] = useState(false);

  // ============================================================================
  // AUTHENTICATION
  // ============================================================================
  const { ensureAuthenticated } = useAuthentication();

  // ============================================================================
  // POST ACTIONS - Like
  // ============================================================================
  const {
    isLiked,
    likeCount,
    isPending: isLikePending,
    handleLike,
  } = usePostLike(
    post.post_id,
    post.is_liked,
    post.like_count,
    ensureAuthenticated
  );

  // ============================================================================
  // POST ACTIONS - Follow
  // ============================================================================
  const {
    isFollowing,
    isLoading: isFollowLoading,
    handleFollow,
  } = usePostFollow(
    post.user?.id?.toString() || "",
    post.user.is_following,
    ensureAuthenticated
  );

  // ============================================================================
  // VIDEO PLAYER MANAGEMENT
  // ============================================================================
  const firstMedia = post.media && post.media.length > 0 ? post.media[0] : null;
  const isFirstVideo = firstMedia?.type === "video";
  const {
    videoContainerRef,
    isVideoReady,
    isMuted,
    handleToggleMute,
    releasePlayer,
  } = usePostVideoPlayer(post.post_id, postRef, firstMedia);

  // ============================================================================
  // POPOVER MANAGEMENT
  // ============================================================================
  const {
    showProfilePopover,
    showMoreOptionsPopover,
    toggleProfilePopover,
    toggleMoreOptionsPopover,
    closeProfilePopover,
    closeMoreOptionsPopover,
    profilePopoverRef,
    profileTriggerRef,
    moreOptionsPopoverRef,
    moreOptionsTriggerRef,
  } = usePostPopovers();

  // ============================================================================
  // FULLSCREEN MEDIA VIEWER
  // ============================================================================
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);

  // ============================================================================
  // SHARE SHEET
  // ============================================================================
  const [showShareSheet, setShowShareSheet] = useState(false);

  // ============================================================================
  // POST OPTIONS - Not Interested & Report
  // ============================================================================
  const [uninterestGossipPost, { isLoading: uninterestLoading }] =
    useUninterestGossipPostMutation();

  /**
   * Handles "Not Interested" action.
   * Removes the post from feed and shows success message.
   */
  const handleNotInterested = async (): Promise<void> => {
    closeMoreOptionsPopover();
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

  /**
   * Handles "Report" action.
   * Navigates to report page with post information.
   */
  const handleReport = (): void => {
    closeMoreOptionsPopover();
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

  /**
   * Handles "Copy Link" action.
   * Copies share link to clipboard and shows success message.
   */
  const handleCopyLink = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(post.share_link);
      closeMoreOptionsPopover();
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

  /**
   * Handles profile click - navigates to user profile page.
   */
  const handlePersonalHomepage = (): void => {
    closeProfilePopover();
    navigate(`/user/${post.user.id}`);
  };

  /**
   * Handles follow action with popover closure.
   */
  const handleFollowWithClose = async (): Promise<void> => {
    closeProfilePopover();
    await handleFollow();
  };

  /**
   * Handles media click - opens fullscreen viewer.
   * Releases video player if opening first video in fullscreen.
   */
  const handleMediaClick = useCallback(
    (index: number): void => {
      // Release player back to pool when opening fullscreen
      if (isFirstVideo && index === 0) {
        releasePlayer();
      }
      setFullscreenIndex(index);
      setIsFullscreenOpen(true);
    },
    [isFirstVideo, releasePlayer]
  );

  /**
   * Handles post content/overlay click - navigates to post detail.
   */
  const handlePostClick = (): void => {
    navigate(`/gossip/post/${post.post_id}`, { state: { post } });
  };

  return (
    <div
      ref={postRef}
      className="w-full bg-[#16131C] border-b border-white/10 pb-4"
    >
      {/* Header: Profile and More Options */}
      <div className="flex items-start justify-between px-4 pt-4 mb-3">
        <div className="flex items-start gap-3 flex-1">
          {/* Profile Picture with Popover */}
          <div className="relative" ref={profileTriggerRef}>
            <div className="cursor-pointer" onClick={toggleProfilePopover}>
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
            <ProfilePopover
              isOpen={showProfilePopover}
              isFollowing={isFollowing}
              isFollowLoading={isFollowLoading}
              popoverRef={profilePopoverRef}
              onPersonalHomepage={handlePersonalHomepage}
              onFollow={handleFollowWithClose}
            />
          </div>

          {/* Username and Badges */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span
                className="text-white font-medium text-sm cursor-pointer"
                onClick={toggleProfilePopover}
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
          </div>
        </div>

        {/* More Options with Popover */}
        <div className="relative">
          <button
            ref={moreOptionsTriggerRef}
            onClick={toggleMoreOptionsPopover}
            className="text-white"
            aria-label="More options"
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
          <MoreOptionsPopover
            isOpen={showMoreOptionsPopover}
            isNotInterestedLoading={uninterestLoading}
            popoverRef={moreOptionsPopoverRef}
            onCopyLink={handleCopyLink}
            onNotInterested={handleNotInterested}
            onReport={handleReport}
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="pl-14">
        {/* Post Content Text */}
        <PostContent content={post.content} onClick={handlePostClick} />

        {/* Media Grid */}
        {post.media && post.media.length > 0 && (
          <ImageGrid
            media={post.media || []}
            onMediaClick={handleMediaClick}
            videoContainerRef={videoContainerRef}
            isFirstVideo={isFirstVideo}
            isVideoReady={isVideoReady}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onOverlayClick={handlePostClick}
          />
        )}

        {/* Interaction Buttons and Timestamp */}
        <PostActions
          isLiked={isLiked}
          likeCount={likeCount}
          isLikePending={isLikePending}
          shareCount={post.share_count}
          timeAgo={post.time_ago}
          onLike={handleLike}
          onShare={() => setShowShareSheet(true)}
        />
      </div>

      {/* Fullscreen Media Viewer */}
      <MediaFullscreenViewer
        media={post.media}
        initialIndex={fullscreenIndex}
        isOpen={isFullscreenOpen}
        onClose={() => setIsFullscreenOpen(false)}
        initialMuted={isMuted}
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
      <ShareSheet
        isOpen={showShareSheet}
        shareUrl={post.share_link}
        onClose={() => setShowShareSheet(false)}
      />

      <FollowSuccessToast
        show={showFollowToast}
        isFollowed={isFollowing}
        onHide={() => setShowFollowToast(false)}
      />
    </div>
  );
};

export default GossipPost;
