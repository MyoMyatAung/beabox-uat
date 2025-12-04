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
          <div className="px-4 py-8 text-center">
            <p className="text-gray-500 text-sm">暂无评论</p>
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
