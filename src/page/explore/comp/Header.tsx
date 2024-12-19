import React, { useState } from "react";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = ({}) => {
  const tabs = [
    "Recommend",
    "Latest",
    "Hollywood",
    "K-Drama",
    "Drama",
    "Bollywood",
  ];

  const [activeTab, setActiveTab] = useState<string>(tabs[0]); // Initialize with the first tab

  const handleTabClick = (tab: string) => {
    setActiveTab(tab); // Set the active tab
    const element = document.getElementById(tab.toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className=" bg-black z-[99] py-[10px] fixed">
      <div className="flex gap-[16px] pr-[20px] scrollbar w-screen overflow-x-auto whitespace-nowrap">
        {tabs.map((tab) => (
          <div className=" flex flex-col justify-center items-center py-[10px] gap-[3px]">
            <h1
              key={tab}
              className={`cursor-pointer transition duration-300 ${
                activeTab !== tab
                  ? "text-white/60 font-[500] text-[15px] leading-[20px]"
                  : "text-[16px] font-[700] leading-[20px] text-white"
              }`}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </h1>

            <span className={`${ activeTab !== tab ? " opacity-0" : " opacity-100"} w-[6px] h-[6px] bg-white rounded-full`}></span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Header;
