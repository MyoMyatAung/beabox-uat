import CryptoJS from "crypto-js";
import JSEncrypt from "jsencrypt";

// RSA Public Key (replace this with your actual public key)

/**
 * Encrypts the given data using the RSA public key and generates an HMAC signature.
 * @param {string} data - The plain text data to encrypt.
 * @returns {{ encryptedData: string, signature: string }} Encrypted data and HMAC signature.
 */
export function encryptAndSignData(data: string): {
  encryptedData: string;
  signature: string;
} {
  const encryptedData = encryptDataWithChunks(data);
  const signature = generateSignature(encryptedData);
  return { encryptedData, signature };
}

/**
 * Encrypts the given data using the RSA public key with chunking.
 * @param {string} data - The plain text data to encrypt.
 * @returns {string} URL-safe Base64 encoded encrypted data.
 */
function encryptDataWithChunks(data: string): string {
  try {
    const jsEncrypt = new JSEncrypt();
    jsEncrypt.setPublicKey(import.meta.env.VITE_PUBLIC_KEY_STRING);

    // Convert string to UTF-8 bytes
    const encoder = new TextEncoder();
    const binaryData = encoder.encode(data);

    // Split into 245-byte chunks
    const chunks = splitIntoByteChunks(binaryData, 245);

    // Encrypt each chunk and collect binary results
    const encryptedChunks = chunks.map((chunk) => {
      // Convert bytes to Latin-1 string for proper byte preservation
      const chunkString = new TextDecoder("utf-8").decode(chunk);
      const encrypted = jsEncrypt.encrypt(chunkString);
      if (!encrypted) throw new Error("RSA encryption failed for chunk");
      return base64ToBytes(encrypted);
    });

    // Concatenate all encrypted bytes
    const concatenated = concatenateUint8Arrays(encryptedChunks);

    // Convert to URL-safe Base64
    return bytesToUrlSafeBase64(concatenated);
  } catch (err) {
    console.error("Chunked Encryption failed:", err);
    throw new Error(`Encryption failed: ${err}`);
  }
}
function base64ToBytes(base64: string): Uint8Array {
  const raw = atob(base64);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    bytes[i] = raw.charCodeAt(i);
  }
  return bytes;
}

function concatenateUint8Arrays(arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((acc, arr) => acc + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

// function bytesToUrlSafeBase64(bytes: Uint8Array): string {
//   const base64 = btoa(String.fromCharCode(...bytes));
//   return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
// }

function bytesToUrlSafeBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunkSize = 0x8000; // 32768 bytes per chunk
  for (let i = 0; i < bytes.length; i += chunkSize) {
    // Process each chunk separately
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  // Convert to base64 and make it URL-safe
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Helper functions

function splitIntoByteChunks(
  data: Uint8Array,
  chunkSize: number
): Uint8Array[] {
  const chunks = [];
  for (let i = 0; i < data.length; i += chunkSize) {
    chunks.push(data.slice(i, i + chunkSize));
  }
  return chunks;
}

// function encryptDataWithChunks(data: string): string {
//   try {
//     const jsEncrypt = new JSEncrypt();
//     jsEncrypt.setPublicKey(import.meta.env.VITE_PUBLIC_KEY_STRING);

//     // Convert UTF-8 string to Base64 (so it preserves all characters properly)
//     const base64Data = btoa(unescape(encodeURIComponent(data))); // ✅ Proper encoding

//     // Split into 245-byte chunks (RSA padding limit)
//     const chunks = splitIntoByteChunks(
//       new TextEncoder().encode(base64Data),
//       245
//     );

//     // Encrypt each chunk
//     const encryptedChunks = chunks.map((chunk) => {
//       const chunkString = new TextDecoder().decode(chunk); // ✅ Decode safely
//       const encrypted = jsEncrypt.encrypt(chunkString);
//       if (!encrypted) throw new Error("RSA encryption failed for chunk");
//       return encrypted; // Keep it in base64 form
//     });

//     // Join all encrypted parts with a separator
//     return encryptedChunks.join(".");
//   } catch (err) {
//     console.error("Chunked Encryption failed:", err);
//     throw new Error(`Encryption failed: ${err}`);
//   }
// }

/**
 * Splits data into chunks of the specified size.
 * @param {string} data - The data to split into chunks.
 * @param {number} chunkSize - Maximum size of each chunk.
 * @returns {string[]} Array of chunks.
 */

/**
 * Generates an HMAC signature for the given data using the shared key.
 * @param {string} data - The data to sign.
 * @returns {string} Hexadecimal HMAC signature.
 */
function generateSignature(data: string): string {
  try {
    const hmac = CryptoJS.HmacMD5(data, import.meta.env.VITE_SIGN_KEY);
    return hmac.toString(CryptoJS.enc.Hex);
  } catch (err) {
    console.error("HMAC generation failed:", err);
    throw new Error(`HMAC generation failed: ${err}`);
  }
}

/**
 * URL-safe Base64 encoding
 * @param {string} data - The binary data to encode.
 * @returns {string} URL-safe Base64 encoded string.
 */

export function convertToSecurePayload(formData: any): any {
  //   const publicKey = process.env.REACT_APP_PUBLIC_KEY;

  if (!import.meta.env.VITE_PUBLIC_KEY_STRING) {
    throw new Error("Public key is not defined");
  }

  formData["timestamp"] = new Date().getTime();
  const { encryptedData, signature } = encryptAndSignData(
    JSON.stringify(formData)
  );

  return {
    pack: encryptedData,
    signature: signature,
  };
}

function convertUrlToFormData(url: string): Record<string, any> {
  const params: any = new URLSearchParams(url);
  const formData: Record<string, any> = { timestamp: new Date().getTime() };

  for (const [key, value] of params.entries()) {
    formData[key] = isNaN(value as any) ? value : Number(value); // Convert numeric strings to numbers
  }

  return formData;
}

function createSecureUrl(base: string, formData: Record<string, any>): string {
  const { encryptedData, signature } = encryptAndSignData(
    JSON.stringify(formData)
  );

  return `${base}?pack=${encodeURIComponent(
    encryptedData
  )}&signature=${encodeURIComponent(signature)}`;
}

export function convertToSecureUrl(apiUrl: string): string {
  const [base, query] = apiUrl.split("?", 2); // Split URL into base and query string
  const formData = query
    ? convertUrlToFormData(query)
    : { timestamp: new Date().getTime() };

  return createSecureUrl(base, formData);
}
