import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import loader from "../vod_loader.gif";
import {
  useCommentReactionMutation,
  usePostCommentMutation,
  useReplyListMutation,
} from "../services/homeApi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showToast } from "../services/errorSlice";
import LoginDrawer from "@/components/profile/auth/login-drawer";
import { getDeviceInfo } from "@/lib/deviceInfo";

interface CommentOverlayProps {
  setCommentCount: any;
  commentsVisible: boolean;
  comments: any[];
  post_id: any;
  isLoading: boolean;
  setComments: any;
  page: any;
  comment_count: any;
  setPage: any;
  closeCommentList: () => void;
  refetchComments: () => void; // Function to refresh the comment list
  getComments: any;
}

const CommentOverlay: React.FC<CommentOverlayProps> = ({
  setCommentCount,
  commentsVisible,
  comments,
  comment_count,
  post_id,
  isLoading,
  closeCommentList,
  refetchComments,
  setComments,
  page,
  setPage,
  getComments,
}) => {
  const [activeReply, setActiveReply] = useState<{
    commentId: number | null;
    replyId: number | null;
  }>({ commentId: null, replyId: null }); // Tracks the active reply box (comment or reply)
  const [replyContent, setReplyContent] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [repliesVisible, setRepliesVisible] = useState<{
    [key: number]: boolean;
  }>({}); // Tracks visibility of replies for each comment
  const [postComment] = usePostCommentMutation();
  const [getReply] = useReplyListMutation();
  const [commentReaction] = useCommentReactionMutation();
  const [isClosing, setIsClosing] = useState(false); // Tracks whether the portal is closing
  const user = useSelector((state: any) => state?.persist?.user);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastCommentRef = useRef<HTMLDivElement | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [hasMore, setHasMore] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const handleReplyClick = (
    commentId: number,
    replyId: number | null = null
  ) => {
    setActiveReply(
      (prev) =>
        prev.commentId === commentId && prev.replyId === replyId
          ? { commentId: null, replyId: null } // Close the reply box if already open
          : { commentId, replyId } // Open the reply box for the selected comment/reply
    );
    setReplyContent(""); // Clear the reply content
  };

  const handleReplySubmit = async (
    commentId: number,
    replyId?: number | null
  ) => {
    if (user?.token) {
      if (!replyContent.trim()) return;
      try {
        // Get device information
        const deviceInfo = getDeviceInfo();
        
        const response = await postComment({
          post_id: post_id,
          content: replyContent,
          comment_id: commentId,
          reply_id: replyId || undefined,
          device: deviceInfo.deviceName,
          app_version: deviceInfo.appVersion
        }).unwrap();
        setActiveReply({ commentId: null, replyId: null });
        setReplyContent("");

        if (response?.data?.data?.status === "success") {
          refetchComments();
          // setComments((prev: any) => [...prev, response?.data?.data]);
        }

        // refetchComments();
      } catch (error) {
        const errMsg = JSON.parse(error?.data);
        dispatch(
          showToast({
            message: errMsg?.message,
            type: "error",
          })
        );
        console.error("Failed to post reply:", errMsg);
      }
    } else {
      setIsOpen(true);
    }
  };

  const handleReaction = async (
    id: number,
    is_reply: boolean,
    isLiked: boolean
  ) => {
    const status = isLiked ? 0 : 1; // Toggle between like and unlike
    try {
      await commentReaction({
        id,
        is_reply: is_reply ? 1 : 0,
        status,
      }).unwrap();

      // Update the state immutably
      setComments((prevComments: any) =>
        prevComments.map((comment: any) => {
          if (is_reply) {
            if (comment.replies?.list) {
              return {
                ...comment,
                replies: {
                  ...comment.replies,
                  list: comment.replies.list.map((reply: any) => {
                    if (reply.reply_id === id) {
                      return {
                        ...reply,
                        is_liked: !reply.is_liked,
                        reply_like_count: reply.is_liked
                          ? +reply.reply_like_count - 1
                          : +reply.reply_like_count + 1,
                      };
                    }
                    return reply;
                  }),
                },
              };
            }
          } else if (comment.comment_id === id) {
            return {
              ...comment,
              is_liked: !comment.is_liked,
              comment_like_count: comment.is_liked
                ? +comment.comment_like_count - 1
                : +comment.comment_like_count + 1,
            };
          }
          return comment;
        })
      );
    } catch (error) {
      console.error("Failed to update reaction:", error);
    }
  };

  const handleReport = (id: any) => {
    if (user?.token) {
      navigate(`/reports/comment/${id}`);
    } else {
      setIsOpen(true);
    }
  };
  const toggleRepliesVisibility = (commentId: number) => {
    setRepliesVisible((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };
  const handleComment = async () => {
    if (user?.token) {
      if (!content.trim()) return;

      try {
        // Get device information
        const deviceInfo = getDeviceInfo();
        
        const response = await postComment({
          post_id: post_id, // Assuming all comments belong to the same post
          content: content,
          device: deviceInfo.deviceName,
          app_version: deviceInfo.appVersion
        }).unwrap();
        setContent("");

        if (response?.data?.data?.status === "success") {
          refetchComments();
          // setComments((prev: any) => [...prev, response?.data?.data]);
        }

        //  setCommentCount((prev: any) => +prev + 1);
        console.log(response);
        dispatch(
          showToast({
            message: response?.message,
            type: "success",
          })
        );
      } catch (error) {
        const errMsg = JSON.parse(error?.data);
        dispatch(
          showToast({
            message: errMsg?.message,
            type: "error",
          })
        );
        console.error("Failed to post reply:", errMsg);
      }
    } else {
      setIsOpen(true);
    }
  };
  const handleLoadMore = async (comment_id: number, last_reply_id: number) => {
    try {
      const response = await getReply({
        comment_id,
        last_reply_id,
      }).unwrap();

      if (response?.data) {
        const { list: newReplies, hasMore } = response?.data;

        setComments((prevComments: any) =>
          prevComments.map((comment: any) => {
            if (comment.comment_id === comment_id) {
              return {
                ...comment,
                replies: {
                  ...comment.replies,
                  list: [...comment.replies.list, ...newReplies], // Append new replies
                  hasMore, // Update hasMore status
                },
              };
            }
            return comment;
          })
        );
      }
    } catch (error) {
      console.error("Failed to load more replies:", error);
    }
  };

  const renderComment = (comment: any, index: any) => {
    const areRepliesVisible = repliesVisible[comment.comment_id] || false;

    return (
      <div
        key={comment.comment_id}
        ref={index === comments.length - 1 ? lastCommentRef : null}
        className="flex flex-col p-4 rounded-lg shadow-md"
      >
        {/* Comment Content */}
        <div className="flex justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-9 h-9 border-2 border-white">
              <AvatarImage
                src={comment.user.avatar || "/default-avatar.png"}
                alt={comment.user.name}
              />
              <AvatarFallback className="text-white bg-black font-cnFont">
                {comment.user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-col flex">
              <span className="comment_name text-white">
                {comment.user.name}
              </span>
              <span className="created_at_comment">{comment.created_at}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Like Button */}
            <button
              className={`mt-1 text-center flex flex-col justify-center items-center gap-1 text-xs font-medium transition duration-300 `}
              onClick={() => handleReport(comment?.comment_id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="13"
                viewBox="0 0 15 13"
                fill="none"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M7.42523 1.47217L1.57937 11.6002L13.2731 11.5995L7.42523 1.47217ZM1.35261 12.3866C1.23757 12.3866 1.12456 12.3563 1.02494 12.2988C0.925312 12.2413 0.842582 12.1586 0.785064 12.0589C0.727545 11.9593 0.697265 11.8463 0.697266 11.7313C0.697266 11.6162 0.727548 11.5032 0.785068 11.4036L6.85768 0.882341C6.9152 0.782721 6.99793 0.699996 7.09756 0.642481C7.19718 0.584966 7.31019 0.554688 7.42523 0.554688C7.54026 0.554688 7.65327 0.584966 7.7529 0.642481C7.85252 0.699996 7.93525 0.782721 7.99277 0.882341L14.068 11.4029C14.1255 11.5025 14.1558 11.6156 14.1558 11.7306C14.1558 11.8456 14.1255 11.9586 14.068 12.0583C14.0105 12.1579 13.9278 12.2406 13.8281 12.2982C13.7285 12.3557 13.6155 12.386 13.5005 12.386L1.35261 12.3866ZM7.01497 5.11207H7.83745L7.77388 8.2067H7.07919L7.01562 5.11207H7.01497ZM7.42523 9.794C7.36478 9.79504 7.30473 9.78405 7.24856 9.76168C7.19239 9.73931 7.14124 9.70599 7.09806 9.66367C7.05489 9.62135 7.02056 9.57087 6.99707 9.51516C6.97358 9.45945 6.96139 9.39963 6.96123 9.33917C6.96123 9.08686 7.1657 8.88828 7.42523 8.88828C7.68737 8.88828 7.89185 9.08686 7.89185 9.33917C7.8916 9.39983 7.87927 9.45983 7.85559 9.51567C7.83191 9.57152 7.79734 9.62208 7.7539 9.66442C7.71046 9.70676 7.65903 9.74002 7.6026 9.76227C7.54617 9.78452 7.48587 9.7953 7.42523 9.794Z"
                  fill="#777777"
                />
              </svg>
              <span className="like_text">举报</span>
            </button>

            {comment?.is_liked ? (
              <button
                onClick={() =>
                  handleReaction(comment.comment_id, false, comment.is_liked)
                }
                className={`mt-1 text-center flex flex-col justify-center items-center gap-1 text-xs font-medium transition duration-300 `}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="13"
                  viewBox="0 0 14 13"
                  fill="none"
                >
                  <path
                    opacity="0.8"
                    d="M3.08423 5.2605V12.521H0.664062V5.2605H3.08423ZM5.5044 12.521C5.18346 12.521 4.87567 12.3935 4.64874 12.1666C4.42181 11.9396 4.29431 11.6319 4.29431 11.3109V5.2605C4.29431 4.92773 4.42742 4.62521 4.65129 4.40739L8.63247 0.420166L9.27381 1.06151C9.43717 1.22487 9.54003 1.44874 9.54003 1.6968L9.52188 1.89042L8.94709 4.65546H12.7649C13.0858 4.65546 13.3936 4.78295 13.6206 5.00989C13.8475 5.23682 13.975 5.54461 13.975 5.86554V7.07563C13.975 7.23294 13.9447 7.37815 13.8903 7.51731L12.0631 11.7829C11.8815 12.2185 11.452 12.521 10.9498 12.521H5.5044Z"
                    fill="white"
                  />
                </svg>
                <span className="like_text">{comment?.comment_like_count}</span>
              </button>
            ) : (
              <button
                onClick={() =>
                  handleReaction(comment.comment_id, false, comment.is_liked)
                }
                className={`mt-1 text-center flex flex-col justify-center items-center gap-1 text-xs font-medium transition duration-300`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="14"
                  viewBox="0 0 15 14"
                  fill="none"
                >
                  <path
                    opacity="0.8"
                    d="M3.08423 6.2605V13.521H0.664062V6.2605H3.08423ZM5.5044 13.521C5.18346 13.521 4.87567 13.3935 4.64874 13.1666C4.42181 12.9396 4.29431 12.6319 4.29431 12.3109V6.2605C4.29431 5.92773 4.42742 5.62521 4.65129 5.40739L8.63247 1.42017L9.27381 2.06151C9.43717 2.22487 9.54003 2.44874 9.54003 2.6968L9.52188 2.89042L8.94709 5.65546H12.7649C13.0858 5.65546 13.3936 5.78295 13.6206 6.00989C13.8475 6.23682 13.975 6.54461 13.975 6.86554V8.07563C13.975 8.23294 13.9447 8.37815 13.8903 8.51731L12.0631 12.7829C11.8815 13.2185 11.452 13.521 10.9498 13.521H5.5044Z"
                    stroke="#777777"
                    stroke-width="0.860504"
                  />
                </svg>
                <span className="like_text">{comment?.comment_like_count}</span>
              </button>
            )}
          </div>
        </div>
        <p className="mt-2 ml-[48px] comment_content font-cnFont text-white">
          {comment.content}
        </p>
        <button
          className="reply_btn"
          onClick={() => handleReplyClick(comment.comment_id)}
        >
          回复
        </button>

        {/* Show/Hide Replies */}
        {comment.replies?.list.length > 0 && (
          <div className="flex items-center mt-2 gap-2 ml-[50px]">
            <div className="h-[1px] line w-[100px]"></div>
            <button
              className="view-reply"
              onClick={() => toggleRepliesVisibility(comment.comment_id)}
            >
              {areRepliesVisible
                ? "收起 条回复"
                : `展开 ${comment.replies.list.length} 条回复`}
            </button>
          </div>
        )}

        {/* Render Reply Input for Comments */}
        {activeReply.commentId === comment.comment_id &&
          activeReply.replyId === null && (
            <div className="mt-2 flex items-center gap-2 ml-[48px]">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full p-2 bg-transparent border outline-none text-[14px] border-gray-600 rounded-md text-white"
                placeholder={`回复 ${comment?.user?.name}`}
              />
              <button
                className="p-3 comment_arrow text-white"
                onClick={() => handleReplySubmit(comment.comment_id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="22"
                  viewBox="0 0 24 22"
                  fill="none"
                >
                  <path
                    d="M12.2705 11.7305L3.00345 12.6274L0.56437 20.427C0.468914 20.7295 0.496117 21.0574 0.640043 21.3401C0.783968 21.6227 1.03349 21.8374 1.33422 21.9378C1.63518 22.0382 1.96335 22.0164 2.24826 21.8772L22.5589 12.0422C22.8198 11.9151 23.0233 11.6943 23.1289 11.424C23.2345 11.1537 23.2345 10.8535 23.1289 10.5832C23.0233 10.3129 22.8198 10.0921 22.5589 9.96495L2.26219 0.123036C1.97731 -0.0164383 1.64889 -0.038204 1.34796 0.0622005C1.04724 0.162848 0.797965 0.377508 0.65378 0.659921C0.509855 0.94258 0.482651 1.2705 0.578108 1.57295L3.01719 9.37255L12.2672 10.2695C12.6408 10.3066 12.9257 10.6209 12.9257 10.9963C12.9257 11.3719 12.6408 11.6862 12.2672 11.7231L12.2705 11.7305Z"
                    fill="white"
                  />
                </svg>
              </button>
            </div>
          )}

        {/* Render Replies */}
        {areRepliesVisible &&
          comment.replies?.list.map((reply: any) =>
            renderReply(reply, comment.comment_id)
          )}
        {/* Show/Hide Replies */}
        {areRepliesVisible && comment.replies?.hasMore && (
          <div className="flex items-center mt-2 gap-2 ml-[100px]">
            <div className="h-[1px] line w-[100px]"></div>
            <button
              className="view-reply"
              onClick={() =>
                handleLoadMore(
                  comment?.comment_id,
                  comment?.replies?.list[comment?.replies?.list?.length - 1]
                    ?.reply_id
                )
              }
            >
              展开条回复
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderReply = (reply: any, commentId: number) => {
    return (
      <div
        key={reply.reply_id}
        className="flex flex-col py-3 rounded-lg shadow-md ml-12" // Indentation for replies
      >
        {/* Reply Content */}
        <div className="flex justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-9 h-9 border-2 border-white">
              <AvatarImage
                src={reply.user.avatar || "/default-avatar.png"}
                alt={reply.user.name}
              />
              <AvatarFallback className="text-white bg-black">
                {reply.user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-col flex">
              <span className="comment_name text-white">{reply.user.name}</span>
              <span className="created_at_comment">{reply.created_at}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              className={`mt-1 text-center flex flex-col justify-center items-center gap-1 text-xs font-medium transition duration-300 `}
              onClick={() => handleReport(reply?.reply_id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="13"
                viewBox="0 0 15 13"
                fill="none"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M7.42523 1.47217L1.57937 11.6002L13.2731 11.5995L7.42523 1.47217ZM1.35261 12.3866C1.23757 12.3866 1.12456 12.3563 1.02494 12.2988C0.925312 12.2413 0.842582 12.1586 0.785064 12.0589C0.727545 11.9593 0.697265 11.8463 0.697266 11.7313C0.697266 11.6162 0.727548 11.5032 0.785068 11.4036L6.85768 0.882341C6.9152 0.782721 6.99793 0.699996 7.09756 0.642481C7.19718 0.584966 7.31019 0.554688 7.42523 0.554688C7.54026 0.554688 7.65327 0.584966 7.7529 0.642481C7.85252 0.699996 7.93525 0.782721 7.99277 0.882341L14.068 11.4029C14.1255 11.5025 14.1558 11.6156 14.1558 11.7306C14.1558 11.8456 14.1255 11.9586 14.068 12.0583C14.0105 12.1579 13.9278 12.2406 13.8281 12.2982C13.7285 12.3557 13.6155 12.386 13.5005 12.386L1.35261 12.3866ZM7.01497 5.11207H7.83745L7.77388 8.2067H7.07919L7.01562 5.11207H7.01497ZM7.42523 9.794C7.36478 9.79504 7.30473 9.78405 7.24856 9.76168C7.19239 9.73931 7.14124 9.70599 7.09806 9.66367C7.05489 9.62135 7.02056 9.57087 6.99707 9.51516C6.97358 9.45945 6.96139 9.39963 6.96123 9.33917C6.96123 9.08686 7.1657 8.88828 7.42523 8.88828C7.68737 8.88828 7.89185 9.08686 7.89185 9.33917C7.8916 9.39983 7.87927 9.45983 7.85559 9.51567C7.83191 9.57152 7.79734 9.62208 7.7539 9.66442C7.71046 9.70676 7.65903 9.74002 7.6026 9.76227C7.54617 9.78452 7.48587 9.7953 7.42523 9.794Z"
                  fill="#777777"
                />
              </svg>
              <span className="like_text">举报</span>
            </button>

            {reply?.is_liked ? (
              <button
                onClick={() =>
                  handleReaction(reply.reply_id, true, reply.is_liked)
                }
                className={`mt-1 text-center flex flex-col justify-center items-center gap-1 text-xs font-medium transition duration-300 `}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="13"
                  viewBox="0 0 14 13"
                  fill="none"
                >
                  <path
                    opacity="0.8"
                    d="M3.08423 5.2605V12.521H0.664062V5.2605H3.08423ZM5.5044 12.521C5.18346 12.521 4.87567 12.3935 4.64874 12.1666C4.42181 11.9396 4.29431 11.6319 4.29431 11.3109V5.2605C4.29431 4.92773 4.42742 4.62521 4.65129 4.40739L8.63247 0.420166L9.27381 1.06151C9.43717 1.22487 9.54003 1.44874 9.54003 1.6968L9.52188 1.89042L8.94709 4.65546H12.7649C13.0858 4.65546 13.3936 4.78295 13.6206 5.00989C13.8475 5.23682 13.975 5.54461 13.975 5.86554V7.07563C13.975 7.23294 13.9447 7.37815 13.8903 7.51731L12.0631 11.7829C11.8815 12.2185 11.452 12.521 10.9498 12.521H5.5044Z"
                    fill="white"
                  />
                </svg>
                <span className="like_text">{reply?.reply_like_count}</span>
              </button>
            ) : (
              <button
                onClick={() =>
                  handleReaction(reply.reply_id, true, reply.is_liked)
                }
                className={`mt-1 text-center flex flex-col justify-center items-center gap-1 text-xs font-medium transition duration-300`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="14"
                  viewBox="0 0 15 14"
                  fill="none"
                >
                  <path
                    opacity="0.8"
                    d="M3.08423 6.2605V13.521H0.664062V6.2605H3.08423ZM5.5044 13.521C5.18346 13.521 4.87567 13.3935 4.64874 13.1666C4.42181 12.9396 4.29431 12.6319 4.29431 12.3109V6.2605C4.29431 5.92773 4.42742 5.62521 4.65129 5.40739L8.63247 1.42017L9.27381 2.06151C9.43717 2.22487 9.54003 2.44874 9.54003 2.6968L9.52188 2.89042L8.94709 5.65546H12.7649C13.0858 5.65546 13.3936 5.78295 13.6206 6.00989C13.8475 6.23682 13.975 6.54461 13.975 6.86554V8.07563C13.975 8.23294 13.9447 8.37815 13.8903 8.51731L12.0631 12.7829C11.8815 13.2185 11.452 13.521 10.9498 13.521H5.5044Z"
                    stroke="#777777"
                    stroke-width="0.860504"
                  />
                </svg>
                <span className="like_text">{reply?.reply_like_count}</span>
              </button>
            )}
          </div>
        </div>
        <p className="mt-2 ml-[48px] comment_content text-white">
          {reply.content}
        </p>
        <button
          className="reply_btn"
          onClick={() => handleReplyClick(commentId, reply.reply_id)}
        >
          回复
        </button>

        {/* Render Reply Input for Replies */}
        {activeReply.commentId === commentId &&
          activeReply.replyId === reply.reply_id && (
            <div className="mt-2 flex items-center gap-2 ml-[48px]">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full p-2 bg-transparent border border-gray-600 outline-none rounded-md text-white"
                placeholder={`回复 ${reply?.user?.name}`}
              />
              <button
                className="p-3 comment_arrow text-white  rounded-md"
                onClick={() => handleReplySubmit(commentId, reply.reply_id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="22"
                  viewBox="0 0 24 22"
                  fill="none"
                >
                  <path
                    d="M12.2705 11.7305L3.00345 12.6274L0.56437 20.427C0.468914 20.7295 0.496117 21.0574 0.640043 21.3401C0.783968 21.6227 1.03349 21.8374 1.33422 21.9378C1.63518 22.0382 1.96335 22.0164 2.24826 21.8772L22.5589 12.0422C22.8198 11.9151 23.0233 11.6943 23.1289 11.424C23.2345 11.1537 23.2345 10.8535 23.1289 10.5832C23.0233 10.3129 22.8198 10.0921 22.5589 9.96495L2.26219 0.123036C1.97731 -0.0164383 1.64889 -0.038204 1.34796 0.0622005C1.04724 0.162848 0.797965 0.377508 0.65378 0.659921C0.509855 0.94258 0.482651 1.2705 0.578108 1.57295L3.01719 9.37255L12.2672 10.2695C12.6408 10.3066 12.9257 10.6209 12.9257 10.9963C12.9257 11.3719 12.6408 11.6862 12.2672 11.7231L12.2705 11.7305Z"
                    fill="white"
                  />
                </svg>
              </button>
            </div>
          )}
      </div>
    );
  };

  const handleClose = () => {
    setPage(1);
    setHasMore(true);
    setIsClosing(true); // Trigger the closing animation
    setTimeout(() => {
      setIsClosing(false); // Reset the state
      closeCommentList(); // Actually close the portal
    }, 100); // Match the duration of the closing animation
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await getComments({ post_id, page });
        if (response && response.data) {
          setComments((prev: any) => [...prev, ...response?.data?.data]);
          const loadedItems =
            response?.data?.pagination?.current_page *
            response?.data?.pagination?.per_page;
          setHasMore(loadedItems < response?.data?.pagination?.total);
          // setComments(response && ((response as any).data.data as any[]));
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching comment list:", error);
      }
    };

    if (page !== 1 && hasMore) {
      fetchComments();
    }
  }, [page]);

  const fetchMoreData = () => {
    if (hasMore) {
      setPage((prevPage: number) => prevPage + 1);
    }
  };

  useEffect(() => {
    if (!lastCommentRef.current || !hasMore) return;

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMoreData();
        }
      },
      { root: null, rootMargin: "100px", threshold: 0.1 }
    );

    if (lastCommentRef.current) {
      observer.current.observe(lastCommentRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [comments]);

  // useEffect(() => {
  //   if (data?.data) {
  //     setComments((prev: any) => [...prev, ...data.data]);

  // const loadedItems =
  //   data.pagination.current_page * data.pagination.per_page;
  // setHasMore(loadedItems < data.pagination.total);
  //   } else {
  //     setHasMore(false);
  //   }
  // }, [data]);

  if (!commentsVisible && !isClosing) return null;

  if (isOpen) {
    return <LoginDrawer isOpen={isOpen} setIsOpen={setIsOpen} />;
  }

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[999999] flex justify-center items-end">
      <div
        className="absolute inset-0 bg-transparent bg-opacity-80"
        onClick={handleClose}
      ></div>

      <div
        className={`relative w-full h-[70%] p-0 comments-list rounded-t-2xl z-[99999] overflow-hidden ${
          isClosing ? "animate-slide-down" : "animate-slide-up"
        }`}
      >
        <div>
          <div className="text-white text-center font-cnFont pt-[14px]">
            <span className="mr-1"> {comment_count}</span>条评论
          </div>
          <button
            className="absolute top-4 right-4 text-gray-700 text-2xl"
            onClick={handleClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12.0002 10.586L16.9502 5.63599L18.3642 7.04999L13.4142 12L18.3642 16.95L16.9502 18.364L12.0002 13.414L7.05023 18.364L5.63623 16.95L10.5862 12L5.63623 7.04999L7.05023 5.63599L12.0002 10.586Z"
                fill="white"
              />
            </svg>
          </button>
        </div>

        <div className="mt-5 relative pb-36 overflow-y-auto h-full space-y-0">
          {isLoading ? (
            <div className="text-center flex justify-center items-center h-[40vh] text-gray-500 italic">
              <img src={loader} className="w-[100px] h-[100px]" />
            </div>
          ) : comments.length === 0 ? (
            <div className="flex mt-28 flex-col items-center gap-2">
              <div>
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  viewBox="0 0 36 36"
                  fill="none"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M7.3245 0C5.58752 0 4.09952 1.24051 3.78449 2.9475L0.0599999 23.1674C0.0194995 23.3819 0 23.6009 0 23.8184V32.4C0 34.3875 1.61249 36 3.6 36H32.4C34.3875 36 36 34.3875 36 32.4V23.8184C36 23.6009 35.9805 23.3819 35.94 23.1674L32.2155 2.9475C31.9005 1.24051 30.4125 0 28.6755 0H7.3245ZM6.14401 3.3825C6.24901 2.81399 6.74551 2.4 7.3245 2.4H28.6756C29.2546 2.4 29.7512 2.81399 29.8561 3.3825L33.3226 22.2H25.797C25.161 22.2 24.5505 22.4535 24.1005 22.9035L21.003 25.9995H14.397L11.2996 22.9035C10.8495 22.4535 10.2391 22.2 9.60304 22.2H2.67761L6.14401 3.3825ZM2.40002 24.6V32.3998C2.40002 33.0628 2.937 33.5998 3.60001 33.5998H32.4C33.063 33.5998 33.6 33.0628 33.6 32.3998V24.6H25.7971L22.6996 27.6975C22.2496 28.1475 21.6391 28.3995 21.0031 28.3995H14.3972C13.7612 28.3995 13.1507 28.1475 12.7007 27.6975L9.60316 24.6H2.40002Z"
                    fill="#888888"
                  />
                </svg>
              </div>

              <div className="text-center text-[14px] text-gray-500 italic">
                评论空空如也～
              </div>
            </div>
          ) : (
            <>
              {comments.map((comment, index) => renderComment(comment, index))}
              {hasMore && (
                <div className="flex justify-center py-0">
                  <img src={loader} className="w-[50px] h-[50px]" />
                </div>
              )}
            </>
          )}
        </div>
        <div className="absolute bottom-0 add_comment w-full  py-3 ">
          <div className="flex items-center gap-2 px-4">
            <input
              type="text"
              className="w-full p-[6px] bg-transparent border-none outline-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="我来说两句～"
            />
            <button className="comment_arrow p-3" onClick={handleComment}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="22"
                viewBox="0 0 24 22"
                fill="none"
              >
                <path
                  d="M12.2705 11.7305L3.00345 12.6274L0.56437 20.427C0.468914 20.7295 0.496117 21.0574 0.640043 21.3401C0.783968 21.6227 1.03349 21.8374 1.33422 21.9378C1.63518 22.0382 1.96335 22.0164 2.24826 21.8772L22.5589 12.0422C22.8198 11.9151 23.0233 11.6943 23.1289 11.424C23.2345 11.1537 23.2345 10.8535 23.1289 10.5832C23.0233 10.3129 22.8198 10.0921 22.5589 9.96495L2.26219 0.123036C1.97731 -0.0164383 1.64889 -0.038204 1.34796 0.0622005C1.04724 0.162848 0.797965 0.377508 0.65378 0.659921C0.509855 0.94258 0.482651 1.2705 0.578108 1.57295L3.01719 9.37255L12.2672 10.2695C12.6408 10.3066 12.9257 10.6209 12.9257 10.9963C12.9257 11.3719 12.6408 11.6862 12.2672 11.7231L12.2705 11.7305Z"
                  fill="white"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("portal-root") as HTMLElement
  );
};

export default CommentOverlay;
