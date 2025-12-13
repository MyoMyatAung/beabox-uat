/**
 * ============================================================================
 * POST CONTENT COMPONENT
 * ============================================================================
 *
 * Displays post text content with expand/collapse functionality for long posts.
 * Handles text truncation and user interaction for reading full content.
 *
 * This component focuses solely on content display logic, making it
 * reusable and testable.
 */

import { useState } from "react";

/**
 * Props for PostContent component.
 */
export interface PostContentProps {
  /** Post text content */
  content: string;
  /** Character limit before showing expand option (default: 100) */
  expandThreshold?: number;
  /** Callback when content is clicked (e.g., navigate to post detail) */
  onClick?: () => void;
}

/**
 * Post content component with expand/collapse functionality.
 *
 * @param props - Component props
 * @returns Content section with optional expand button
 */
export default function PostContent({
  content,
  expandThreshold = 100,
  onClick,
}: PostContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldExpand = content.length > expandThreshold;

  return (
    <div className="mb-3">
      <p
        onClick={onClick}
        className={`text-white text-sm leading-relaxed cursor-pointer transition-colors ${
          shouldExpand && !isExpanded ? "line-clamp-3" : ""
        }`}
      >
        {content}
      </p>
      {shouldExpand && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="text-purple-400 text-sm mt-1"
        >
          {isExpanded ? "收起" : "展开"}
        </button>
      )}
    </div>
  );
}

