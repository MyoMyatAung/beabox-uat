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

    useEffect(() => {
      let isMounted = true;
      // Capture the previous blob URL to revoke it on cleanup
      const previousBlobUrl = src && src !== defaultCover ? src : null;

      async function loadImage() {
        try {
          const decryptedUrl = await decryptImage(imageUrl, defaultCover);
          if (isMounted) {
            setSrc(decryptedUrl);
          } else if (decryptedUrl.startsWith('blob:')) {
            // Clean up blob URL if component is no longer mounted
            URL.revokeObjectURL(decryptedUrl);
          }
        } catch (error) {
          console.error("Error loading decrypted image:", error);
          if (isMounted) {
            setSrc(defaultCover);
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

    return <img ref={ref} className={className} src={src} alt={alt} {...props} />;
  }
);

AsyncDecryptedImage.displayName = "AsyncDecryptedImage";

export default AsyncDecryptedImage;
