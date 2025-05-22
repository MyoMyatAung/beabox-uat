import { useEffect, useRef, useState } from "react";
import { decryptImage } from "@/utils/imageDecrypt";
import covergradient from "@/assets/profile/cover-gradient.png";
import "../explore.css";

type ImageWithPlaceholderProps = {
  src: string;
  alt: string;
  width: string | number;
  height: string | number;
  className: string;
  needGradient?: boolean;
};

const ImageWithPlaceholder1 = ({
  src,
  alt,
  width,
  height,
  className,
  needGradient,
  ...props
}: ImageWithPlaceholderProps) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [decryptedSrc, setDecryptedSrc] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            try {
              const decryptedUrl = await decryptImage(src);
              if (imgRef.current) {
                imgRef.current.onload = () => {
                  URL.revokeObjectURL(decryptedUrl); // revoke after image is loaded
                };
              }
              setDecryptedSrc(decryptedUrl);
            } catch (error) {
              console.error("Error decrypting image:", error);
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
  }, [src]);

  return (
    <div
      ref={containerRef}
      className={`image-container_exp bg-black relative ${className}`}
      style={{ width, height }}
    >
      <img
        ref={imgRef}
        src={decryptedSrc || ""}
        alt={alt}
        className={`${className} image-placeholder`}
        {...props}
        style={{
          opacity: decryptedSrc ? "1" : "0",
          transition: "opacity 0.3s",
        }}
      />
      {needGradient && (
        <img
          className={`h-[170px] w-full  absolute bottom-0`}
          src={covergradient}
          alt=""
        />
      )}
    </div>
  );
};

export default ImageWithPlaceholder1;
