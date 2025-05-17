import UserSvg from "@/assets/User.png";
import Group from "@/assets/Group.png";
import Vector from "@/assets/Vector.png";
import SendSvg from "@/assets/send.png";
import Participate from "@/assets/participate.png";
import React from "react";

const InviteCard: React.FC = () => {
  return (
    <div className="rounded-lg w-full max-w-md">
      <img src={Participate} className="mx-auto max-w-[89px] py-4" />
      <div className="flex justify-around items-start text-center text-white my-3 mt-5">
        <div className="flex flex-col justify-center items-center flex-1">
          <div className="flex items-center w-full justify-between">
            <div className=""></div>
            <SendIcon icon={UserSvg} />
            <SendArrow />
          </div>
          <Text text={"分享邀请链接给你的朋友"} />
        </div>
        <div className="flex flex-col justify-center items-center flex-1">
          <div className="flex items-center w-full justify-between">
            <div className=""></div>
            <SendIcon icon={Group} />
            <SendArrow />
          </div>
          <Text text={"让朋友打开链接即可领取奖励"} />
        </div>
        <div className="flex flex-col justify-center items-center flex-1">
          <div className="flex items-center w-full justify-between">
            <div className=""></div>
            <SendIcon icon={Vector} />
            <div className=""></div>
          </div>
          <Text2 text={"完成注册领取更多"} />
        </div>
        {/* <SendIcon icon={UserSvg} />
        <div className="mx-2">
          <SendArrow />
        </div>
        <SendIcon icon={Group} />

        <div className="mx-2">
          <SendArrow />
        </div>
        <SendIcon icon={Vector} /> */}
      </div>
    </div>
  );
};

export default InviteCard;

const SendArrow = () => {
  return <img src={SendSvg} alt="Send" className="w-3 h-3" />;
};

const SendIcon = ({ icon }: any) => {
  return (
    <div
      className="w-14 h-14 rounded-full flex items-center justify-center"
      style={{ background: "rgba(255, 255, 255, 0.2)" }}
    >
      <img src={icon} alt="" className="w-7 h-7 text-white" />
    </div>
  );
};

const Text = ({ text }: any) => {
  return (
    <div className="w-full">
      <p className="text-[12px] leading-[18px] font-[500] font-[Helvetica Neue] px-3  pt-3">
        {text}
      </p>
    </div>
  );
};

const Text2 = ({ text }: any) => {
  return (
    <div className="w-full">
      <p className="text-[12px] leading-[18px] font-[500] font-[Helvetica Neue]  px-5  pt-3">
        {text}
      </p>
    </div>
  );
};
