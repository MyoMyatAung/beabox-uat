import React, { useState, useEffect, forwardRef } from "react";
import { decryptImage } from "./imageDecrypt";

export interface AsyncDecryptedImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  imageUrl: string;
  defaultCover?: string;
}

const AsyncDecryptedImage = forwardRef<
  HTMLImageElement,
  AsyncDecryptedImageProps
>(
  (
    { imageUrl, defaultCover = "", alt, className, ...props },
    ref
  ) => {
    const [src, setSrc] = useState(defaultCover);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      let isMounted = true;
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
          if (isMounted) {
            setSrc(decryptedUrl);
            // Add a small delay before showing the image to ensure it's fully loaded
            setTimeout(() => {
              if (isMounted) {
                setIsLoading(false);
              }
            }, 50);
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
        if (previousBlobUrl && previousBlobUrl.startsWith("blob:")) {
          URL.revokeObjectURL(previousBlobUrl);
        }
      };
    }, [imageUrl, defaultCover]);

    // Add another effect to clean up blob URL when component unmounts
    useEffect(() => {
      return () => {
        // Final cleanup when component unmounts
        if (src && src.startsWith("blob:")) {
          URL.revokeObjectURL(src);
        }
      };
    }, []);

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
);

AsyncDecryptedImage.displayName = "AsyncDecryptedImage";

export default AsyncDecryptedImage;
