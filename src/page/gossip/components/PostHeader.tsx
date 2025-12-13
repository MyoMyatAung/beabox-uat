/**
 * ============================================================================
 * POST HEADER COMPONENT
 * ============================================================================
 *
 * Displays post author information including profile picture, username,
 * badges, and more options button.
 *
 * This component handles the visual representation of post metadata,
 * following the Single Responsibility Principle by focusing solely on
 * header display logic.
 */

import { User, Check, Plus } from "lucide-react";
import AsyncDecryptedImage from "@/utils/asyncDecryptedImage";
import type { GossipPostUser } from "../services/gossipSlice";

/**
 * Props for PostHeader component.
 */
export interface PostHeaderProps {
  /** Post author user information */
  user: GossipPostUser;
  /** Whether user is following the author */
  isFollowing: boolean;
  /** Callback when profile picture/username is clicked */
  onProfileClick: () => void;
  /** Callback when more options button is clicked */
  onMoreOptionsClick: () => void;
  /** Ref for profile trigger element (for popover positioning) */
  profileTriggerRef: React.RefObject<HTMLDivElement>;
  /** Ref for more options trigger element */
  moreOptionsTriggerRef: React.RefObject<HTMLButtonElement>;
}

/**
 * Post header component displaying author information and actions.
 *
 * @param props - Component props
 * @returns Header section with profile and more options
 */
export default function PostHeader({
  user,
  isFollowing,
  onProfileClick,
  onMoreOptionsClick,
  profileTriggerRef,
  moreOptionsTriggerRef,
}: PostHeaderProps) {
  return (
    <div className="flex items-start justify-between px-4 pt-4 mb-3">
      <div className="flex items-start gap-3 flex-1">
        {/* Profile Picture */}
        <div className="relative" ref={profileTriggerRef}>
          <div className="cursor-pointer" onClick={onProfileClick}>
            {user.profile_image ? (
              <AsyncDecryptedImage
                imageUrl={user.profile_image}
                alt={user.nickname}
                className="!w-10 !h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#FFFFFF12] flex items-center justify-center object-cover">
                <User size={22} className="text-white" />
              </div>
            )}
            {/* Follow indicator badge */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center border-2 border-black cursor-pointer">
              {isFollowing ? (
                <Check size={14} className="text-white" />
              ) : (
                <Plus size={14} className="text-white" />
              )}
            </div>
          </div>
        </div>

        {/* Username and Badges */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span
              className="text-white font-medium text-sm cursor-pointer"
              onClick={onProfileClick}
            >
              {user.nickname}
            </span>
            {user.badge && (
              <AsyncDecryptedImage
                imageUrl={user.badge}
                alt="badge"
                className="!w-4 !h-4"
              />
            )}
          </div>
          {user.level && (
            <AsyncDecryptedImage
              imageUrl={user.level}
              alt="level"
              className="!w-10 !h-5 object-contain"
            />
          )}
        </div>
      </div>

      {/* More Options Button */}
      <div className="relative">
        <button
          ref={moreOptionsTriggerRef}
          onClick={onMoreOptionsClick}
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
      </div>
    </div>
  );
}

