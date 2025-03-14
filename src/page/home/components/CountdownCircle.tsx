import React, { useEffect, useState } from "react";

interface CountdownCircleProps {
  countNumber: number;
}

const CountdownCircle: React.FC<CountdownCircleProps> = ({ countNumber }) => {
  const [progress, setProgress] = useState(0);

  // Reset and start the animation when countNumber changes
  useEffect(() => {
    setProgress(0);

    const duration = 3000; // 3 seconds
    const interval = 50; // Update every 50ms
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setProgress((currentStep / steps) * 100);

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [countNumber]);

  return (
    <div className="relative w-[40px] h-[40px] rounded-full overflow-hidden shadow-lg">
      {/* Gradient background */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "linear-gradient(135deg, #CD3EFF 0%, #FF449E 100%)",
        }}
      />

      {/* Overlay that reveals the gradient as it counts down */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(
            transparent 0deg,
            #5151fc ${progress * 3.6}deg,
            transparent ${progress * 3.6}deg,
            transparent 360deg
          )`,
          transform: "rotate(0deg)",
        }}
      />

      {/* Text overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-white text-sm font-bold"
          style={{ textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}
        >
          x{countNumber}
        </span>
      </div>
    </div>
  );
};

export default CountdownCircle;
