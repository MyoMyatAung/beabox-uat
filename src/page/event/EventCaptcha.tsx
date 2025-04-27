import React from "react";
import GeetestCaptcha from "./GeetestCaptcha";

const EventCaptcha = () => {
  return (
    <div className="h-screen bg-black/80 w-screen flex flex-col gap-[20px] justify-center items-center fixed top-0 z-[9999]">
      <GeetestCaptcha />
    </div>
  );
};

export default EventCaptcha;
