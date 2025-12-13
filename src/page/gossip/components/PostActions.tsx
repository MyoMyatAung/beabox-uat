/**
 * ============================================================================
 * POST ACTIONS COMPONENT
 * ============================================================================
 *
 * Displays post interaction buttons (like, share) and timestamp.
 * Handles visual feedback for like state and displays counts.
 *
 * This component encapsulates all post action UI, following the
 * Single Responsibility Principle.
 */

/**
 * Props for PostActions component.
 */
export interface PostActionsProps {
  /** Whether the post is liked */
  isLiked: boolean;
  /** Current like count */
  likeCount: number;
  /** Whether like action is pending */
  isLikePending: boolean;
  /** Share count */
  shareCount: number;
  /** Post timestamp (formatted) */
  timeAgo: string;
  /** Callback when like button is clicked */
  onLike: () => void;
  /** Callback when share button is clicked */
  onShare: () => void;
}

/**
 * Post actions component displaying like, share buttons and timestamp.
 *
 * @param props - Component props
 * @returns Actions section with buttons and timestamp
 */
export default function PostActions({
  isLiked,
  likeCount,
  isLikePending,
  shareCount,
  timeAgo,
  onLike,
  onShare,
}: PostActionsProps) {
  return (
    <div className="px-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Like Button */}
        <button
          onClick={onLike}
          disabled={isLikePending}
          aria-pressed={isLiked}
          className={`flex items-center gap-1 transition-colors ${
            isLiked ? "text-[#F70F2D]" : "text-white"
          } ${isLikePending ? "opacity-60" : ""}`}
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

          {likeCount > 0 && <span className="text-sm">{likeCount}</span>}
        </button>

        {/* Share Button */}
        <button
          className="flex items-center gap-1 text-white transition-colors"
          onClick={onShare}
          aria-label="Share post"
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

          {shareCount > 0 && <span className="text-sm">{shareCount}</span>}
        </button>
      </div>

      {/* Timestamp */}
      <span className="text-gray-500 text-xs">{timeAgo}</span>
    </div>
  );
}

