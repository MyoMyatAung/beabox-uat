/**
 * ============================================================================
 * PROFILE POPOVER COMPONENT
 * ============================================================================
 *
 * Displays popover menu with profile actions (view profile, follow/unfollow).
 * Positioned relative to the profile trigger element.
 *
 * This component handles profile-related actions UI, keeping it separate
 * from the main post component for better maintainability.
 */

import { User, PlusCircle, Minus } from "lucide-react";

/**
 * Props for ProfilePopover component.
 */
export interface ProfilePopoverProps {
  /** Whether popover is visible */
  isOpen: boolean;
  /** Whether user is following the author */
  isFollowing: boolean;
  /** Whether follow action is loading */
  isFollowLoading: boolean;
  /** Ref for popover element (for click-outside detection) */
  popoverRef: React.RefObject<HTMLDivElement>;
  /** Callback when "Personal Homepage" is clicked */
  onPersonalHomepage: () => void;
  /** Callback when "Follow/Unfollow" is clicked */
  onFollow: () => void;
}

/**
 * Profile popover component with user actions.
 *
 * @param props - Component props
 * @returns Popover menu with profile actions
 */
export default function ProfilePopover({
  isOpen,
  isFollowing,
  isFollowLoading,
  popoverRef,
  onPersonalHomepage,
  onFollow,
}: ProfilePopoverProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={popoverRef}
      className="absolute top-12 left-0 z-50 bg-[#1E1C28] rounded-lg shadow-lg border border-[#1E1C28] min-w-32"
    >
      <button
        onClick={onPersonalHomepage}
        className="w-full flex items-center justify-between px-4 py-2 text-white hover:bg-[#2E2C3A] transition-colors first:rounded-t-lg"
      >
        <span className="text-sm">个人主页</span>
        <User size={18} className="text-white" />
      </button>
      <hr className="border-white/10" />
      <button
        onClick={onFollow}
        disabled={isFollowLoading}
        className="w-full px-4 py-2 text-white hover:bg-[#2E2C3A] transition-colors last:rounded-b-lg disabled:opacity-50"
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
  );
}

