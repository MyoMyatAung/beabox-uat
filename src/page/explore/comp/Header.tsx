import { useGetExploreHeaderQuery } from "@/store/api/explore/exploreApi";
import { setExpHeader } from "@/store/slices/exploreSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { exp_header } = useSelector((state: any) => state.explore);

  const dispatch = useDispatch();
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
    <div className="bg-black z-[99] py-[5px] sticky top-0 w-screen">
      {isLoading ? (
        <div className=" w-[330px] bg-white/20 h-[50px] animate-pulse"></div>
      ) : (
        <div className="flex gap-[16px] pr-[25px] scrollbar w-screen overflow-x-auto whitespace-nowrap">
          {hd.map((tab: any, index) => (
            <div
              key={index}
              className="flex flex-col justify-center items-center py-[10px] gap-[3px]"
            >
              <h1
                className={`cursor-pointer transition duration-300 ${
                  exp_header !== tab.name
                    ? "text-white/60 font-[500] text-[15px] leading-[20px]"
                    : "text-[16px] font-[700] leading-[20px] text-white"
                }`}
                // onClick={() => setActiveTab(tab?.title)}
                onClick={() => dispatch(setExpHeader(tab?.name))}
              >
                {tab.name}
              </h1>
              <span
                className={`${
                  exp_header !== tab.name ? "opacity-0" : "opacity-100"
                } w-[24px] h-[4px] bg-white rounded-full`}
              ></span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Header;
