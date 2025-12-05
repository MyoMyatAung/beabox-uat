import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { ThumbsUp, SendHorizonal, User } from "lucide-react";
import {
  useGetGossipRepliesMutation,
  GossipComment as GossipCommentType,
} from "../services/gossipSlice";

interface ReplyListApiResponse {
  data?: {
    data?: GossipCommentType[];
  };
}

export interface CommentSectionProps {
  comments: GossipCommentType[];
  commentCount: number;
  postId?: string;
  onCommentSubmit?: (content: string) => void;
  onReplySubmit?: (commentId: string, content: string) => void;
  onLikeComment?: (commentId: string) => void;
  onReportComment?: (commentId: string) => void;
  showInput?: boolean;
  loading?: boolean;
  error?: string | null;
  highlightCommentId?: string | null;
  onHighlightHandled?: () => void;
  autoExpandCommentId?: string | null;
  onAutoExpandHandled?: () => void;
}

const sortByCreatedAtAsc = <T extends { created_at: string }>(
  list: T[] | undefined
): T[] => {
  if (!list) return [];
  return [...list].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
};

const CommentSkeleton = () => (
  <div className="px-4 py-3 animate-pulse">
    <div className="flex gap-3">
      <div className="w-8 h-8 bg-white/10 rounded-full" />
      <div className="flex-1 space-y-3">
        <div className="w-24 h-3 bg-white/10 rounded-lg" />
        <div className="w-full h-3 bg-white/5 rounded-lg" />
        <div className="w-3/4 h-3 bg-white/5 rounded-lg" />
        <div className="w-20 h-3 bg-white/5 rounded-lg" />
      </div>
    </div>
  </div>
);

const CommentSection = ({
  comments,
  commentCount,
  onCommentSubmit,
  onReplySubmit,
  onLikeComment,
  onReportComment,
  showInput = true,
  loading = false,
  error = null,
  highlightCommentId = null,
  onHighlightHandled,
  autoExpandCommentId = null,
  onAutoExpandHandled,
}: CommentSectionProps) => {
  const commentInputRef = useRef<HTMLInputElement | null>(null);

  const user = useSelector(
    (state: { persist?: { user?: { token?: string } } }) => state?.persist?.user
  );
  const [expandedReplies, setExpandedReplies] = useState<{
    [key: string]: boolean;
  }>({});
  const [commentContent, setCommentContent] = useState("");
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>(
    {}
  );
  const [showReplyInput, setShowReplyInput] = useState<{
    [key: string]: boolean;
  }>({});
  const [repliesCache, setRepliesCache] = useState<
    Record<string, GossipCommentType[]>
  >({});
  const [replyLoading, setReplyLoading] = useState<Record<string, boolean>>({});
  const replyInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [fetchReplies] = useGetGossipRepliesMutation();

  useEffect(() => {
    if (!highlightCommentId) return;
    const element = document.getElementById(`comment-${highlightCommentId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.classList.add("animate-pulse");
      const timer = setTimeout(() => {
        element.classList.remove("animate-pulse");
        onHighlightHandled?.();
      }, 2000);
      return () => {
        clearTimeout(timer);
        element.classList.remove("animate-pulse");
      };
    } else {
      onHighlightHandled?.();
    }
  }, [highlightCommentId, onHighlightHandled]);

  useEffect(() => {
    setTimeout(() => {
      commentInputRef.current?.focus();
    }, 300);
  }, []);

  const focusReplyInput = (commentId: string) => {
    const focus = () => {
      replyInputRefs.current[commentId]?.focus();
    };
    if (typeof window !== "undefined" && window.requestAnimationFrame) {
      window.requestAnimationFrame(focus);
    } else {
      setTimeout(focus, 0);
    }
  };

  const formatFullTime = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleCommentSubmit = () => {
    if (commentContent.trim() && onCommentSubmit) {
      onCommentSubmit(commentContent);
      setCommentContent("");
    }
  };

  const handleReplySubmit = (commentId: string) => {
    const content = replyContent[commentId];
    if (content?.trim() && onReplySubmit) {
      onReplySubmit(commentId, content);
      setReplyContent((prev) => ({ ...prev, [commentId]: "" }));
      setShowReplyInput((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  const loadReplies = useCallback(
    async (commentId: string, lastReplyId: string | null) => {
      setReplyLoading((prev) => ({ ...prev, [commentId]: true }));
      try {
        const response = (await fetchReplies({
          comment_id: commentId,
          last_reply_id: lastReplyId,
        })) as ReplyListApiResponse;
        if (response?.data) {
          const items = sortByCreatedAtAsc(response.data.data);
          setRepliesCache((prev) => ({ ...prev, [commentId]: items }));
        }
      } catch (err) {
        console.error("Failed to fetch replies:", err);
      } finally {
        setReplyLoading((prev) => ({ ...prev, [commentId]: false }));
      }
    },
    [fetchReplies]
  );

  const toggleReplies = async (commentId: string) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));

    const willExpand = !expandedReplies[commentId];
    const hasCachedReplies =
      repliesCache[commentId] && repliesCache[commentId].length > 0;
    const commentHasEmbeddedReplies =
      comments.find((comment) => comment.comment_id === commentId)?.replies
        ?.list.length ?? 0;

    if (
      willExpand &&
      !hasCachedReplies &&
      commentHasEmbeddedReplies === 0 &&
      !replyLoading[commentId]
    ) {
      await loadReplies(commentId, null);
    }
  };

  const toggleReplyInput = (commentId: string) => {
    setShowReplyInput((prev) => {
      const nextState = !prev[commentId];
      if (nextState) {
        focusReplyInput(commentId);
      }
      return {
        ...prev,
        [commentId]: nextState,
      };
    });
  };

  useEffect(() => {
    if (!autoExpandCommentId) return;
    setExpandedReplies((prev) => ({
      ...prev,
      [autoExpandCommentId]: true,
    }));
    const cachedCount =
      repliesCache[autoExpandCommentId]?.length ??
      comments.find((c) => c.comment_id === autoExpandCommentId)?.replies?.list
        .length ??
      0;
    if (cachedCount === 0 && !replyLoading[autoExpandCommentId]) {
      loadReplies(autoExpandCommentId, null);
    }
    onAutoExpandHandled?.();
  }, [
    autoExpandCommentId,
    comments,
    loadReplies,
    onAutoExpandHandled,
    repliesCache,
    replyLoading,
  ]);

  return (
    <div className="w-full h-full flex flex-col bg-transparent relative">
      {/* Comment Count Header */}
      <div className="px-4 py-3">
        <h3 className="text-white text-sm font-medium">{commentCount}条评论</h3>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto pb-20">
        {loading ? (
          <div>
            {Array.from({ length: 4 }).map((_, idx) => (
              <CommentSkeleton key={idx} />
            ))}
          </div>
        ) : error ? (
          <div className="px-4 py-8 text-center">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="px-4 py-8 text-center h-[35svh]">
            <span className="mx-auto inline-block mt-10">
              <svg
                width="37"
                height="36"
                viewBox="0 0 37 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <mask
                  id="path-1-outside-1_1426_25152"
                  maskUnits="userSpaceOnUse"
                  x="-0.5"
                  y="-0.5"
                  width="38"
                  height="36"
                  fill="black"
                >
                  <rect fill="white" x="-0.5" y="-0.5" width="38" height="36" />
                  <path d="M18.3281 1.5C27.622 1.5 35.156 7.95773 35.1562 15.9238C35.1562 18.0688 34.6086 20.1039 33.6289 21.9336C33.6221 21.9509 33.6174 21.9692 33.6094 21.9863C31.8041 25.8548 28.7987 29.0376 25.04 31.0615L20.8232 33.332C19.763 33.9029 18.4962 33.0552 18.6201 31.8574L18.7764 30.3428C18.6275 30.3461 18.478 30.3486 18.3281 30.3486C9.03419 30.3486 1.5 23.8901 1.5 15.9238C1.50026 7.95778 9.03436 1.50008 18.3281 1.5ZM9.67383 14.001C8.34611 14.001 7.26953 15.0776 7.26953 16.4053C7.26965 17.7329 8.34619 18.8096 9.67383 18.8096C11.0014 18.8095 12.078 17.7329 12.0781 16.4053C12.0781 15.0776 11.0015 14.001 9.67383 14.001ZM18.3281 14.001C17.0005 14.0011 15.9238 15.0776 15.9238 16.4053C15.9239 17.7328 17.0006 18.8095 18.3281 18.8096C19.6558 18.8096 20.7323 17.7329 20.7324 16.4053C20.7324 15.0776 19.6558 14.001 18.3281 14.001ZM26.9824 14.001C25.6549 14.0012 24.5791 15.0777 24.5791 16.4053C24.5792 17.7327 25.655 18.8093 26.9824 18.8096C28.3101 18.8096 29.3866 17.7329 29.3867 16.4053C29.3867 15.0776 28.3101 14.001 26.9824 14.001Z" />
                </mask>
                <path
                  d="M18.3281 1.5V0H18.3281L18.3281 1.5ZM35.1562 15.9238H36.6562V15.9238L35.1562 15.9238ZM33.6289 21.9336L32.3066 21.2255L32.2654 21.3024L32.2334 21.3836L33.6289 21.9336ZM33.6094 21.9863L34.9687 22.6207L34.9687 22.6206L33.6094 21.9863ZM25.04 31.0615L25.7512 32.3822L25.7512 32.3822L25.04 31.0615ZM20.8232 33.332L20.1121 32.0113L20.1121 32.0113L20.8232 33.332ZM18.6201 31.8574L20.1122 32.0118L20.1122 32.0113L18.6201 31.8574ZM18.7764 30.3428L20.2684 30.4967L20.443 28.8051L18.7428 28.8431L18.7764 30.3428ZM18.3281 30.3486L18.3281 31.8486H18.3281V30.3486ZM1.5 15.9238L0 15.9238V15.9238H1.5ZM9.67383 14.001L9.67388 12.501H9.67383V14.001ZM7.26953 16.4053H5.76953V16.4054L7.26953 16.4053ZM9.67383 18.8096V20.3096H9.67388L9.67383 18.8096ZM12.0781 16.4053L13.5781 16.4054V16.4053H12.0781ZM18.3281 14.001V12.501H18.328L18.3281 14.001ZM15.9238 16.4053H14.4238V16.4054L15.9238 16.4053ZM18.3281 18.8096L18.328 20.3096H18.3281V18.8096ZM20.7324 16.4053L22.2324 16.4054V16.4053H20.7324ZM26.9824 14.001V12.501H26.9822L26.9824 14.001ZM24.5791 16.4053H23.0791V16.4054L24.5791 16.4053ZM26.9824 18.8096L26.9822 20.3096H26.9824V18.8096ZM29.3867 16.4053L30.8867 16.4054V16.4053H29.3867ZM18.3281 1.5V3C27.0188 3 33.656 8.99476 33.6562 15.9239L35.1562 15.9238L36.6562 15.9238C36.656 6.9207 28.2251 0 18.3281 0V1.5ZM35.1562 15.9238H33.6562C33.6562 17.8083 33.1762 19.6015 32.3066 21.2255L33.6289 21.9336L34.9513 22.6417C36.0411 20.6064 36.6562 18.3293 36.6562 15.9238H35.1562ZM33.6289 21.9336L32.2334 21.3836C32.2206 21.4159 32.2113 21.4426 32.2063 21.4569C32.2038 21.4641 32.2017 21.4704 32.2008 21.473C32.1995 21.4771 32.1998 21.476 32.2 21.4755C32.2006 21.4737 32.2055 21.4592 32.213 21.4396C32.2207 21.4193 32.233 21.3887 32.2501 21.3521L33.6094 21.9863L34.9687 22.6206C34.9898 22.5753 35.0056 22.5361 35.0167 22.507C35.0275 22.4786 35.0356 22.4552 35.0392 22.4446C35.0409 22.4396 35.0427 22.4341 35.0429 22.4337C35.0435 22.4319 35.0429 22.4337 35.0419 22.4365C35.04 22.442 35.0338 22.4599 35.0245 22.4836L33.6289 21.9336ZM33.6094 21.9863L32.2501 21.352C30.5814 24.9279 27.8033 27.87 24.3289 29.7408L25.04 31.0615L25.7512 32.3822C29.7942 30.2052 33.0268 26.7817 34.9687 22.6207L33.6094 21.9863ZM25.04 31.0615L24.3289 29.7408L20.1121 32.0113L20.8232 33.332L21.5344 34.6527L25.7512 32.3822L25.04 31.0615ZM20.8232 33.332L20.1121 32.0113L20.1122 32.0118L18.6201 31.8574L17.1281 31.7031C16.8802 34.0993 19.4145 35.7942 21.5344 34.6527L20.8232 33.332ZM18.6201 31.8574L20.1122 32.0113L20.2684 30.4967L18.7764 30.3428L17.2843 30.1889L17.128 31.7035L18.6201 31.8574ZM18.7764 30.3428L18.7428 28.8431C18.5987 28.8464 18.4618 28.8486 18.3281 28.8486V30.3486V31.8486C18.4941 31.8486 18.6562 31.8458 18.81 31.8424L18.7764 30.3428ZM18.3281 30.3486L18.3281 28.8486C9.63745 28.8486 3 22.8531 3 15.9238H1.5H0C0 24.927 8.43094 31.8486 18.3281 31.8486L18.3281 30.3486ZM1.5 15.9238L3 15.9239C3.00023 8.99481 9.63752 3.00007 18.3281 3L18.3281 1.5L18.3281 0C8.43119 7.99894e-05 0.000297666 6.92074 0 15.9238L1.5 15.9238ZM9.67383 14.001V12.501C7.51769 12.501 5.76953 14.2491 5.76953 16.4053H7.26953H8.76953C8.76953 15.906 9.17454 15.501 9.67383 15.501V14.001ZM7.26953 16.4053L5.76953 16.4054C5.76972 18.5612 7.51763 20.3096 9.67383 20.3096V18.8096V17.3096C9.17475 17.3096 8.76958 16.9046 8.76953 16.4051L7.26953 16.4053ZM9.67383 18.8096L9.67388 20.3096C11.8299 20.3095 13.5779 18.5612 13.5781 16.4054L12.0781 16.4053L10.5781 16.4051C10.5781 16.9045 10.1729 17.3096 9.67377 17.3096L9.67383 18.8096ZM12.0781 16.4053H13.5781C13.5781 14.2491 11.8299 12.5011 9.67388 12.501L9.67383 14.001L9.67377 15.501C10.1731 15.501 10.5781 15.9061 10.5781 16.4053H12.0781ZM18.3281 14.001L18.328 12.501C16.1721 12.5011 14.4238 14.2491 14.4238 16.4053H15.9238H17.4238C17.4238 15.9061 17.8288 15.501 18.3282 15.501L18.3281 14.001ZM15.9238 16.4053L14.4238 16.4054C14.424 18.5613 16.1721 20.3094 18.328 20.3096L18.3281 18.8096L18.3282 17.3096C17.829 17.3095 17.4239 16.9044 17.4238 16.4051L15.9238 16.4053ZM18.3281 18.8096V20.3096C20.4843 20.3096 22.2322 18.5612 22.2324 16.4054L20.7324 16.4053L19.2324 16.4051C19.2324 16.9046 18.8272 17.3096 18.3281 17.3096V18.8096ZM20.7324 16.4053H22.2324C22.2324 14.2491 20.4843 12.501 18.3281 12.501V14.001V15.501C18.8274 15.501 19.2324 15.906 19.2324 16.4053H20.7324ZM26.9824 14.001L26.9822 12.501C24.8259 12.5013 23.0791 14.2498 23.0791 16.4053H24.5791H26.0791C26.0791 15.9056 26.4839 15.5011 26.9827 15.501L26.9824 14.001ZM24.5791 16.4053L23.0791 16.4054C23.0793 18.5605 24.8258 20.3092 26.9822 20.3096L26.9824 18.8096L26.9827 17.3096C26.4841 17.3095 26.0791 16.905 26.0791 16.4051L24.5791 16.4053ZM26.9824 18.8096V20.3096C29.1386 20.3096 30.8865 18.5612 30.8867 16.4054L29.3867 16.4053L27.8867 16.4051C27.8867 16.9046 27.4815 17.3096 26.9824 17.3096V18.8096ZM29.3867 16.4053H30.8867C30.8867 14.2491 29.1386 12.501 26.9824 12.501V14.001V15.501C27.4817 15.501 27.8867 15.906 27.8867 16.4053H29.3867Z"
                  fill="white"
                  mask="url(#path-1-outside-1_1426_25152)"
                />
              </svg>
            </span>

            <p className="text-white text-sm mt-4">还没有评论</p>
            <p className="text-[#888888] text-xs">成为第一个分享想法的人吧！</p>
          </div>
        ) : (
          comments.map((comment, index) => {
            const commentLikeCount = comment.like_count ?? 0;
            const replyListFromComment = sortByCreatedAtAsc(
              comment.replies?.list
            );

            return (
              <div
                key={`comment-${index}-${comment.comment_id}`}
                id={`comment-${comment.comment_id}`}
                className="px-4 py-3"
              >
                {/* Main Comment */}
                <div className="flex gap-3">
                  {comment?.user?.profile_image ? (
                    <img
                      src={comment?.user?.profile_image}
                      alt={comment.user.nickname}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-8 h-8 rounded-full object-cover flex-shrink-0 bg-gray-500">
                      <User size={18} className="text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white text-sm font-medium">
                            {comment?.user?.nickname || "未知用户"}
                          </span>
                          {comment?.user?.level && (
                            <span className="px-1.5 py-0.5 bg-purple-600 rounded text-xs text-white">
                              {comment?.user?.level}
                            </span>
                          )}
                          {comment?.user?.is_author && (
                            <span className="px-1.5 py-0.5 bg-yellow-600 rounded text-xs text-white">
                              作者
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 text-xs">
                          {formatFullTime(comment.created_at)}
                        </p>
                      </div>
                      {/* Action Buttons */}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center flex-col gap-1">
                          <button
                            onClick={() =>
                              onReportComment?.(comment.comment_id)
                            }
                            className="text-gray-500 hover:text-white transition-colors"
                          >
                            <svg
                              width="16"
                              height="14"
                              viewBox="0 0 16 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M6.72796 0.917482L0.882105 11.0455L12.5758 11.0448L6.72796 0.917482ZM0.655349 11.8319C0.540309 11.8319 0.427298 11.8016 0.327672 11.7441C0.228046 11.6866 0.145316 11.6039 0.0877981 11.5042C0.0302798 11.4046 -7.30621e-07 11.2916 0 11.1766C7.30648e-07 11.0615 0.0302827 10.9485 0.0878023 10.8489L6.16042 0.327654C6.21794 0.228033 6.30067 0.145309 6.40029 0.0877938C6.49992 0.0302789 6.61293 0 6.72796 0C6.843 0 6.95601 0.0302789 7.05563 0.0877938C7.15525 0.145309 7.23799 0.228033 7.29551 0.327654L13.3707 10.8482C13.4283 10.9479 13.4585 11.0609 13.4585 11.1759C13.4585 11.2909 13.4283 11.404 13.3707 11.5036C13.3132 11.6032 13.2305 11.6859 13.1309 11.7435C13.0312 11.801 12.9182 11.8313 12.8032 11.8313L0.655349 11.8319ZM6.3177 4.55738H7.14019L7.07662 7.65201H6.38193L6.31836 4.55738H6.3177ZM6.72796 9.23931C6.66751 9.24035 6.60746 9.22937 6.55129 9.20699C6.49513 9.18462 6.44397 9.1513 6.4008 9.10898C6.35762 9.06666 6.32329 9.01618 6.2998 8.96047C6.27631 8.90477 6.26413 8.84494 6.26396 8.78448C6.26396 8.53217 6.46844 8.33359 6.72796 8.33359C6.99011 8.33359 7.19458 8.53217 7.19458 8.78448C7.19433 8.84514 7.18201 8.90514 7.15832 8.96099C7.13464 9.01683 7.10007 9.06739 7.05663 9.10973C7.0132 9.15207 6.96176 9.18533 6.90533 9.20758C6.8489 9.22983 6.78861 9.24061 6.72796 9.23931Z"
                                fill="#777777"
                              />
                            </svg>
                          </button>
                          <span className="text-xs text-gray-500">举报</span>
                        </div>
                        <div className="flex items-center flex-col gap-1">
                          <button
                            onClick={() => onLikeComment?.(comment.comment_id)}
                            className="flex items-center gap-1 text-gray-500 hover:text-white transition-colors"
                          >
                            <ThumbsUp
                              size={16}
                              className={
                                comment.is_liked ? "text-purple-500" : ""
                              }
                            />
                          </button>
                          <span className="text-xs text-gray-500">
                            {commentLikeCount}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm my-2">
                      {comment.content}
                    </p>
                    <div className="flex flex-col items-start gap-4 text-xs text-gray-500">
                      <button
                        onClick={() => toggleReplyInput(comment.comment_id)}
                        className="hover:text-white transition-colors bg-[#FFFFFF1F] px-2 py-1 rounded-full"
                      >
                        回复
                      </button>
                      {(() => {
                        const cachedCount =
                          repliesCache[comment.comment_id]?.length ?? 0;
                        const existingCount =
                          comment.replies?.list.length ??
                          comment.replies?.replies_count ??
                          cachedCount;
                        return existingCount > 0;
                      })() && (
                        <div className="flex items-center gap-1">
                          <span className="w-5 h-[1px] bg-gray-500"></span>
                          <button
                            onClick={() => toggleReplies(comment.comment_id)}
                            className="hover:text-white transition-colors"
                          >
                            {expandedReplies[comment.comment_id]
                              ? `展开${replyListFromComment.length}条回复`
                              : `收起${replyListFromComment.length}条回复`}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Reply Input */}
                    {showReplyInput[comment.comment_id] && (
                      <div className="mt-2 flex gap-2 px-4 py-2 ">
                        <input
                          type="text"
                          ref={(el) => {
                            if (el) {
                              replyInputRefs.current[comment.comment_id] = el;
                            } else {
                              delete replyInputRefs.current[comment.comment_id];
                            }
                          }}
                          value={replyContent[comment.comment_id] || ""}
                          onChange={(e) =>
                            setReplyContent((prev) => ({
                              ...prev,
                              [comment.comment_id]: e.target.value,
                            }))
                          }
                          placeholder="回复..."
                          className="flex-1 px-2 py-2 border border-gray-600 bg-[#191721] rounded-lg text-white text-sm outline-none focus:border-purple-500"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleReplySubmit(comment.comment_id);
                            }
                          }}
                        />
                        <button
                          onClick={() => handleReplySubmit(comment.comment_id)}
                          className="p-2 text-center w-10 h-10 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                        >
                          <SendHorizonal
                            size={22}
                            className="text-white mx-auto"
                          />
                        </button>
                      </div>
                    )}

                    {/* Replies */}
                    {expandedReplies[comment.comment_id] && (
                      <div className="mt-3 space-y-3 pl-4 ">
                        {replyLoading[comment.comment_id] &&
                        !repliesCache[comment.comment_id] ? (
                          <p className="text-xs text-gray-500">回复加载中...</p>
                        ) : (
                          (
                            repliesCache[comment.comment_id] ||
                            replyListFromComment ||
                            []
                          ).map((reply, index) => {
                            const replyLikeCount = reply.like_count ?? 0;
                            return (
                              <div
                                key={`reply-${index}-${reply.comment_id}`}
                                className="flex gap-3"
                              >
                                {reply?.user?.profile_image ? (
                                  <img
                                    src={reply.user.profile_image}
                                    alt={reply.user.nickname}
                                    className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                                  />
                                ) : (
                                  <div className="w-6 h-6 rounded-full object-cover flex items-center justify-center flex-shrink-0 bg-gray-500">
                                    <User size={16} className="text-white" />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <div className="flex justify-between items-center gap-2">
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-white text-xs font-medium">
                                          {reply?.user?.nickname || "未知用户"}
                                        </span>
                                        {reply?.user?.level && (
                                          <span className="px-1 py-0.5 bg-purple-600 rounded text-xs text-white">
                                            {reply?.user?.level}
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-xs text-gray-500">
                                        {formatFullTime(reply.created_at)}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <div className="flex items-center flex-col gap-1">
                                        <button
                                          onClick={() =>
                                            onReportComment?.(reply.comment_id)
                                          }
                                          className="text-gray-500 hover:text-white transition-colors"
                                        >
                                          <svg
                                            width="16"
                                            height="14"
                                            viewBox="0 0 16 14"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              fill-rule="evenodd"
                                              clip-rule="evenodd"
                                              d="M6.72796 0.917482L0.882105 11.0455L12.5758 11.0448L6.72796 0.917482ZM0.655349 11.8319C0.540309 11.8319 0.427298 11.8016 0.327672 11.7441C0.228046 11.6866 0.145316 11.6039 0.0877981 11.5042C0.0302798 11.4046 -7.30621e-07 11.2916 0 11.1766C7.30648e-07 11.0615 0.0302827 10.9485 0.0878023 10.8489L6.16042 0.327654C6.21794 0.228033 6.30067 0.145309 6.40029 0.0877938C6.49992 0.0302789 6.61293 0 6.72796 0C6.843 0 6.95601 0.0302789 7.05563 0.0877938C7.15525 0.145309 7.23799 0.228033 7.29551 0.327654L13.3707 10.8482C13.4283 10.9479 13.4585 11.0609 13.4585 11.1759C13.4585 11.2909 13.4283 11.404 13.3707 11.5036C13.3132 11.6032 13.2305 11.6859 13.1309 11.7435C13.0312 11.801 12.9182 11.8313 12.8032 11.8313L0.655349 11.8319ZM6.3177 4.55738H7.14019L7.07662 7.65201H6.38193L6.31836 4.55738H6.3177ZM6.72796 9.23931C6.66751 9.24035 6.60746 9.22937 6.55129 9.20699C6.49513 9.18462 6.44397 9.1513 6.4008 9.10898C6.35762 9.06666 6.32329 9.01618 6.2998 8.96047C6.27631 8.90477 6.26413 8.84494 6.26396 8.78448C6.26396 8.53217 6.46844 8.33359 6.72796 8.33359C6.99011 8.33359 7.19458 8.53217 7.19458 8.78448C7.19433 8.84514 7.18201 8.90514 7.15832 8.96099C7.13464 9.01683 7.10007 9.06739 7.05663 9.10973C7.0132 9.15207 6.96176 9.18533 6.90533 9.20758C6.8489 9.22983 6.78861 9.24061 6.72796 9.23931Z"
                                              fill="#777777"
                                            />
                                          </svg>
                                        </button>
                                        <span className="text-xs text-gray-500">
                                          举报
                                        </span>
                                      </div>

                                      <div className="flex items-center flex-col gap-1">
                                        <button
                                          onClick={() =>
                                            onLikeComment?.(reply.comment_id)
                                          }
                                          className="flex items-center gap-1 text-gray-500 hover:text-white transition-colors"
                                        >
                                          <ThumbsUp
                                            size={16}
                                            className={
                                              reply.is_liked
                                                ? "text-purple-500"
                                                : ""
                                            }
                                          />
                                        </button>
                                        <span className="text-xs text-gray-500">
                                          {replyLikeCount}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <p className="text-gray-300 text-sm my-1">
                                    {reply.content}
                                  </p>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Comment Input */}
      {showInput && (
        <div className="sticky bottom-0 left-0 right-0 px-4 py-3 bg-[#191721] rounded-lg">
          {user?.token ? (
            <div className="flex items-center gap-2">
              <input
                ref={commentInputRef}
                type="text"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="我来说两句~"
                className="flex-1 px-2 py-2 border-none bg-transparent rounded-lg text-white text-sm outline-none focus:border-purple-500"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleCommentSubmit();
                  }
                }}
              />
              <button
                onClick={handleCommentSubmit}
                className="p-2 text-center w-10 h-10 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
              >
                <SendHorizonal size={22} className="text-white mx-auto" />
              </button>
            </div>
          ) : (
            <button className="w-full py-3 bg-purple-600 rounded-lg text-white text-sm font-medium hover:bg-purple-700 transition-colors">
              登录后发布评论
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
