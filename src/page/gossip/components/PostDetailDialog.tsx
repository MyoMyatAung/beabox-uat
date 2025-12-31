/**
 * ============================================================================
 * POST DETAIL DIALOG COMPONENT
 * ============================================================================
 *
 * Fullscreen dialog for displaying post details without navigation.
 * This component provides an overlay that covers the entire screen when viewing
 * a post's full details.
 *
 * KEY FEATURES:
 * - Uses Redux to manage open/close state globally
 * - Lazy loads PostDetailContent for performance optimization
 * - Shows loading spinner while content is being loaded
 * - Preserves scroll position of underlying content
 *
 * STATE MANAGEMENT:
 * Controlled by postDetailDialogSlice which stores:
 * - isOpen: Boolean to show/hide the dialog
 * - postId: ID of the post to display
 * - post: Optional initial post data for immediate display
 *
 * @see postDetailDialogSlice for state management
 * @see PostDetailContent for the actual post content
 */

import { useSelector, useDispatch } from "react-redux";
import { lazy, Suspense } from "react";
import { RootState } from "@/store/store";
import { closePostDetailDialog } from "@/store/slices/postDetailDialogSlice";
import LoadingSpinner from "./LoadingSpinner";

// Lazy load for code splitting - PostDetailContent is heavy
const PostDetailContent = lazy(() => import("./PostDetailContent"));

/**
 * Dialog wrapper for post details.
 *
 * @returns Fullscreen dialog with post content, or null if not open
 */
const PostDetailDialog = () => {
  const dispatch = useDispatch();
  const { isOpen, postId, post } = useSelector(
    (state: RootState) => state.postDetailDialog
  );

  // Don't render anything if dialog is closed or no post ID
  if (!isOpen || !postId) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#16131C]">
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <LoadingSpinner />
          </div>
        }
      >
        <PostDetailContent
          postId={postId}
          initialPost={post}
          onClose={() => dispatch(closePostDetailDialog())}
        />
      </Suspense>
    </div>
  );
};

export default PostDetailDialog;
