import React, { useEffect, useState } from "react";
import "../event.css";

import light from "../img/light.json";
import card from "../img/dargon1.json";
import suprise from "../img/suprise.json";

import AsyncDecryptedImage from "@/utils/asyncDecryptedImage";
import Animation from "../Animation";

import { useDispatch } from "react-redux";

import { setPlay } from "../../home/services/playSlice";
import AnimationCard from "../AnimationCard";
// import AnimationCard from "./AnimationCard";

interface EventBoxProps {
  eventData: any;
  newData: any;
  setIsOpen: any;
  isOpen: any;
  setBox: any;
  setEvent: any;
}

const DEventResultBox: React.FC<EventBoxProps> = ({
  eventData,
  newData,
  setIsOpen,
  isOpen,
  setBox,
  setEvent,
}) => {
  const [close, setClose] = useState(false);
  const [showBonus, setShowBonus] = useState(false); // State for showing bonus after 1 second

  const dispatch = useDispatch();

  useEffect(() => {
    setShowBonus(false);
    const timer = setTimeout(() => {
      setShowBonus(true); // Set the state to show the bonus after 1 second
    }, 0); // 1 second delay

    // Cleanup the timer when the component unmounts or when it's not needed
    return () => clearTimeout(timer);
  }, [close]); // Empty dependency array to run only once when the component mounts

  const handleClose = () => {
    setClose(true);
  };

  const handleNo = () => {
    setClose(false);
  };

  const handleYes = () => {
    dispatch(setPlay(true));
    setClose(false);
    setBox(true);
    setEvent(false);
  };

  const openDrawer = () => {
    setIsOpen(true);
  };

  return (
    <>
      {!isOpen && (
        <>
          {!close ? (
            <div className="flex flex-col gap-[10px] justify-center items-center">
              <div className="flex flex-col justify-between items-center event_bo">
                <div className="absolute z-[-2] top-[150px]">
                  <Animation animate={light} />
                </div>

                {/* <img className=" absolute z-[-1]" src={bg} alt="" /> */}
                <div className=" absolute z-[-1] mt-[-220px]">
                  <AnimationCard animate={card} />

                  {/* <img src={bg} alt="" /> */}
                </div>
                {newData?.register_bonus && (
                  <div className="absolute z-[-1] ">
                    <AnimationCard animate={suprise} />
                  </div>
                )}

                <div className=" w-[400px] h-full pt-[0px] flex flex-col justify-between items-center media-w">
                  {/* <img className=" w-[210px] h-[70pxx]" src={logo} alt="" /> */}
                  <div className=" flex flex-col justify-center items-center mt-10">
                    <AsyncDecryptedImage
                      imageUrl={eventData.data.avatar}
                      className="w-[58px] h-[58px] rounded-full object-cover object-center"
                      alt="Profile"
                    />
                    <h1 className="duser_invite_text mt-2 font-sfPro w-[250px] media-w2">
                      "
                      <span className="devent_name">{eventData.data.name}</span>
                      " 邀请您一起使用笔盒，邀请好友瓜分百万现金红包！
                    </h1>
                  </div>
                  <div
                    className={`flex flex-col absolute mt-[180px] justify-center items-center gap-3
                      ${
                        newData?.register_bonus && showBonus ? "show-bonus" : ""
                      } 
                      `}
                  >
                    <h1 className="event-money1 font-sfProB text-[#6a4535]">
                      +{newData?.register_bonus} ¥
                    </h1>

                    <p className="event-money-p1 font-sfProB text-[#6a4535]">
                      注册后奖励 +2¥
                    </p>
                  </div>
                </div>
                <div className="absolute z-[-1] mt-[320px]">
                  <div className="">
                    <button onClick={openDrawer} className="devent_btn">
                      注册账号
                      {/* <Animation animate={btn1} /> */}
                    </button>
                  </div>
                </div>
                <div className="devent_close_btn " onClick={handleClose}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M8 6.2225L14.2225 0L16 1.7775L9.7775 8L16 14.2225L14.2225 16L8 9.7775L1.7775 16L0 14.2225L6.2225 8L0 1.7775L1.7775 0L8 6.2225Z"
                      fill="#FEE6B4"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            <div className="event-box">
              <p className="event-box-text px-8">
                您确定要放弃这些奖励吗？放弃后将无法重新领取。
              </p>
              <div className="event-btn-box flex">
                <button
                  className="w-[150px] p-3 event-btn-text text-white"
                  onClick={handleNo}
                >
                  取消
                </button>
                <div className="h-full w-[0.5px] bg-[#2a262f]"></div>
                <button
                  className="w-[150px] p-3 event-btn-text text-[#C23033]"
                  onClick={handleYes}
                >
                  确认
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default DEventResultBox;
