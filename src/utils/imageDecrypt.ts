/**
 * Decrypts an image URL if it's encrypted (i.e., ends with ".txt").
 * If the URL is not encrypted, it returns the original URL.
 *
 * @param {string} imageUrl - The URL of the image to decrypt.
 * @param {string} [defaultCover=""] - (Optional) Fallback URL if decryption fails.
 * @returns {Promise<string>} - A promise that resolves to the decrypted image URL or the original/default URL.
 */
export async function decryptImage(imageUrl: string, defaultCover = ""): Promise<string> {
  if (!imageUrl.endsWith(".txt")) {
    return imageUrl;
  }

  try {
    // Fetch encrypted image data
    const response = await fetch(imageUrl);
    const encryptedData = await response.arrayBuffer();

    // XOR decryption with key 0x12
    const decryptedData = new Uint8Array(encryptedData);
    const key = 0x12;
    const maxSize = Math.min(4096, decryptedData.length);

    for (let i = 0; i < maxSize; i++) {
      decryptedData[i] ^= key;
    }

    // Simple MIME type detection based on file signature
    let mimeType = "image/jpeg"; // default MIME type
    if (decryptedData[0] === 0x89 && decryptedData[1] === 0x50) {
      mimeType = "image/png";
    } else if (decryptedData[0] === 0x47 && decryptedData[1] === 0x49) {
      mimeType = "image/gif";
    }

    // Create a blob URL from the decrypted data
    const blob = new Blob([decryptedData], { type: mimeType });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Error decrypting image:", error);
    return defaultCover || imageUrl;
  }
}
