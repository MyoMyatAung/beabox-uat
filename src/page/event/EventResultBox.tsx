import React, { useEffect, useState } from "react";
import "./event.css";
import logo from "./img/logoBox.png";
import light from "./img/light.json";
import card from "./img/red2.json";
import suprise from "./img/suprise.json";
//import bg from "./img/bg.png";

import btn1 from "./img/btn1.json";
import AsyncDecryptedImage from "@/utils/asyncDecryptedImage";
import Animation from "./Animation";
import AuthDrawer from "@/components/profile/auth/auth-drawer";
import { setIsDrawerOpen } from "@/store/slices/profileSlice";
import { useDispatch } from "react-redux";
import LoginDrawer from "@/components/profile/auth/login-drawer";
import RegisterDrawer from "@/components/profile/auth/register-drawer";
import { setPlay } from "../home/services/playSlice";
import AnimationCard from "./AnimationCard";
// import AnimationCard from "./AnimationCard";

interface EventBoxProps {
  eventData: any;
  newData: any;
  setIsOpen: any;
  isOpen: any;
  setBox: any;
  setEvent: any;
}

const EventResultBox: React.FC<EventBoxProps> = ({
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
                <div className=" absolute z-[-1]">
                  <AnimationCard animate={card} />

                  {/* <img src={bg} alt="" /> */}
                </div>
                {newData?.register_bonus && (
                  <div className="absolute z-[-1]">
                    <AnimationCard animate={suprise} />
                  </div>
                )}

                <div className=" w-[400px] h-full pt-[150px] pb-[30px] flex flex-col justify-between items-center media-w">
                  <div
                    className={`flex flex-col justify-center items-center gap-3
                      ${
                        newData?.register_bonus && showBonus ? "show-bonus" : ""
                      } 
                      `}
                  >
                    <h1 className="event-money1 font-sfProB text-[#f2cb81]">
                      +{newData?.register_bonus} ¥
                    </h1>
                    <div className=" h-[1px] event-line w-[100px]"></div>
                    <p className="event-money-p1 font-sfPro text-[#f2cb81]">
                      注册后奖励 +2¥
                    </p>
                  </div>

                  {/* <img className=" w-[210px] h-[70pxx]" src={logo} alt="" /> */}
                  <div className=" flex flex-col justify-center items-center mt-16">
                    <AsyncDecryptedImage
                      imageUrl={eventData.data.avatar}
                      className="w-[58px] h-[58px] rounded-full object-cover object-center"
                      alt="Profile"
                    />
                    <h1 className="user_invite_text mt-2 font-sfPro w-[250px] media-w2">
                      "<span className="event_name">{eventData.data.name}</span>
                      " 邀请您一起使用笔盒，邀请好友瓜分百万现金红包！
                    </h1>
                  </div>
                  <div className="mt-14">
                    <button onClick={openDrawer} className="event_btn">
                      注册账号
                      {/* <Animation animate={btn1} /> */}
                    </button>
                  </div>
                </div>
              </div>
              <div
                onClick={handleClose}
                className="event_box_close p-[9px] mt-5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="23"
                  viewBox="0 0 24 23"
                  fill="none"
                >
                  <path
                    d="M17.75 5.75L6.25 17.25"
                    stroke="white"
                    strokeWidth="1.49593"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.25 5.75L17.75 17.25"
                    stroke="white"
                    strokeWidth="1.49593"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
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

export default EventResultBox;
