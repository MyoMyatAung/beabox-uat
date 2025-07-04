import { useEffect } from "react";

const useImagePreloader = (imageUrls: string[]) => {
  useEffect(() => {
    if (!imageUrls || imageUrls.length === 0) return;

    // Preload all images
    imageUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, [imageUrls]);
};

export default useImagePreloader;
