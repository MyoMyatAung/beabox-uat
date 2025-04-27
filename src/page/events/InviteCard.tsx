import UserSvg from "@/assets/icons/User.svg";
import Group from "@/assets/icons/Group.svg";
import Vector from "@/assets/icons/Vector.svg";
import SendSvg from "@/assets/icons/send.svg";
import Participate from "@/assets/participate.png"
import React from "react";
const InviteCard:React.FC = () => {
  return (
    <div className="rounded-lg w-full max-w-md">
      <img src={Participate} className="mx-auto"/>
      <div className="flex justify-around items-center text-center text-white my-5">
        <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(255, 255, 255, 0.2)" }}>
          <img src={UserSvg} alt="" className="w-6 h-6 text-white" />
        </div>
        <div className="mx-2">
          <img src={SendSvg} alt="Send" className="w-5 h-5" />
        </div>
        <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(255, 255, 255, 0.2)" }}>
          <img src={Group} className="w-6 h-6" />
        </div>
        <div className="mx-2">
          <img src={SendSvg} alt="Send" className="w-4 h-4" />
        </div>
        <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(255, 255, 255, 0.2)" }}>
          <img src={Vector} className="w-6 h-6" />
        </div>
      </div>

      <div className="flex justify-around items-center leading-[18px] font-[Helvetica Neue]">
        <p>分享邀请链接</p>
        <div className="w-6" />
        <p>好友打开注册</p>
        <div className="w-6" />
        <p>完成注册领取奖励</p>
      </div>
    </div>
  );
};

export default InviteCard;
