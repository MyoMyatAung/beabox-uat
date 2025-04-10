export async function decryptImage(imageUrl: string, defaultCover = "") {
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
    
    // Convert the data URL to a Blob and create a blob URL
    if (decryptedStr.startsWith('data:')) {
      try {
        // Extract mime type and base64 data
        const matches = decryptedStr.match(/^data:([^;]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
          throw new Error('Invalid data URL format');
        }
        
        const mimeType = matches[1];
        const base64Data = matches[2];
        
        // Convert base64 to binary
        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        // Create Blob and blob URL
        const blob = new Blob([bytes], { type: mimeType });
        return URL.createObjectURL(blob);
      } catch (err) {
        console.error('Error converting data URL to blob:', err);
        // Fall back to data URL if conversion fails
        return decryptedStr;
      }
    }
    
    return decryptedStr;
  } catch (error) {
    console.error("Error decrypting image:", error);
    return defaultCover || imageUrl;
  }
}
