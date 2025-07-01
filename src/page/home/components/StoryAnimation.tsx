import React from "react";
import { useLottie } from "lottie-react";

interface AnimationProps {
  animate: any;
  flip: boolean;
}

const StoryAnimation: React.FC<AnimationProps> = ({ animate, flip }) => {
  const options = {
    animationData: animate,
    loop: true,
  };

  const { View } = useLottie(options);

  return <div style={{ transform: flip ? "scaleX(-1)" : "" }}>{View}</div>;
};

export default StoryAnimation;
