import React, { useEffect, useRef, useState } from "react";

// Function to generate a random color (for the gradient effect)
const getRandomColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

const CircleCountDown = ({ time = 3000 }) => {
  const canvasRef = useRef(null);
  const [progressAngle, setProgressAngle] = useState(0);
  const [textNumber, setTextNumber] = useState(0);
  const [isCounting, setIsCounting] = useState(false); // To track the countdown state

  // Start the countdown
  const startCountdown = (timeMillis: any) => {
    setIsCounting(true);
    let progress = 0;

    const countdownInterval = setInterval(() => {
      progress = 1 - (progress + 50) / timeMillis;
      setProgressAngle(progress * 360);

      if (progress <= 0) {
        clearInterval(countdownInterval);
        setIsCounting(false);
        setTextNumber((prev) => prev + 1); // Increase the count on finish
      }
    }, 50);
  };

  // Increase countdown and reset
  const increaseCountDown = () => {
    setTextNumber((prev) => prev + 1);
    startCountdown(time); // Pass the `time` prop as the countdown time
  };

  // Release the countdown (hide the circle and reset)
  const releaseView = () => {
    setIsCounting(false);
    setTextNumber(0);
    setProgressAngle(0);
  };

  // Drawing the circle and progress on the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const radius = canvas.width / 2;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const padding = 30;
    const rectF = {
      x: padding,
      y: padding,
      width: canvas.width - padding * 2,
      height: canvas.height - padding * 2,
    };

    // Set the background gradient
    const backgroundGradient = ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height
    );
    backgroundGradient.addColorStop(0, "#FF449E");
    backgroundGradient.addColorStop(1, "#CD3EFF");
    ctx.fillStyle = backgroundGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set progress gradient (sweep)
    const progressGradient = ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height
    );
    progressGradient.addColorStop(0, "#FF449E");
    progressGradient.addColorStop(1, "#CD3EFF");
    ctx.strokeStyle = progressGradient;
    ctx.lineWidth = 15;
    ctx.lineCap = "round";

    // Draw the background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - padding, 0, Math.PI * 2);
    ctx.fillStyle = backgroundGradient;
    ctx.fill();

    // Draw the progress arc
    ctx.beginPath();
    ctx.arc(
      centerX,
      centerY,
      radius - padding,
      -Math.PI / 2,
      -Math.PI / 2 + Math.PI * 2 * (progressAngle / 360)
    );
    ctx.stroke();

    // Draw the text in the center
    ctx.fillStyle = "white";
    ctx.font = "bold 30px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`x${textNumber}`, centerX, centerY);

    // Reset context for future draws
    ctx.resetTransform();
  }, [progressAngle, textNumber]);

  return (
    <div className="circle-container">
      <canvas
        ref={canvasRef}
        id="circleCanvas"
        width="200"
        height="200"
        style={{ position: "absolute", top: 0, left: 0 }}
      />
      <div className="text-overlay">
        <span>{`x${textNumber}`}</span>
      </div>
      <button onClick={increaseCountDown} disabled={isCounting}>
        Start Countdown
      </button>
      <button onClick={releaseView}>Hide</button>
    </div>
  );
};

export default CircleCountDown;
