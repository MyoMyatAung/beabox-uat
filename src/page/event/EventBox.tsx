import React, { useState, useEffect, useRef } from "react";

import "./event.css";
import logo from "./img/logoBox.png";
import light from "./img/light.json";
import card from "./img/card.json";
import btn2 from "./img/btn2.json";
import AsyncDecryptedImage from "@/utils/asyncDecryptedImage";
import Animation from "./Animation";
import { useVerifyCaptchaMutation } from "./eventApi";
import EventResultBox from "./EventResultBox";

declare global {
  interface Window {
    initGeetest4?: (
      config: { captchaId: string; product: string },
      callback: (gt: any) => void
    ) => void;
  }
}

interface EventBoxProps {
  eventData: any;
  setBox: any;
  referCode: any;
  isOpen: any;
  setIsOpen: any;
  setCode: any;
  shownextBox: any;
  setshownextBox: any;
  newData: any;
  setnewData: any;
  setEvent: any;
}

const EventBox: React.FC<EventBoxProps> = ({
  eventData,
  setBox,
  referCode,
  isOpen,
  setIsOpen,
  shownextBox,
  setshownextBox,
  setCode,
  newData,
  setnewData,
  setEvent,
}) => {
  const captchaRef = useRef<HTMLDivElement>(null);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [gt, setGt] = useState<any>(null);

  // Use the mutation hook from RTK Query
  const [verifyCaptcha] = useVerifyCaptchaMutation();

  useEffect(() => {
    if (showCaptcha) {
      const script = document.createElement("script");
      script.src = "http://static.geetest.com/v4/gt4.js";
      script.async = true;
      script.onload = initializeCaptcha;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
        if (gt) {
          gt.destroy();
        }
      };
    }
  }, [showCaptcha]);

  const initializeCaptcha = () => {
    if (window.initGeetest4 && captchaRef.current) {
      const captchaId = "3bf5c88f68ff49b654a40ac5528cdc73"; // Replace with your actual CAPTCHA ID
      const product = "bind"; // Set the product to "bind" to skip the "Click to verify" button

      window.initGeetest4(
        {
          captchaId: captchaId,
          product: product,
        },
        (gtInstance) => {
          setGt(gtInstance);
          gtInstance.appendTo("#captcha");

          // Directly show the CAPTCHA box without the "Click to verify" button
          gtInstance.showBox();

          gtInstance.onSuccess(() => {
            const result = gtInstance.getValidate();

            const resultData = {
              event_id: eventData?.data?.event?.id,
              refer_code: referCode,
              lot_number: result?.lot_number,
              captcha_output: result?.captcha_output,
              pass_token: result?.pass_token,
              gen_time: result?.gen_time,
            };

            try {
              const fetchData = async () => {
                const res = await verifyCaptcha(resultData);

                const result1 = res.data?.data;
                setshownextBox(true);
                setnewData(result1);
                setCode(result1?.geetest);
              };
              fetchData();
            } catch (error) {
              console.log(error);
            }
          });
        }
      );
    }
  };

  const handleEvent = () => {
    setShowCaptcha(true); // Trigger CAPTCHA to show when the event button is clicked
  };

  return (
    <div className="h-screen bg-black/80 w-screen flex flex-col gap-[20px] justify-center items-center fixed top-0 z-[9999]">
      {!shownextBox && !showCaptcha && (
        <>
          <div className="absolute z-[-2] top-[150px]">
            <Animation animate={light} />
          </div>
          <div className="w-[300px] h-[450px] flex flex-col justify-between items-center event_bo">
            <div className="absolute z-[-1]">
              <Animation animate={card} />
            </div>
            <div className="w-full h-full pt-[70px] pb-[30px] flex flex-col justify-between items-center">
              <img className="w-[210px] h-[70pxx]" src={logo} alt="" />
              <div className="flex flex-col justify-center items-center px-[30px]">
                <AsyncDecryptedImage
                  imageUrl={eventData.data.avatar}
                  className="w-[58px] h-[58px] rounded-full object-cover object-center"
                  alt="Profile"
                />
                <h1 className="user_invite_text mt-2">
                  '{eventData.data.name}'
                  邀请您一起使用笔盒，邀请好友瓜分百万现金红包！
                </h1>
              </div>
              <div className="">
                <button onClick={handleEvent}>
                  <Animation animate={btn2} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {shownextBox && (
        <>
          <EventResultBox
            eventData={eventData}
            newData={newData}
            setIsOpen={setIsOpen}
            isOpen={isOpen}
            setBox={setBox}
            setEvent={setEvent}
          />
        </>
      )}

      {/* Hidden captcha container */}
      {showCaptcha && (
        <div
          id="captcha"
          ref={captchaRef}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10000,
            visibility: "visible", // Ensure it is visible
            height: "auto",
            width: "auto",
          }}
        ></div>
      )}
    </div>
  );
};

export default EventBox;
