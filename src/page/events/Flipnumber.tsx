import React, { useEffect, useState } from "react";

const FlipNumber = ({
  number,
  firstLoad: propFirstLoad,
}: {
  number: number;
  firstLoad: boolean;
}) => {
  const [prevNumber, setPrevNumber] = useState(number);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"up" | "down">("up");
  const [firstLoad, setFirstLoad] = useState(propFirstLoad);

  const lastTwoDigits = number % 100;
  const prevLastTwoDigits = prevNumber % 100;

  useEffect(() => {
    if (firstLoad) {
      setAnimating(true);
      const timeout = setTimeout(() => {
        setAnimating(false);
        setFirstLoad(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [firstLoad]);

  useEffect(() => {
    if (!firstLoad && prevNumber !== number) {
      setDirection(number > prevNumber ? "up" : "down");
      setAnimating(true);
      const timeout = setTimeout(() => {
        setAnimating(false);
        setPrevNumber(number);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [number, prevNumber, firstLoad]);

  const gradientStyle = {
    background: "linear-gradient(96.97deg, #FFBE92 3.5%, #FF4C1C 24.69%, rgba(239, 25, 137, 0.8) 71.84%, #FFB081 97.21%)",
    WebkitBackgroundClip: "text",
    color: "transparent",
  };

  const textBaseStyle = {
    fontFamily: "Ultra",
    fontWeight: 400,
    fontSize: "39px",
    lineHeight: "27px",
    letterSpacing: "0%",
    display: "inline-block",
    textAlign: "center" as const,
  };

  return (
    <div
      className="relative w-[44px] h-[49px] bg-white flex items-center justify-center rounded-[7.8px] mx-[3px] overflow-hidden"
      style={{
        boxShadow: "inset 2.45px 4.9px 4.9px rgba(89, 0, 30, 0.5)",
      }}
    >
      <div
        className="transition-transform duration-300 absolute top-0 left-0 w-full"
        style={{
          transform: animating
            ? direction === "up"
              ? "translateY(-50%)"
              : "translateY(50%)"
            : "translateY(0)",
          height: "200%",
        }}
      >
        <div className="h-1/2 flex items-center justify-center relative">
          <span
            style={{
              ...textBaseStyle,
              ...gradientStyle,
              WebkitTextStroke: "1px rgba(255, 76, 28, 1)",
              position: "absolute",
              zIndex: 1,
            }}
          >
            {prevNumber}
          </span>
          <span
            style={{
              ...textBaseStyle,
              ...gradientStyle,
              WebkitTextStroke: "1px rgba(255, 76, 28, 1)",
              position: "absolute",
              transform: "scale(1.2, 1.1)", 
              zIndex: 2,
            }}
          >
            {prevNumber}
          </span>
        </div>

        <div className="h-1/2 flex items-center justify-center relative">
          <span
            style={{
              ...textBaseStyle,
              ...gradientStyle,
              WebkitTextStroke: "1px rgba(255, 76, 28, 1)",
              position: "absolute",
              zIndex: 1,
              display: "inline-block",
            }}
          >
            {prevLastTwoDigits}
          </span>
          <span
            style={{
              ...textBaseStyle,
              ...gradientStyle,
              position: "absolute",
              zIndex: 2,
              transform: "scale(1.2, 1.1)",
              display: "inline-block",
            }}
          >
            {lastTwoDigits}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FlipNumber;
