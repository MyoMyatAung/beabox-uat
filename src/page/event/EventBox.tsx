import React from "react";
import "./event.css";
import logo from "./img/logoBox.png";
import light from "./img/light.json";
import card from "./img/card.json";
import bg from "./img/bg.png";
import AsyncDecryptedImage from "@/utils/asyncDecryptedImage";
import Animation from "./Animation";

interface EventBoxProps {
  eventData: any;
}

const EventBox: React.FC<EventBoxProps> = ({ eventData }) => {
  console.log(eventData);
  return (
    <div className="h-screen bg-black/80 w-screen flex flex-col gap-[20px] justify-center items-center fixed top-0 z-[9999]">
      <div className=" absolute z-[-2] top-[150px]">
        <Animation  animate={light} />
      </div>
      <div className=" w-[300px] h-[450px] flex flex-col justify-between items-center event_bo">
        {/* <img className=" absolute z-[-1]" src={bg} alt="" /> */}
        <div className=" absolute z-[-1]">
        <Animation  animate={card} />
        </div>
        <div className=" w-full h-full pt-[70px] pb-[30px] flex flex-col justify-between items-center">
          <img className=" w-[210px] h-[70pxx]" src={logo} alt="" />
          <div className=" flex flex-col justify-center items-center px-[30px]">
            <AsyncDecryptedImage
              imageUrl={eventData.data.avatar}
              className="w-[58px] h-[58px] rounded-full object-cover object-center"
              alt="Profile"
            />
            <h1 className="user_invite_text">
              '{eventData.data.name}'{" "}
              邀请您一起使用笔盒，邀请好友瓜分百万现金红包！
            </h1>
          </div>
          <div className="">
            <button className=" event_btn">打开红包</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventBox;
