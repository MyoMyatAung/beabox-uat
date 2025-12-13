/**
 * ============================================================================
 * POST POPOVERS HOOK
 * ============================================================================
 *
 * Manages popover state and click-outside detection for profile and
 * more options popovers in gossip posts.
 *
 * This hook encapsulates popover logic, making it reusable and keeping
 * the main component clean.
 */

import { useState, useRef, useEffect } from "react";

/**
 * Hook return type for popover management.
 */
export interface UsePostPopoversReturn {
  /** Whether profile popover is visible */
  showProfilePopover: boolean;
  /** Whether more options popover is visible */
  showMoreOptionsPopover: boolean;
  /** Toggle profile popover visibility */
  toggleProfilePopover: () => void;
  /** Toggle more options popover visibility */
  toggleMoreOptionsPopover: () => void;
  /** Close profile popover */
  closeProfilePopover: () => void;
  /** Close more options popover */
  closeMoreOptionsPopover: () => void;
  /** Ref for profile popover element */
  profilePopoverRef: React.RefObject<HTMLDivElement>;
  /** Ref for profile trigger element */
  profileTriggerRef: React.RefObject<HTMLDivElement>;
  /** Ref for more options popover element */
  moreOptionsPopoverRef: React.RefObject<HTMLDivElement>;
  /** Ref for more options trigger element */
  moreOptionsTriggerRef: React.RefObject<HTMLButtonElement>;
}

/**
 * Custom hook for managing popover state and click-outside detection.
 *
 * @returns Popover state and handlers
 *
 * @example
 * ```tsx
 * const {
 *   showProfilePopover,
 *   toggleProfilePopover,
 *   profilePopoverRef,
 *   profileTriggerRef,
 * } = usePostPopovers();
 * ```
 */
export function usePostPopovers(): UsePostPopoversReturn {
  const [showProfilePopover, setShowProfilePopover] = useState(false);
  const [showMoreOptionsPopover, setShowMoreOptionsPopover] = useState(false);

  const profilePopoverRef = useRef<HTMLDivElement>(null);
  const profileTriggerRef = useRef<HTMLDivElement>(null);
  const moreOptionsPopoverRef = useRef<HTMLDivElement>(null);
  const moreOptionsTriggerRef = useRef<HTMLButtonElement>(null);

  /**
   * Closes popovers when clicking outside.
   * Listens for mousedown events and checks if click is outside popover/trigger.
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      // Profile popover
      if (
        profilePopoverRef.current &&
        profileTriggerRef.current &&
        !profilePopoverRef.current.contains(event.target as Node) &&
        !profileTriggerRef.current.contains(event.target as Node)
      ) {
        setShowProfilePopover(false);
      }

      // More options popover
      if (
        moreOptionsPopoverRef.current &&
        moreOptionsTriggerRef.current &&
        !moreOptionsPopoverRef.current.contains(event.target as Node) &&
        !moreOptionsTriggerRef.current.contains(event.target as Node)
      ) {
        setShowMoreOptionsPopover(false);
      }
    };

    if (showProfilePopover || showMoreOptionsPopover) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfilePopover, showMoreOptionsPopover]);

  return {
    showProfilePopover,
    showMoreOptionsPopover,
    toggleProfilePopover: () => setShowProfilePopover((prev) => !prev),
    toggleMoreOptionsPopover: () => setShowMoreOptionsPopover((prev) => !prev),
    closeProfilePopover: () => setShowProfilePopover(false),
    closeMoreOptionsPopover: () => setShowMoreOptionsPopover(false),
    profilePopoverRef,
    profileTriggerRef,
    moreOptionsPopoverRef,
    moreOptionsTriggerRef,
  };
}

