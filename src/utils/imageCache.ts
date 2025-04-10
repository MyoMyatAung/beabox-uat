// utils/imageCache.ts
const DB_NAME = 'ImageCache';
const STORE_NAME = 'images';
const MEMORY_CACHE = new Map<string, string>();
const BLOB_URLS = new Map<string, string>();

const openDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 3); // Version bump for schema change

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'url' });
      } else {
        // If store exists but we're upgrading (v2 to v3), clear it
        // This ensures we don't mix blob and base64 storage types
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.clear();
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Clean up all blob URLs created by this cache
export const cleanupBlobUrls = () => {
  BLOB_URLS.forEach((blobUrl) => {
    URL.revokeObjectURL(blobUrl);
  });
  BLOB_URLS.clear();
};

export const getCachedImage = async (url: string): Promise<string | null> => {
  try {
    // Check memory cache first
    if (MEMORY_CACHE.has(url)) {
      return MEMORY_CACHE.get(url)!;
    }

    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(url);
    
    return new Promise((resolve) => {
      request.onsuccess = () => {
        if (!request.result) {
          resolve(null);
          return;
        }

        // Check if we have a blob or base64 (supporting older cache entries)
        if (request.result.blob) {
          // Create a new blob URL
          const blobUrl = URL.createObjectURL(request.result.blob);
          MEMORY_CACHE.set(url, blobUrl);
          BLOB_URLS.set(url, blobUrl);
          resolve(blobUrl);
        } else if (request.result.base64) {
          // Legacy support for base64
          MEMORY_CACHE.set(url, request.result.base64);
          resolve(request.result.base64);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => resolve(null);
    });
  } catch (error) {
    console.error('Error retrieving cached image:', error);
    return null;
  }
};

export const storeImage = async (url: string, blob: Blob) => {
  try {
    // Revoke old blob URL if it exists
    if (BLOB_URLS.has(url)) {
      URL.revokeObjectURL(BLOB_URLS.get(url)!);
    }

    // Create a new blob URL
    const blobUrl = URL.createObjectURL(blob);
    
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    // Store the blob directly - no need for base64 conversion
    store.put({ url, blob });
    
    MEMORY_CACHE.set(url, blobUrl);
    BLOB_URLS.set(url, blobUrl);
    
    return blobUrl;
  } catch (error) {
    console.error('Error storing image:', error);
    return null;
  }
};

// Add a window unload listener to clean up blob URLs
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', cleanupBlobUrls);
}