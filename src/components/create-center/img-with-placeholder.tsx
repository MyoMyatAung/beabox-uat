import { useEffect, useRef, useState } from "react";
import { decryptImage } from "@/utils/imageDecrypt";
import covergradient from "@/assets/profile/cover-gradient.png";

type ImageWithPlaceholderProps = {
  src: string;
  alt: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  needGradient?: boolean;
  useBlurBackground?: boolean;
  backgroundBlur?: string;
  backgroundScale?: string;
};

const ImageWithPlaceholder = ({
  src,
  alt,
  width,
  height,
  className = "",
  needGradient = false,
  useBlurBackground = false,
  backgroundBlur = "blur-sm",
  backgroundScale = "scale-110",
  ...props
}: ImageWithPlaceholderProps) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const backgroundImgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [decryptedSrc, setDecryptedSrc] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!src) {
      setIsLoading(false);
      return;
    }

    const observer = new IntersectionObserver(
      async (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            try {
              setIsLoading(true);
              const decryptedUrl = await decryptImage(src);
              
              setDecryptedSrc(decryptedUrl);
              setIsLoading(false);
              
              // Clean up blob URL after a delay
              if (decryptedUrl.startsWith("blob:")) {
                setTimeout(() => URL.revokeObjectURL(decryptedUrl), 5000);
              }
            } catch (error) {
              console.error("Error decrypting image:", error);
              setIsLoading(false);
            }
            observer.disconnect();
          }
        }
      },
      {
        rootMargin: "100px",
        threshold: 0.1,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [src, useBlurBackground]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (decryptedSrc && decryptedSrc.startsWith("blob:")) {
        URL.revokeObjectURL(decryptedSrc);
      }
    };
  }, [decryptedSrc]);

  const containerStyles = {
    width: width || "100%",
    height: height || "100%",
  };

  const imageOpacity = decryptedSrc && !isLoading ? "1" : "0";

  return (
    <div
      ref={containerRef}
      className={`relative bg-gray-200 w-full h-full ${useBlurBackground ? "overflow-hidden" : ""} ${className}`}
      style={containerStyles}
    >
      {/* Background blur image */}
      {useBlurBackground && decryptedSrc && (
        <img
          ref={backgroundImgRef}
          src={decryptedSrc}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover ${backgroundBlur} ${backgroundScale} z-0`}
          style={{
            opacity: imageOpacity,
            transition: "opacity 0.3s ease-in-out",
          }}
        />
      )}

      {/* Main image */}
      {decryptedSrc && (
        <img
          ref={imgRef}
          src={decryptedSrc}
          alt={alt}
          className={`${useBlurBackground ? "absolute inset-0 z-10" : ""} w-full h-full object-contain`}
          {...props}
          style={{
            opacity: imageOpacity,
            transition: "opacity 0.3s ease-in-out",
          }}
        />
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse z-20 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Gradient overlay */}
      {needGradient && (
        <img
          className="h-[170px] w-full absolute bottom-0 z-30"
          src={covergradient}
          alt=""
        />
      )}
    </div>
  );
};

export default ImageWithPlaceholder;