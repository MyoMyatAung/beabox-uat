export async function decryptImage(imageUrl: any, defaultCover = "") {
  if (!imageUrl.endsWith(".txt")) {
    return imageUrl;
  }

  try {
    // Fetch encrypted data
    const response = await fetch(imageUrl);
    const encryptedData = await response.arrayBuffer();

    // XOR decryption (first 4096 bytes)
    const decryptedData = new Uint8Array(encryptedData);
    const key = 0x12;
    const maxSize = Math.min(4096, decryptedData.length);

    for (let i = 0; i < maxSize; i++) {
      decryptedData[i] ^= key;
    }

    // Decode decrypted bytes as text (data URL)
    const decryptedStr = new TextDecoder().decode(decryptedData);
    return decryptedStr;
  } catch (error) {
    console.error("Error decrypting image:", error);
    return defaultCover || imageUrl;
  }
}
