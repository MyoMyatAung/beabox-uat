import { useState } from "react";

interface ImageWithSkeletonProps {
  src: string;
  alt?: string;
  className?: string;
  rounded?: boolean;
}

const ImageWithSkeleton: React.FC<ImageWithSkeletonProps> = ({
  src,
  alt = "",
  className = "",
  rounded = false,
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-white/20 animate-pulse rounded-lg z-10" />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover ${!loaded ? 'invisible' : 'visible'} ${rounded && ' rounded-md'}`}
      />
    </div>
  );
};

export default ImageWithSkeleton;
