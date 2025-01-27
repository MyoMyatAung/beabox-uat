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

    // Split data into chunks to fit RSA key size limitations (2048-bit RSA key -> max chunk size ~245 bytes)
    const chunks = splitIntoChunks(data, 245);
    const encryptedChunks = chunks.map((chunk) => {
      const encrypted = jsEncrypt.encrypt(chunk);
      if (!encrypted) throw new Error("RSA encryption failed for chunk.");
      return encrypted;
    });

    // Concatenate encrypted chunks and perform URL-safe Base64 encoding
    const concatenated = encryptedChunks.join("");
    return urlSafeBase64Encode(concatenated);
  } catch (err) {
    console.error("Chunked Encryption failed:", err);
    throw new Error(`Encryption failed: ${err}`);
  }
}

/**
 * Splits data into chunks of the specified size.
 * @param {string} data - The data to split into chunks.
 * @param {number} chunkSize - Maximum size of each chunk.
 * @returns {string[]} Array of chunks.
 */
function splitIntoChunks(data: string, chunkSize: number): string[] {
  const chunks = [];
  for (let i = 0; i < data.length; i += chunkSize) {
    chunks.push(data.slice(i, i + chunkSize));
  }
  return chunks;
}

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
function urlSafeBase64Encode(data: string): string {
  return data.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

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
