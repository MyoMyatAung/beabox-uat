import React from "react";
import invite from "../../../assets/wallet/invite.svg";
import noti from "../../../assets/wallet/noti.svg";
import we from "../../../assets/wallet/we.svg";
import rec from "../../../assets/wallet/rec.svg";
import '../wallet.css'
import { Link } from "react-router-dom";
interface TabsProps {}

const Tabs: React.FC<TabsProps> = ({}) => {
  const tabs = [
    {
      id: 1,
      title: "invite",
      pic: invite,
      to: "/wallet/invite",
    },
    {
      id: 2,
      title: "Notifications",
      pic: noti,
      to: "#",
    },
    {
      id: 3,
      title: "Withdraw",
      pic: we,
      to: "#",
    },
    {
      id: 4,
      title: "Recharge",
      pic: rec,
      to: "#",
    },
  ];
  return (
    <div className=" px-[30px]">
      <div className=" flex justify-between items-center gap-[8px]">
        {tabs.map((tb) => (
          <Link to={tb.to} className=" flex flex-col gap-[12px] justify-center items-center">
            <div className="tabs_icon w-[48px] h-[48px] flex justify-center items-center">
              <img className="" src={tb.pic} alt="" />
            </div>
            <h1 className=" text-white text-[13px] font-[400] leading-[15px]">{tb.title}</h1>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
