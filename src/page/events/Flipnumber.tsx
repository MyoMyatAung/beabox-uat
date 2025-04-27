import React, { useEffect, useState } from "react";

const FlipNumber = ({ number }: { number: number }) => {
  const [prevNumber, setPrevNumber] = useState(number);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"up" | "down">("up");

  useEffect(() => {
    if (prevNumber !== number) {
      setDirection(number > prevNumber ? "up" : "down"); // detect direction
      setAnimating(true);
      const timeout = setTimeout(() => {
        setAnimating(false);
        setPrevNumber(number);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [number, prevNumber]);

  return (
    <div
      className="relative w-[44px] h-[49px] bg-white flex items-center justify-center rounded-[7.8px] mx-[3px] overflow-hidden"
      style={{
        boxShadow: "inset 2.45px 4.9px 4.9px rgba(89, 0, 30, 0.5)",
        fontFamily: "Ultra",
      }}
    >
      <div
        className={`transition-transform duration-300 absolute top-0 left-0 w-full`}
        style={{
          transform: animating
            ? direction === "up"
              ? "translateY(-50%)" // increasing → bottom to top
              : "translateY(50%)"  // decreasing → top to bottom
            : "translateY(0)",
          height: "200%",
        }}
      >
        <div className="h-1/2 flex items-center justify-center text-[39.2px] leading-[26.95px] font-normal">
          <span className="bg-gradient-to-r from-[#FFBE92] text-[#FF4C1C] via-[40%] to-[#EF1989CC] bg-clip-text text-transparent">
            {prevNumber}
          </span>
        </div>

        <div className="h-1/2 flex items-center justify-center text-[39.2px] leading-[26.95px] font-normal">
          <span className="bg-gradient-to-r from-[#FFBE92] via-[#FF4C1C] via-[40%] to-[#EF1989CC] bg-clip-text text-transparent">
            {number}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FlipNumber;
