import React, { useState, useEffect, forwardRef, memo } from "react";
import { decryptImage } from "./imageDecrypt";

// Global image cache to avoid re-decrypting the same images
const imageCache: Record<string, string> = {};

export interface AsyncDecryptedImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  imageUrl: string;
  defaultCover?: string;
}

const AsyncDecryptedImage = memo(forwardRef<
  HTMLImageElement,
  AsyncDecryptedImageProps
>(
  (
    { imageUrl, defaultCover = "", alt, className, ...props },
    ref
  ) => {
    const [src, setSrc] = useState(() => {
      // Initialize with cached image if available
      return imageCache[imageUrl] || defaultCover;
    });
    const [isLoading, setIsLoading] = useState(!imageCache[imageUrl]);

    useEffect(() => {
      let isMounted = true;
      
      // If the image is already in cache, use it immediately
      if (imageCache[imageUrl]) {
        setSrc(imageCache[imageUrl]);
        setIsLoading(false);
        return;
      }

      // Capture the previous blob URL to revoke it on cleanup
      const previousBlobUrl = src && src !== defaultCover ? src : null;

      // Reset loading state when image URL changes
      setIsLoading(true);

      // If imageUrl is empty or null, use defaultCover and exit early
      if (!imageUrl || imageUrl.trim() === "") {
        if (isMounted) {
          setSrc(defaultCover);
          setIsLoading(false);
        }
        return;
      }

      async function loadImage() {
        try {
          const decryptedUrl = await decryptImage(imageUrl, defaultCover);
          
          // Add to cache
          imageCache[imageUrl] = decryptedUrl;
          
          if (isMounted) {
            setSrc(decryptedUrl);
            // Set loaded immediately since we're caching
            setIsLoading(false);
          } else if (decryptedUrl.startsWith('blob:')) {
            // Clean up blob URL if component is no longer mounted
            URL.revokeObjectURL(decryptedUrl);
          }
        } catch (error) {
          console.error("Error loading decrypted image:", error);
          if (isMounted) {
            setSrc(defaultCover);
            setIsLoading(false);
          }
        }
      }
      
      loadImage();

      return () => {
        isMounted = false;
        // Revoke previous blob URL to prevent memory leaks
        if (previousBlobUrl && previousBlobUrl.startsWith("blob:") && previousBlobUrl !== imageCache[imageUrl]) {
          URL.revokeObjectURL(previousBlobUrl);
        }
      };
    }, [imageUrl, defaultCover]);

    // Use the same style of img but with opacity transition while loading
    return <img 
      ref={ref} 
      className={className} 
      src={src} 
      alt={alt} 
      style={{ 
        opacity: isLoading ? 0 : 1,
        transition: "opacity 0.1s ease-in-out"
      }}
      {...props} 
    />;
  }
), (prevProps, nextProps) => {
  // Custom comparison function for memo
  // Only re-render if the imageUrl changed
  return prevProps.imageUrl === nextProps.imageUrl;
});

AsyncDecryptedImage.displayName = "AsyncDecryptedImage";

export default AsyncDecryptedImage;
