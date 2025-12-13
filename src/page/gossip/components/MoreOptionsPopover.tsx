/**
 * ============================================================================
 * MORE OPTIONS POPOVER COMPONENT
 * ============================================================================
 *
 * Displays popover menu with post actions (copy link, not interested, report).
 * Positioned relative to the more options trigger button.
 *
 * This component handles post-related actions UI, keeping it separate
 * from the main post component for better maintainability.
 */

import { Link, HeartOff, AlertTriangle } from "lucide-react";

/**
 * Props for MoreOptionsPopover component.
 */
export interface MoreOptionsPopoverProps {
  /** Whether popover is visible */
  isOpen: boolean;
  /** Whether "not interested" action is loading */
  isNotInterestedLoading: boolean;
  /** Ref for popover element (for click-outside detection) */
  popoverRef: React.RefObject<HTMLDivElement>;
  /** Callback when "Copy Link" is clicked */
  onCopyLink: () => void;
  /** Callback when "Not Interested" is clicked */
  onNotInterested: () => void;
  /** Callback when "Report" is clicked */
  onReport: () => void;
}

/**
 * More options popover component with post actions.
 *
 * @param props - Component props
 * @returns Popover menu with post actions
 */
export default function MoreOptionsPopover({
  isOpen,
  isNotInterestedLoading,
  popoverRef,
  onCopyLink,
  onNotInterested,
  onReport,
}: MoreOptionsPopoverProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={popoverRef}
      className="absolute top-8 right-0 z-50 bg-[#1E1C28] rounded-lg shadow-lg border border-[#1E1C28] min-w-32"
    >
      <button
        onClick={onCopyLink}
        className="w-full flex items-center justify-between px-4 py-2 text-white hover:bg-[#2E2C3A] transition-colors first:rounded-t-lg"
      >
        <span className="text-sm">复制链接</span>
        <Link size={18} className="text-white" />
      </button>
      <hr className="border-white/10" />
      <button
        onClick={onNotInterested}
        disabled={isNotInterestedLoading}
        className="w-full flex items-center justify-between px-4 py-2 text-white hover:bg-[#2E2C3A] transition-colors disabled:opacity-50"
      >
        <span className="text-sm">不感兴趣</span>
        <HeartOff size={18} className="text-white" />
      </button>
      <hr className="border-white/10" />
      <button
        onClick={onReport}
        className="w-full flex items-center justify-between px-4 py-2 text-white hover:bg-[#2E2C3A] transition-colors last:rounded-b-lg"
      >
        <span className="text-sm">举报</span>
        <AlertTriangle size={18} className="text-white" />
      </button>
    </div>
  );
}

