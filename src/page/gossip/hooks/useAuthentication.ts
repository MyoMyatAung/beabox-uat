/**
 * ============================================================================
 * AUTHENTICATION HOOK
 * ============================================================================
 *
 * Manages authentication state and provides utilities for checking
 * authentication status and triggering login flow.
 *
 * This hook encapsulates authentication logic, making it reusable across
 * components that need to verify user authentication before performing
 * actions (like, follow, report, etc.).
 */

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { setIsDrawerOpen } from "@/store/slices/profileSlice";

/**
 * Hook return type for authentication state and utilities.
 */
export interface UseAuthenticationReturn {
  /** Whether the user is currently authenticated */
  isAuthenticated: boolean;
  /** Ensures user is authenticated, opens login drawer if not */
  ensureAuthenticated: () => boolean;
}

/**
 * Custom hook for managing authentication state and checks.
 *
 * @returns Authentication state and utility functions
 *
 * @example
 * ```tsx
 * const { isAuthenticated, ensureAuthenticated } = useAuthentication();
 *
 * const handleLike = () => {
 *   if (!ensureAuthenticated()) return;
 *   // Proceed with like action
 * };
 * ```
 */
export function useAuthentication(): UseAuthenticationReturn {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.persist?.user);
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(user?.token)
  );

  // Update authentication state when user token changes
  useEffect(() => {
    setIsAuthenticated(Boolean(user?.token));
  }, [user?.token]);

  /**
   * Ensures the user is authenticated before proceeding with an action.
   * Opens the login drawer if the user is not authenticated.
   *
   * @returns true if authenticated, false otherwise
   */
  const ensureAuthenticated = (): boolean => {
    if (isAuthenticated) {
      return true;
    }
    dispatch(setIsDrawerOpen(true));
    return false;
  };

  return {
    isAuthenticated,
    ensureAuthenticated,
  };
}

