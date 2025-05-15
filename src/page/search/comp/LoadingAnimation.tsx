import React, { useState, useEffect } from "react";
import LineAnimation from "./LineAnimation";
import line from "@/assets/line.json";

const LoadingAnimation = ({
  postId,
  loadingVideoId,
}: {
  postId: any;
  loadingVideoId: any;
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStartedAt, setAnimationStartedAt] = useState<number | null>(
    null
  );

  useEffect(() => {
    let timeout: any;

    if (loadingVideoId === postId && !isAnimating) {
      // Start animation
      setIsAnimating(true);
      setAnimationStartedAt(Date.now());
    } else if (loadingVideoId === null && isAnimating) {
      setIsAnimating(false);
      setAnimationStartedAt(null);
      // If condition becomes false, check if 1.5s has passed
      // const elapsed = animationStartedAt ? Date.now() - animationStartedAt : 0;
      // const remainingTime = 1500 - elapsed;

      // if (remainingTime > 0) {
      //   // Keep animation running until 1.5s
      //   timeout = setTimeout(() => {
      //     setIsAnimating(false);
      //     setAnimationStartedAt(null);
      //   }, remainingTime);
      // } else {
      //   // Animation already completed, hide immediately
      //   setIsAnimating(false);
      //   setAnimationStartedAt(null);
      // }
    } else if (loadingVideoId !== postId && isAnimating) {
      // If loadingVideoId is not postId and animation is running, stop it
      setIsAnimating(false);
      setAnimationStartedAt(null);
    }

    return () => clearTimeout(timeout); // Cleanup timeout
  }, [loadingVideoId, postId, isAnimating, animationStartedAt]);

  return (
    <>
      {isAnimating && (
        <div className="loading-line-container absolute top-0 left-0 w-full h-[2px]">
          <LineAnimation animate={line} />
          {/* <div className="loading-line"></div> */}
        </div>
      )}
    </>
  );
};

export default LoadingAnimation;
