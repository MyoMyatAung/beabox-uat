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
      const previousBlobUrl = src;

      async function loadImage() {
        const decryptedUrl = await decryptImage(imageUrl, defaultCover);
        if (isMounted) {
          setSrc(decryptedUrl);
        }
      }
      loadImage();

      return () => {
        isMounted = false;
        if (previousBlobUrl && previousBlobUrl.startsWith("blob:")) {
          URL.revokeObjectURL(previousBlobUrl);
        }
      };
    }, [imageUrl, defaultCover]);

    return <img ref={ref} className={className} src={src} alt={alt} {...props} />;
  }
);

AsyncDecryptedImage.displayName = "AsyncDecryptedImage";

export default AsyncDecryptedImage;
