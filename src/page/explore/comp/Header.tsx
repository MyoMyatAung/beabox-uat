import { useGetExploreHeaderQuery } from "@/store/api/explore/exploreApi";
import React, { useEffect, useState } from "react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [hd, sethd] = useState([]);
  const { data, isLoading } = useGetExploreHeaderQuery("");
  useEffect(() => {
    if (data?.data) {
      const cur = data?.data?.tabs;
      sethd(cur);
    }
  }, [data, hd]);
  // console.log(hd)

  return (
    <div className="bg-black z-[99] py-[10px] fixed top-0 w-screen">
      {isLoading ? (
        <div className=" w-[330px] bg-white/20 h-[50px] animate-pulse"></div>
      ) : (

        <div className="flex gap-[16px] pr-[25px] scrollbar w-screen overflow-x-auto whitespace-nowrap">
          {hd.map((tab : any) => (
            <div
              key={tab}
              className="flex flex-col justify-center items-center py-[10px] gap-[3px]"
            >
              <h1
                className={`cursor-pointer transition duration-300 ${
                  activeTab !== tab.title
                    ? "text-white/60 font-[500] text-[15px] leading-[20px]"
                    : "text-[16px] font-[700] leading-[20px] text-white"
                }`}
                onClick={() => setActiveTab(tab?.title)}
              >
                {tab.title}
              </h1>
              <span
                className={`${
                  activeTab !== tab.title ? "opacity-0" : "opacity-100"
                } w-[6px] h-[6px] bg-white rounded-full`}
              ></span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Header;
