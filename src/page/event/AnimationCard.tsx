import React from "react";
import { useLottie } from "lottie-react";

interface AnimationProps {
  animate: any;
}

const AnimationCard: React.FC<AnimationProps> = ({ animate }) => {
  const options = {
    animationData: animate,
    loop: false,
  };

  const { View } = useLottie(options);

  return <>{View}</>;
};

export default AnimationCard;
