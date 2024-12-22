import React from "react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    "Recommend",
    "Latest",
    "Hollywood",
    "K-Drama",
    "Drama",
    "Bollywood",
  ];

  return (
    <div className="bg-black z-[99] py-[10px] fixed top-0 w-screen">
      <div className="flex gap-[16px] pr-[25px] scrollbar w-screen overflow-x-auto whitespace-nowrap">
        {tabs.map((tab) => (
          <div
            key={tab}
            className="flex flex-col justify-center items-center py-[10px] gap-[3px]"
          >
            <h1
              className={`cursor-pointer transition duration-300 ${
                activeTab !== tab
                  ? "text-white/60 font-[500] text-[15px] leading-[20px]"
                  : "text-[16px] font-[700] leading-[20px] text-white"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </h1>
            <span
              className={`${
                activeTab !== tab ? "opacity-0" : "opacity-100"
              } w-[6px] h-[6px] bg-white rounded-full`}
            ></span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Header;
