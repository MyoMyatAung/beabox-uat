import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch, useStore } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import Hls from "hls.js";
import Artplayer from "artplayer";

type ArtplayerOptions = ConstructorParameters<typeof Artplayer>[0];
import {
  X,
  MoreVertical,
  Volume2,
  VolumeX,
  Heart,
  MessageCircle,
  Download,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import CommentSection, { CommentSectionProps } from "./CommentSection";
import {
  useGetGossipCommentsMutation,
  GossipComment as GossipCommentType,
  usePostGossipCommentMutation,
  gossipExternalApi,
} from "../services/gossipSlice";
import type { GossipPostListParams } from "../services/gossipSlice";
import { getDeviceInfo } from "@/lib/deviceInfo";
import LoginDrawer from "@/components/profile/auth/login-drawer";
import { useNavigate } from "react-router-dom";
import AsyncDecryptedImage from "@/utils/asyncDecryptedImage";
import { decryptImage } from "@/utils/imageDecrypt";
interface MediaItem {
  id: string;
  type: "image" | "video";
  url: string;
  download_url?: string;
  thumbnail_url?: string;
  thumbnail?: string;
}

interface CommentListApiPayload {
  data?: GossipCommentType[];
  total?: number;
  meta?: { total?: number };
  pagination?: { total?: number };
}

interface CommentListApiResponse {
  data?: CommentListApiPayload;
}

interface MediaFullscreenViewerProps {
  media: MediaItem[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  postData?: {
    like_count: number;
    comment_count: number;
    share_count: number;
    is_liked: boolean;
    post_id?: string;
    category_id?: string;
    onLike?: () => void;
    onComment?: () => void;
    onShare?: () => void;
  };
  commentSectionProps?: CommentSectionProps;
}

const MediaFullscreenViewer = ({
  media,
  initialIndex,
  isOpen,
  onClose,
  postData,
  commentSectionProps,
}: MediaFullscreenViewerProps) => {
  const user = useSelector(
    (state: { persist?: { user?: { token?: string } } }) => state?.persist?.user
  );
  const dispatch = useDispatch<AppDispatch>();
  const store = useStore<RootState>();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [showUI, setShowUI] = useState(false);
  const [showCommentSheet, setShowCommentSheet] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [videoReadyState, setVideoReadyState] = useState<
    Record<
      number,
      {
        isReady: boolean;
        isVideo: boolean;
        thumbnail?: string;
      }
    >
  >({});
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(user?.token));
  const [isLoginDrawerOpen, setIsLoginDrawerOpen] = useState(false);
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
  const slideRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const moreOptionsRef = useRef<HTMLDivElement>(null);
  const hideUITimerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollEndTimerRef = useRef<NodeJS.Timeout | null>(null);
  const playerContainerRefs = useRef<Map<number, HTMLDivElement | null>>(
    new Map()
  );
  const artPlayerRefs = useRef<Map<number, Artplayer | null>>(new Map());
  const hlsRefs = useRef<Map<number, Hls | null>>(new Map());
  const progressRefs = useRef<Map<number, number>>(new Map());
  const mp4AbortRefs = useRef<Map<number, AbortController | null>>(new Map());
  const currentIndexRef = useRef(currentIndex);
  const [videoReadyTick, setVideoReadyTick] = useState(0);
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);
  const getNearestSlideIndex = useCallback(() => {
    if (!scrollContainerRef.current || slideRefs.current.size === 0) {
      return currentIndex;
    }

    const containerRect = scrollContainerRef.current.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let closestIndex = currentIndex;
    let minDistance = Infinity;

    slideRefs.current.forEach((slide, index) => {
      const rect = slide.getBoundingClientRect();
      const slideCenter = rect.left + rect.width / 2;
      const distance = Math.abs(slideCenter - containerCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  }, [currentIndex]);

  const destroyArtplayer = useCallback((index: number) => {
    const art = artPlayerRefs.current.get(index);
    if (art) {
      const videoElement = art.video;
      try {
        art.pause();
      } catch {
        // ignore
      }
      try {
        art.destroy(false);
      } catch {
        art.destroy();
      }
      if (videoElement) {
        try {
          videoElement.pause();
          videoElement.removeAttribute("src");
          videoElement.load();
        } catch {
          // ignore cleanup errors
        }
      }
      artPlayerRefs.current.delete(index);
    }

    const hls = hlsRefs.current.get(index);
    if (hls) {
      hls.destroy();
      hlsRefs.current.delete(index);
    }

    videoRefs.current.delete(index);
    const abort = mp4AbortRefs.current.get(index);
    if (abort) {
      abort.abort();
      mp4AbortRefs.current.delete(index);
    }
    setVideoReadyState((prev) => {
      if (!prev[index]) return prev;
      const next = { ...prev };
      delete next[index];
      return next;
    });
  }, []);

  const currentMedia = media[currentIndex];
  const isVideo = currentMedia?.type === "video";
  const currentPostId = postData?.post_id;
  const syncPostListCommentCount = useCallback(
    (delta: number) => {
      if (!delta || !postData?.category_id || !currentPostId) {
        return;
      }
      const cachedArgs =
        gossipExternalApi.util.selectCachedArgsForQuery(
          store.getState(),
          "getGossipPosts"
        ) || [];
      cachedArgs.forEach((args: GossipPostListParams) => {
        if (!args?.category_id || args.category_id !== postData.category_id) {
          return;
        }
        dispatch(
          gossipExternalApi.util.updateQueryData(
            "getGossipPosts",
            args,
            (draft) => {
              const target = draft?.data?.find(
                (item) => item.id === currentPostId
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
    [currentPostId, dispatch, postData?.category_id, store]
  );

  // Comment fetching state (only used when commentSectionProps is not provided)
  const [comments, setComments] = useState<GossipCommentType[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [totalComments, setTotalComments] = useState(
    postData?.comment_count ?? 0
  );
  const [highlightCommentId, setHighlightCommentId] = useState<string | null>(
    null
  );
  const [getComments] = useGetGossipCommentsMutation();
  const [postCommentMutation] = usePostGossipCommentMutation();
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

  const sortCommentsAsc = useCallback(
    (list: GossipCommentType[]) =>
      [...list].sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      ),
    []
  );

  const normalizeComment = useCallback(
    (payload: Partial<GossipCommentType>): GossipCommentType => ({
      comment_id: payload.comment_id ?? `temp-${Date.now()}`,
      reply_id: payload.reply_id, // Preserve reply_id if it exists
      post_id: payload.post_id ?? currentPostId ?? "",
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
    [fallbackCommentUser, currentPostId]
  );

  const fetchComments = useCallback(async (): Promise<void> => {
    if (!currentPostId) return;
    setCommentsLoading(true);
    setCommentsError(null);
    try {
      const response = (await getComments({
        post_id: currentPostId,
        page: 1,
      })) as CommentListApiResponse;
      if (response?.data) {
        const payload = response.data;
        const sorted = sortCommentsAsc(payload.data ?? []);
        setComments(sorted);
        const fallbackTotal = postData?.comment_count ?? 0;
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
  }, [getComments, postData?.comment_count, currentPostId, sortCommentsAsc]);

  // Fetch comments when commentSectionProps is not provided and we have a post_id
  useEffect(() => {
    if (!commentSectionProps && currentPostId && isOpen) {
      fetchComments();
    }
  }, [commentSectionProps, currentPostId, isOpen, fetchComments]);

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

  const handleCommentSubmit = async (content: string) => {
    if (!currentPostId) return;
    const trimmed = content.trim();
    if (!trimmed) return;
    try {
      const deviceInfo = getDeviceInfo();
      const response = await postCommentMutation({
        post_id: currentPostId,
        content: trimmed,
        device: deviceInfo.deviceName,
        app_version: deviceInfo.appVersion,
      });
      const submissionType = response?.data?.data?.type ?? "comment";
      if (response?.data?.status && submissionType !== "reply") {
        syncPostListCommentCount(1);
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
    if (!currentPostId) return;
    const trimmed = content.trim();
    if (!trimmed) return;
    try {
      const deviceInfo = getDeviceInfo();
      const response = await postCommentMutation({
        post_id: currentPostId,
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

  // Build commentSectionProps from fetched data or use provided one
  const effectiveCommentSectionProps: CommentSectionProps | undefined =
    commentSectionProps ||
    (currentPostId
      ? {
          comments,
          commentCount: totalComments,
          postId: currentPostId,
          onCommentSubmit: handleCommentSubmit,
          onReplySubmit: handleReplySubmit,
          onLikeComment: handleLikeComment,
          onReportComment: handleReportComment,
          showInput: true,
          loading: commentsLoading,
          error: commentsError,
          highlightCommentId,
          onHighlightHandled: () => setHighlightCommentId(null),
        }
      : undefined);

  useEffect(() => {
    if (isOpen) {
      setIsMuted(false);
      setShowUI(!isVideo);
    } else {
      setShowCommentSheet(false);
    }
  }, [isOpen, isVideo]);

  // Ensure each time the viewer opens we start unmuted
  useEffect(() => {
    if (isOpen) {
      setIsMuted(false);
    }
  }, [isOpen]);

  // Scroll to initial index when opened
  useEffect(() => {
    if (isOpen && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const itemWidth = container.clientWidth;
      container.scrollTo({
        left: initialIndex * itemWidth,
        behavior: "smooth",
      });
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  // Handle scroll to update current index
  // Use a stable React event handler (onScroll) instead of manual addEventListener.
  // Also detect touch/pointer end to ensure we pick final slide when touch scrolling
  // stops on platforms where continuous scroll events may be sparse.
  const handleContainerScroll = useCallback(() => {
    // Pause every video immediately during swipe
    console.log("Scroll detected, pausing all videos");
    videoRefs.current.forEach((video) => {
      if (video) {
        video.pause();
      }
    });

    setIsPlaying(false);
    if (hideUITimerRef.current) {
      clearTimeout(hideUITimerRef.current);
      hideUITimerRef.current = null;
    }

    if (scrollEndTimerRef.current) {
      clearTimeout(scrollEndTimerRef.current);
    }

    scrollEndTimerRef.current = setTimeout(() => {
      const newIndex = getNearestSlideIndex();

      const current = currentIndexRef.current;
      if (newIndex !== current && newIndex >= 0 && newIndex < media.length) {
        setCurrentIndex(newIndex);
      }
    }, 150);
  }, [getNearestSlideIndex, media.length]);

  const handleInteractionEnd = useCallback(() => {
    // Some browsers may not emit a final scroll event — ensure we compute final index
    if (scrollEndTimerRef.current) {
      clearTimeout(scrollEndTimerRef.current);
    }
    const newIndex = getNearestSlideIndex();
    const current = currentIndexRef.current;
    if (newIndex !== current && newIndex >= 0 && newIndex < media.length) {
      setCurrentIndex(newIndex);
    }
  }, [getNearestSlideIndex, media.length]);

  // Reset UI visibility when media changes
  useEffect(() => {
    if (isOpen) {
      setShowUI(!isVideo);

      // Pause all videos except current (if current is video)
      videoRefs.current.forEach((video, index) => {
        if (video && index !== currentIndex) {
          video.pause();
        }
      });

      const currentVideo = videoRefs.current.get(currentIndex);
      if (isVideo && currentVideo) {
        // Sync isPlaying state with video's actual state
        setIsPlaying(!currentVideo.paused);
        setCurrentTime(currentVideo.currentTime || 0);
      } else {
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
      }
    }
  }, [currentIndex, isOpen, isVideo]);

  // Stop all videos when switching to non-video media
  useEffect(() => {
    if (!isVideo) {
      // If current media is not a video, pause all videos
      videoRefs.current.forEach((video) => {
        if (video) {
          video.pause();
        }
      });
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);

      // Clear hide UI timer
      if (hideUITimerRef.current) {
        clearTimeout(hideUITimerRef.current);
        hideUITimerRef.current = null;
      }
    }
  }, [isVideo, currentIndex]);

  // Cleanup scroll end timer on unmount
  useEffect(() => {
    return () => {
      if (scrollEndTimerRef.current) {
        clearTimeout(scrollEndTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const artMap = artPlayerRefs.current;
    const hlsMap = hlsRefs.current;
    const videoMap = videoRefs.current;
    const containerMap = playerContainerRefs.current;
    const mp4AbortMap = mp4AbortRefs.current;

    return () => {
      artMap.forEach((_, index) => {
        destroyArtplayer(index);
      });
      artMap.clear();
      hlsMap.clear();
      videoMap.clear();
      containerMap.clear();
      mp4AbortMap.forEach((controller) => controller?.abort());
      mp4AbortMap.clear();
    };
  }, [destroyArtplayer]);

  // Handle video time updates for current video
  useEffect(() => {
    if (!isVideo) return;

    const currentVideo = videoRefs.current.get(currentIndex);
    if (!currentVideo) return;

    currentVideo.play().catch(() => {
      /* ignore autoplay errors */
    });

    // Sync initial playing state
    setIsPlaying(!currentVideo.paused);

    const updateTime = () => {
      setCurrentTime(currentVideo.currentTime);
      setDuration(currentVideo.duration || 0);
      progressRefs.current.set(currentIndex, currentVideo.currentTime);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      // Hide UI after 2 seconds of playback
      if (hideUITimerRef.current) {
        clearTimeout(hideUITimerRef.current);
      }
      hideUITimerRef.current = setTimeout(() => {
        setShowUI(false);
      }, 2000);
    };

    const handlePause = () => {
      setIsPlaying(false);
      // Show UI when paused
      setShowUI(true);
      if (hideUITimerRef.current) {
        clearTimeout(hideUITimerRef.current);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(currentVideo.duration || 0);
    };

    const handlePlaying = () => {
      setIsPlaying(true);
    };

    const handleWaiting = () => {
      // Video is buffering, but still considered playing
      setIsPlaying(!currentVideo.paused);
    };

    currentVideo.addEventListener("timeupdate", updateTime);
    currentVideo.addEventListener("play", handlePlay);
    currentVideo.addEventListener("playing", handlePlaying);
    currentVideo.addEventListener("pause", handlePause);
    currentVideo.addEventListener("waiting", handleWaiting);
    currentVideo.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      currentVideo.removeEventListener("timeupdate", updateTime);
      currentVideo.removeEventListener("play", handlePlay);
      currentVideo.removeEventListener("playing", handlePlaying);
      currentVideo.removeEventListener("pause", handlePause);
      currentVideo.removeEventListener("waiting", handleWaiting);
      currentVideo.removeEventListener("loadedmetadata", handleLoadedMetadata);
      if (hideUITimerRef.current) {
        clearTimeout(hideUITimerRef.current);
      }
    };
  }, [isVideo, currentIndex, videoReadyTick]);

  useEffect(() => {
    const currentVideo = videoRefs.current.get(currentIndex);
    if (currentVideo) {
      currentVideo.muted = isMuted;
    }
  }, [isMuted, currentIndex, videoReadyTick]);

  // Close on escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Close more options popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        moreOptionsRef.current &&
        !moreOptionsRef.current.contains(event.target as Node)
      ) {
        setShowMoreOptions(false);
      }
    };

    if (showMoreOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMoreOptions]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleMediaClick = () => {
    if (isVideo) {
      const currentVideo = videoRefs.current.get(currentIndex);
      if (!currentVideo) return;

      // Always bring UI back when tapping the video
      setShowUI(true);
      if (hideUITimerRef.current) {
        clearTimeout(hideUITimerRef.current);
        hideUITimerRef.current = null;
      }

      if (currentVideo.paused) {
        currentVideo.play().catch(() => {
          /* ignore autoplay errors */
        });
        setIsPlaying(true);
        hideUITimerRef.current = setTimeout(() => {
          setShowUI(false);
        }, 2000);
      } else {
        currentVideo.pause();
        setIsPlaying(false);
        // Keep UI visible while paused so user can see controls
      }
    } else {
      // Toggle UI visibility for image
      setShowUI((prev) => !prev);
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentVideo = videoRefs.current.get(currentIndex);
    if (currentVideo) {
      currentVideo.muted = !currentVideo.muted;
      setIsMuted(currentVideo.muted);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const currentVideo = videoRefs.current.get(currentIndex);
    if (!currentVideo) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    currentVideo.currentTime = newTime;
    progressRefs.current.set(currentIndex, newTime);
  };

  const handleSaveVideo = async () => {
    setShowMoreOptions(false);
    if (!currentMedia) return;

    const downloadSource = currentMedia.download_url || currentMedia.url;

    const normalizedUrl = downloadSource.split("?")[0].toLowerCase();
    const isM3u8 = normalizedUrl.endsWith(".m3u8");
    const isMp4 = normalizedUrl.endsWith(".mp4");
    const isEncryptedImage =
      currentMedia.type === "image" && normalizedUrl.endsWith(".txt");

    // Derive filename and extension
    const deriveExtension = (mime: string | undefined, fallback: string) => {
      if (!mime) return fallback;
      if (mime.includes("jpeg")) return ".jpg";
      if (mime.includes("png")) return ".png";
      if (mime.includes("webp")) return ".webp";
      if (mime.includes("gif")) return ".gif";
      if (mime.includes("mp4")) return ".mp4";
      if (mime.includes("mpegurl") || mime.includes("m3u8")) return ".m3u8";
      return fallback;
    };

    let extension = "";
    try {
      const url = new URL(downloadSource);
      const pathname = url.pathname;
      const lastDotIndex = pathname.lastIndexOf(".");
      if (lastDotIndex !== -1) {
        extension = pathname.substring(lastDotIndex);
      }
    } catch {
      // ignore and fallback
    }
    if (!extension) {
      extension = isM3u8
        ? ".m3u8"
        : isMp4
        ? ".mp4"
        : currentMedia.type === "video"
        ? ".mp4"
        : ".jpg";
    }

    try {
      let blob: Blob;

      if (isEncryptedImage) {
        const decryptedUrl = await decryptImage(downloadSource, "");
        const imgResp = await fetch(decryptedUrl);
        blob = await imgResp.blob();
        extension = deriveExtension(blob.type, extension);
      } else {
        const response = await fetch(downloadSource, {
          credentials: "include",
        });
        blob = await response.blob();
        extension = deriveExtension(blob.type, extension);
      }

      const blobUrl = URL.createObjectURL(blob);
      const filename = `${currentMedia.type}-${currentMedia.id}${extension}`;

      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = filename;
      anchor.rel = "noreferrer";
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 1000);
    } catch (err) {
      console.error("Download failed, opening in new tab fallback:", err);
      window.open(downloadSource, "_blank");
    }
  };

  const handleReport = () => {
    setShowMoreOptions(false);
    // TODO: Implement report functionality
  };

  const attachVideoPlayer = useCallback(
    (index: number, mediaItem: MediaItem, element: HTMLDivElement | null) => {
      if (mediaItem.type !== "video") return;

      if (!element) {
        const existingElement = playerContainerRefs.current.get(index);
        const isStillInDom =
          typeof document !== "undefined" &&
          !!existingElement &&
          document.body.contains(existingElement);

        if (isStillInDom) {
          return;
        }

        playerContainerRefs.current.delete(index);
        destroyArtplayer(index);
        return;
      }

      const existingElement = playerContainerRefs.current.get(index);
      if (existingElement === element && artPlayerRefs.current.get(index)) {
        return;
      }

      playerContainerRefs.current.set(index, element);
      destroyArtplayer(index);

      const normalizedUrl = mediaItem.url.split("?")[0].toLowerCase();
      const isM3u8 = normalizedUrl.endsWith(".m3u8");
      const isMp4 = normalizedUrl.endsWith(".mp4");
      let hlsInstance: Hls | null = null;

      const typeOrder = isM3u8
        ? ["m3u8", "normal"]
        : isMp4
        ? ["mp4", "normal"]
        : ["normal"];

      const customTypeHandlers: Record<
        string,
        (video: HTMLVideoElement, url: string) => void
      > = {};

      if (isM3u8) {
        customTypeHandlers.m3u8 = (video: HTMLVideoElement, url: string) => {
          if (Hls.isSupported()) {
            const hls = new Hls({
              enableWorker: true,
              lowLatencyMode: true,
              backBufferLength: 30,
              maxBufferLength: 30,
              maxMaxBufferLength: 60,
              maxBufferSize: 50 * 1000 * 1000,
              maxBufferHole: 0.5,
              maxFragLookUpTolerance: 0.25,
              startLevel: -1,
              abrEwmaDefaultEstimate: 500000,
              abrBandWidthFactor: 0.95,
              abrBandWidthUpFactor: 0.7,
              abrMaxWithRealBitrate: true,
              startFragPrefetch: false,
              fpsDroppedMonitoringThreshold: 0.2,
              fpsDroppedMonitoringPeriod: 1000,
              capLevelToPlayerSize: true,
              initialLiveManifestSize: 1,
              stretchShortVideoTrack: true,
              forceKeyFrameOnDiscontinuity: true,
              manifestLoadingTimeOut: 10000,
              manifestLoadingMaxRetry: 3,
              manifestLoadingRetryDelay: 500,
              manifestLoadingMaxRetryTimeout: 5000,
              levelLoadingTimeOut: 10000,
              levelLoadingMaxRetry: 3,
              levelLoadingRetryDelay: 500,
              levelLoadingMaxRetryTimeout: 5000,
              fragLoadingTimeOut: 20000,
              fragLoadingMaxRetry: 6,
              fragLoadingRetryDelay: 500,
              fragLoadingMaxRetryTimeout: 5000,
            });

            hls.on(Hls.Events.ERROR, (_, data) => {
              if (!data.fatal) return;
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  hls.recoverMediaError();
                  break;
                default:
                  hls.destroy();
                  break;
              }
            });

            setVideoReadyState((prev) => ({
              ...prev,
              [index]: {
                ...(prev[index] || {
                  thumbnail: mediaItem.thumbnail_url || mediaItem.thumbnail,
                }),
                isReady: false,
                isVideo: true,
              },
            }));

            hls.loadSource(url);
            hls.attachMedia(video);
            hlsInstance = hls;
          } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.preload = "auto";
            video.src = url;
          } else {
            video.src = url;
          }
        };
      }

      if (isMp4) {
        customTypeHandlers.mp4 = (video: HTMLVideoElement, url: string) => {
          video.preload = "metadata";

          const abortController = new AbortController();
          mp4AbortRefs.current.set(index, abortController);

          const loadVideo = async () => {
            try {
              const headers = new Headers();
              headers.append("Range", "bytes=0-1048576");

              const response = await fetch(url, {
                headers,
                method: "GET",
                signal: abortController.signal,
              });

              video.src = url;
              video.preload = response.status === 206 ? "auto" : "metadata";
            } catch (error) {
              if ((error as Error).name !== "AbortError") {
                console.error("Error loading MP4:", error);
              }
              setVideoReadyState((prev) => ({
                ...prev,
                [index]: {
                  ...(prev[index] || {
                    thumbnail: mediaItem.thumbnail_url || mediaItem.thumbnail,
                  }),
                  isReady: false,
                  isVideo: true,
                },
              }));

              video.src = url;
              video.preload = "metadata";
            }
          };

          const handleCanPlayThrough = () => {
            video.preload = "auto";
          };
          const handleWaiting = () => {
            video.preload = "auto";
          };

          video.addEventListener("canplaythrough", handleCanPlayThrough);
          video.addEventListener("waiting", handleWaiting);

          loadVideo().catch(console.error);
        };
      }

      const options: ArtplayerOptions = {
        container: element,
        url: mediaItem.url,
        muted: isMuted,
        autoplay: true,
        loop: true,
        type: typeOrder[0],
        ...(Object.keys(customTypeHandlers).length > 0
          ? { customType: customTypeHandlers }
          : {}),
        moreVideoAttr: {
          playsInline: true,
          preload: "auto",
          crossOrigin: "anonymous",
        },
        icons: {
          loading: `<div style="display:none"></div>`,
          state: `<div style="display:none"></div>`,
        },
      };

      const art = new Artplayer(options);
      artPlayerRefs.current.set(index, art);

      art.on("ready", () => {
        const video = art.video;
        video.style.width = "100%";
        video.style.height = "100%";
        video.style.objectFit = "contain";
        video.style.pointerEvents = "none";

        if (hlsInstance) {
          hlsRefs.current.set(index, hlsInstance);
        }

        videoRefs.current.set(index, video);

        const savedTime = progressRefs.current.get(index);
        if (typeof savedTime === "number" && !Number.isNaN(savedTime)) {
          try {
            video.currentTime = savedTime;
          } catch {
            // ignore seeking errors
          }
        }

        video.muted = isMuted;

        setVideoReadyState((prev) => ({
          ...prev,
          [index]: {
            ...(prev[index] || {
              thumbnail: mediaItem.thumbnail_url || mediaItem.thumbnail,
            }),
            isReady: true,
            isVideo: true,
          },
        }));

        const activeIndex = currentIndexRef.current;
        if (index === activeIndex) {
          video.play().catch(() => {
            /* ignore autoplay errors */
          });
        } else {
          video.pause();
        }

        setVideoReadyTick((prev) => prev + 1);
      });

      art.on("destroy", () => {
        videoRefs.current.delete(index);
        artPlayerRefs.current.delete(index);
        const hls = hlsRefs.current.get(index);
        if (hls) {
          hls.destroy();
          hlsRefs.current.delete(index);
        }
      });
    },
    [destroyArtplayer, isMuted]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999999] bg-black flex items-center justify-center">
      {/* Media Container - Horizontal Scroll */}
      <div
        ref={scrollContainerRef}
        onScroll={handleContainerScroll}
        onTouchEnd={handleInteractionEnd}
        onPointerUp={handleInteractionEnd}
        className="relative w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {media.map((item, index) => {
          const isCurrentVideo =
            item.type === "video" && index === currentIndex;
          const isItemVideo = item.type === "video";
          // const isWithinActivationRange = Math.abs(index - currentIndex) <= 1;
          // const shouldRenderVideo = isItemVideo && isWithinActivationRange;
          const shouldRenderVideo = isItemVideo;
          const videoState = videoReadyState[index];
          const isVideoReady = !!videoState?.isReady;
          const previewThumbnail =
            videoState?.thumbnail || item.thumbnail_url || item.thumbnail;

          return (
            <div
              key={item.id}
              ref={(el) => {
                if (el) {
                  slideRefs.current.set(index, el);
                } else {
                  slideRefs.current.delete(index);
                }
              }}
              data-index={index}
              className="flex-shrink-0 w-full h-full flex items-center justify-center snap-center relative"
              onClick={handleMediaClick}
            >
              {isItemVideo ? (
                shouldRenderVideo ? (
                  <div className="relative w-full h-full">
                    {previewThumbnail && (
                      <AsyncDecryptedImage
                        imageUrl={previewThumbnail}
                        alt=""
                        className={cn(
                          "absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none",
                          isVideoReady ? "opacity-0" : "opacity-60"
                        )}
                      />
                    )}
                    <div
                      className="w-full h-full pointer-events-none relative z-10"
                      ref={(el) => attachVideoPlayer(index, item, el)}
                    />
                    {!isVideoReady && (
                      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 z-20">
                        <div className="w-10 h-10 border-2 border-white/25 border-t-white rounded-full animate-spin" />
                        <p className="text-white/80 text-xs">视频加载中...</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center bg-black">
                    {previewThumbnail ? (
                      <AsyncDecryptedImage
                        imageUrl={previewThumbnail}
                        alt=""
                        className="max-w-full max-h-full object-contain opacity-70"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-white/70 text-xs gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="48"
                          height="48"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <polygon
                            points="9 7 9 17 17 12"
                            fill="currentColor"
                          />
                          <rect
                            x="3"
                            y="5"
                            width="18"
                            height="14"
                            rx="2"
                            ry="2"
                            stroke="currentColor"
                          />
                        </svg>
                        <span>滑动播放视频</span>
                      </div>
                    )}
                    <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 rounded-full text-white text-xs">
                      视频
                    </div>
                  </div>
                )
              ) : (
                <AsyncDecryptedImage
                  imageUrl={item.url}
                  alt=""
                  className="max-w-full max-h-full object-contain"
                />
              )}

              {/* Play/Pause Overlay for Video */}
              {isCurrentVideo && showUI && isVideoReady && (
                <div className="absolute inset-0 flex items-center justify-center">
                  {!isPlaying ? (
                    <div className="z-50 w-16 h-16 bg-black/50 rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="white"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  ) : (
                    <div className="z-50 w-16 h-16 bg-black/50 rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="white"
                      >
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                      </svg>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Top Bar */}
      {showUI && (
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-30">
          <button
            onClick={onClose}
            className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="relative" ref={moreOptionsRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMoreOptions(!showMoreOptions);
              }}
              className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <MoreVertical size={20} />
            </button>

            {/* More Options Popover */}
            {showMoreOptions && (
              <div className="absolute top-12 right-0 bg-[#1E1C28] rounded-lg shadow-lg border border-[#1E1C28] min-w-32 z-50">
                <button
                  onClick={handleSaveVideo}
                  className="w-full flex items-center justify-between px-4 py-2 text-white hover:bg-[#2E2C3A] transition-colors first:rounded-t-lg"
                >
                  <span className="text-sm">保存视频</span>
                  <Download size={18} className="text-white" />
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
      )}

      {/* Bottom Bar */}
      {showUI && (
        <div className="absolute bottom-0 left-0 right-0 p-4 z-30">
          {/* Video Controls */}
          {isVideo && (
            <div className="mb-4">
              {/* Progress Bar with Time and Mute */}
              <div className="flex items-center gap-3 mb-2">
                {/* Current Time */}
                <span className="text-white text-sm min-w-[45px]">
                  {formatTime(currentTime)}
                </span>

                {/* Progress Bar with Scrubber */}
                <div
                  className="flex-1 relative h-1 bg-white/20 rounded-full cursor-pointer"
                  onClick={handleProgressClick}
                >
                  {/* Progress Fill */}
                  <div
                    className="absolute left-0 top-0 h-full bg-purple-500 rounded-full transition-all"
                    style={{
                      width:
                        duration > 0
                          ? `${(currentTime / duration) * 100}%`
                          : "0%",
                    }}
                  />
                  {/* Scrubber Indicator */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg transition-all"
                    style={{
                      left:
                        duration > 0
                          ? `calc(${(currentTime / duration) * 100}% - 6px)`
                          : "-6px",
                    }}
                  />
                </div>

                {/* Duration and Mute */}
                <div className="flex items-center gap-3">
                  <span className="text-white text-sm min-w-[45px]">
                    {formatTime(duration)}
                  </span>
                  <button
                    onClick={handleToggleMute}
                    className="w-8 h-8 flex items-center justify-center text-white hover:opacity-70 transition-opacity"
                  >
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Engagement Stats - Hide after 2 seconds for videos */}
          {postData && showUI && (
            <div className="flex items-center justify-center gap-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  postData.onLike?.();
                }}
                className="flex items-center gap-1 text-white"
              >
                <Heart
                  size={20}
                  fill={postData.is_liked ? "currentColor" : "none"}
                  className={postData.is_liked ? "text-red-500" : ""}
                />
                <span
                  className={cn(
                    "text-sm",
                    postData.is_liked ? "text-red-500" : ""
                  )}
                >
                  {postData.like_count}
                </span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (effectiveCommentSectionProps) {
                    setShowCommentSheet(true);
                  }
                  postData.onComment?.();
                }}
                className="flex items-center gap-1 text-white"
              >
                <MessageCircle size={20} />
                <span className="text-sm">{postData.comment_count}</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  postData.onShare?.();
                }}
                className="flex items-center gap-1 text-white"
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
                <span className="text-sm">{postData.share_count}</span>
              </button>
            </div>
          )}
        </div>
      )}
      {showCommentSheet && effectiveCommentSectionProps && (
        <div
          className="fixed inset-0 z-[1000000] flex items-end justify-center bg-black/60"
          onClick={() => setShowCommentSheet(false)}
        >
          <div
            className="w-full rounded-t-3xl bg-[#121016] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-white text-base">评论</span>
              <button
                onClick={() => setShowCommentSheet(false)}
                className="text-white/60 p-2 hover:text-white transition"
              >
                关闭
              </button>
            </div>
            <div className="h-[70svh] overflow-y-auto">
              <CommentSection {...effectiveCommentSectionProps} />
            </div>
          </div>
        </div>
      )}
      {showCommentSheet && !effectiveCommentSectionProps && (
        <div
          className="fixed inset-0 z-[1000000] flex items-end justify-center bg-black/60"
          onClick={() => setShowCommentSheet(false)}
        >
          <div
            className="w-full max-h-[60%] rounded-t-3xl bg-[#121016] p-6 flex flex-col items-center justify-center text-white/80"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-base mb-2">暂无评论数据</p>
            <p className="text-sm text-white/60">
              请返回帖子详情页查看完整评论
            </p>
            <button
              onClick={() => {
                setShowCommentSheet(false);
                onClose();
                postData?.onComment?.();
              }}
              className="mt-4 px-4 py-2 bg-white/10 rounded-full text-sm hover:bg-white/20 transition-colors"
            >
              返回
            </button>
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

export default MediaFullscreenViewer;
