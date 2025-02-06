// utils/imageCache.ts
const DB_NAME = 'ImageCache';
const STORE_NAME = 'images';
const MEMORY_CACHE = new Map<string, string>();

const openDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 2); // Version bump

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'url' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
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
        const result = request.result?.base64;
        if (result) {
          MEMORY_CACHE.set(url, result);
          resolve(result);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => resolve(null);
    });
  } catch (error) {
    return null;
  }
};

export const storeImage = async (url: string, blob: Blob) => {
  try {
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });

    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ url, base64 });
    
    MEMORY_CACHE.set(url, base64);
  } catch (error) {
    console.error('Error storing image:', error);
  }
};