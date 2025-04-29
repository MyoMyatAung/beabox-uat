// src/components/AnimationLoader.tsx

import React from "react";
import Lottie from "lottie-react";

interface AnimationLoaderProps {
  animationData: any;
  width?: number;
  height?: number;
  loop?: boolean;
  className?: string;
  onClick?: () => void;  
}

const AnimationLoader: React.FC<AnimationLoaderProps> = ({
  animationData,
  width = 200,
  height = 200,
  loop = true,
  className = "",
  onClick
}) => {
  return (
    <div onClick={onClick} className={`flex items-center justify-center ${className}`}>
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay
        style={{ width, height }}
      />
    </div>
  );
};

export default AnimationLoader;
