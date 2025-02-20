import React from "react";

interface HeaderProps {
  tabs: any;
  activeTab: any;
  setActiveTab: any;
  setCurrentPage: any;
}

const Header: React.FC<HeaderProps> = ({
  tabs,
  activeTab,
  setActiveTab,
  setCurrentPage,
}) => {
  return (
    <div className=" flex mb-[5px] px-[10px]">
      {tabs?.map((tt: any, index: number) => (
        <div
          onClick={() => {
            setCurrentPage(1);
            setActiveTab(tt);
          }}
          key={index}
          className=" px-[10px] py-[8px] flex flex-col justify-center items-center"
        >
          <span
            className={`${
              activeTab?.name === tt?.name ? " text-white" : " text-white/60"
            } text-[16px] mb-2 font-[500]`}
          >
            {tt?.name}
          </span>

          <span
            className={`h-[3px] w-[40px] rounded-md bg-[#CD3EFF] ${
              activeTab?.name !== tt?.name ? " opacity-0" : "opacity-100"
            }`}
          ></span>
        </div>
      ))}
    </div>
  );
};

export default Header;
