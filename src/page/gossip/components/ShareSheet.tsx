/**
 * ============================================================================
 * SHARE SHEET COMPONENT
 * ============================================================================
 *
 * Displays bottom sheet modal for sharing posts.
 * Provides share options and copy link functionality.
 *
 * This component handles the share UI, keeping it separate from the
 * main post component for better maintainability and reusability.
 */

import SharePost from "./SharePost";

/**
 * Props for ShareSheet component.
 */
export interface ShareSheetProps {
  /** Whether sheet is visible */
  isOpen: boolean;
  /** Share URL to display and copy */
  shareUrl: string;
  /** Callback when sheet should be closed */
  onClose: () => void;
}

/**
 * Share sheet component displaying share options in a bottom modal.
 *
 * @param props - Component props
 * @returns Bottom sheet modal with share options
 */
export default function ShareSheet({
  isOpen,
  shareUrl,
  onClose,
}: ShareSheetProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[1000000] flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Sheet Content */}
      <div className="relative w-full max-w-md bg-[#191721] rounded-t-2xl shadow-xl transform transition-transform duration-200 translate-y-0">
        {/* Drag Handle */}
        <div className="flex justify-center py-2">
          <div className="h-1 w-12 bg-gray-300 rounded-full" />
        </div>
        {/* Share Component */}
        <SharePost shareUrl={shareUrl} onClose={onClose} />
      </div>
    </div>
  );
}

