/**
 * Version utility functions
 * Single Responsibility: Handle version-related operations
 */

/**
 * Converts a version string to numeric format
 * Example: "1.1.6.8" -> "1168"
 * @param version - Version string in format "x.y.z.w"
 * @returns Numeric version string or empty string if invalid
 */
export const convertVersionToNumeric = (version: string | undefined): string => {
  if (!version) return "";
  return version.split(".").join("");
};

