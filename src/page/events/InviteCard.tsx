import UserSvg from "@/assets/User.png";
import Group from "@/assets/Group.png";
import Vector from "@/assets/Vector.png";
import SendSvg from "@/assets/send.png";
import Participate from "@/assets/participate.png"
import React from "react";
const InviteCard:React.FC = () => {
  return (
    <div className="rounded-lg w-full max-w-md">
      <img src={Participate} className="mx-auto max-w-[89px]"/>
      <div className="flex justify-around items-center text-center text-white my-3 mt-5">
        <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(255, 255, 255, 0.2)" }}>
          <img src={UserSvg} alt="" className="w-7 h-7 text-white" />
        </div>
        <div className="mx-2">
          <img src={SendSvg} alt="Send" className="w-5 h-5"  />
        </div>
        <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(255, 255, 255, 0.2)" }}>
          <img src={Group} className="w-7 h-7" />
        </div>
        <div className="mx-2">
          <img src={SendSvg} alt="Send" className="w-4 h-4" />
        </div>
        <div className="w-14 h-14 rounded-full flex items-center justify-center"  style={{ background: "rgba(255, 255, 255, 0.2)" }} >
          <img src={Vector} className="w-7 h-7" />
        </div>
      </div>

      <div className="flex justify-center items-center text-center text-[14px] leading-[18px] font-[700] font-[Helvetica Neue]">
        <p>分享邀请链接给你的朋友</p>
        <div className="w-6" />
        <p>让朋友打开链接即可领取奖励</p>
        <div className="w-6" />
        <p>完成注册领取更多</p>
      </div>
    </div>
  );
};

export default InviteCard;
