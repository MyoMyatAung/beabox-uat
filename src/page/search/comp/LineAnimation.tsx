import React from "react";
import { useLottie } from "lottie-react";

interface AnimationProps {
  animate: any;
}

const Animation: React.FC<AnimationProps> = ({ animate }) => {
  const options = {
    animationData: animate,
    loop: true,
  };

  const { View } = useLottie(options);

  return <>{View}</>;
};

export default Animation;
