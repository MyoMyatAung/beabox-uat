import useCachedImage from "@/utils/useCachedImage";
import React, { useEffect, useRef } from "react";

type ImageWithPlaceholderProps = {
  src: string;
  alt: string;
  width: string | number;
  height: string | number;
  className?: string;
};

const ImageWithPlaceholder: React.FC<ImageWithPlaceholderProps> = ({
  src,
  alt,
  width,
  height,
  className = "",
  ...props
}) => {
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Immediately assign the image src when src changes.
  useEffect(() => {
    if (imgRef.current) {
      imgRef.current.src = src;
    }
  }, [src]);

  return (
    <div className="image-container bg-search-img">
      <img
        ref={imgRef}
        alt={alt}
        style={{
          minHeight: height,
          // opacity: 0,
          // transition: "opacity 0.3s ease-in"
        }}
        className={`${className} image-placeholder`}
        {...props}
      />
    </div>
  );
};

export default ImageWithPlaceholder;
