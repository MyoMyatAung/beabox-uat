/**
 * ============================================================================
 * ERROR UTILITY FUNCTIONS
 * ============================================================================
 *
 * Centralized error handling utilities for extracting user-friendly error
 * messages from various error types (API errors, network errors, etc.).
 *
 * This follows the Single Responsibility Principle by isolating error
 * parsing logic from business components.
 */

/**
 * Extracts a user-friendly error message from various error types.
 * Handles RTK Query errors, network errors, and generic error objects.
 *
 * @param error - The error object to parse
 * @returns A user-friendly error message string
 *
 * @example
 * ```ts
 * try {
 *   await someApiCall();
 * } catch (error) {
 *   const message = getErrorMessage(error);
 *   showToast(message);
 * }
 * ```
 */
export function getErrorMessage(error: unknown): string {
  // Handle string errors directly
  if (typeof error === "string") {
    return error;
  }

  // Handle error objects
  if (error && typeof error === "object") {
    const maybeError = error as {
      data?: { message?: string };
      error?: string;
      message?: string;
    };

    // RTK Query error format: error.data.message
    if (
      maybeError.data &&
      typeof maybeError.data === "object" &&
      "message" in maybeError.data &&
      maybeError.data.message
    ) {
      return maybeError.data.message;
    }

    // Standard error format: error.message
    if (typeof maybeError.message === "string" && maybeError.message) {
      return maybeError.message;
    }

    // Alternative error format: error.error
    if (typeof maybeError.error === "string" && maybeError.error) {
      return maybeError.error;
    }
  }

  // Fallback to default message
  return "操作失败，请稍后再试";
}

