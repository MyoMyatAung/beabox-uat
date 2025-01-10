import React from "react";

interface HeaderProps {
  tabs: any;
  activeTab: any;
  setActiveTab: any;
}

const Header: React.FC<HeaderProps> = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className=" flex">
      {tabs?.map((tt: any, index: number) => (
        <div
          onClick={() => setActiveTab(tt)}
          key={index}
          className=" px-[16px] py-[8px] flex flex-col justify-center items-center"
        >
          <span className={`${activeTab === tt ? " text-white" : " text-white/60"} text-[16px] font-[500]`}>
            {tt}
          </span>
          
          <span className={`h-[4px] w-[24px] bg-white ${activeTab !== tt ? " opacity-0" : "opacity-100"}`}></span>
        </div>
      ))}
    </div>
  );
};

export default Header;
