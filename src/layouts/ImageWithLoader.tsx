import { useState } from "react";

interface ImageWithSkeletonProps {
  src: string;
  alt?: string;
  className?: string;
}

const ImageWithSkeleton: React.FC<ImageWithSkeletonProps> = ({
  src,
  alt = "",
  className = "",
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
        className={`w-full h-full object-cover ${!loaded ? 'invisible' : 'visible'}`}
      />
    </div>
  );
};

export default ImageWithSkeleton;
