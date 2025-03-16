import { useGetExploreHeaderQuery } from "@/store/api/explore/exploreApi";
import { setExpHeader } from "@/store/slices/exploreSlice";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const test = [
  { id: "1", name: "aa" },
  { id: "2", name: "bb" },
  { id: "3", name: "dd" },
  { id: "4", name: "ww" },
  { id: "5", name: "cc" },
  { id: "6", name: "zz" },
  { id: "7", name: "bb" },
  { id: "8", name: "mm" },
  { id: "9", name: "rr" },
  { id: "10", name: "tt" },
  { id: "11", name: "uu" },
  { id: "12", name: "oo" },
];

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { exp_header } = useSelector((state: any) => state.explore);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  const dispatch = useDispatch();
  const [hd, sethd] = useState<any[]>([]);
  const { data, isLoading } = useGetExploreHeaderQuery("");
  useEffect(() => {
    if (data?.data) {
      const cur = data?.data?.tabs;
      sethd(cur);
      if (hd.length > 0) {
        dispatch(setExpHeader(hd[0]?.name));
      }
    }
  }, [data, hd]);
  // console.log(hd);

  const handleTabsClick = (tab: any, index: number) => {
    if (exp_header === tab.name) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    dispatch(setExpHeader(tab?.name));

    if (tabRefs.current[index] && scrollContainerRef.current) {
      const tabElement = tabRefs.current[index];
      const container = scrollContainerRef.current;

      // Calculate the center position
      const containerWidth = container.offsetWidth;
      const tabLeft = tabElement.offsetLeft;
      const tabWidth = tabElement.offsetWidth;
      const scrollTo = tabLeft - containerWidth / 2 + tabWidth / 2;

      container.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[#16131C] z-[99] py-[5px] sticky top-0 w-screen px-[10px] overscroll-auto">
      {isLoading ? (
        <div className=" w-2/3 px-2 bg-white/20 rounded-md h-[50px] animate-pulse"></div>
      ) : (
        <div
          ref={scrollContainerRef}
          className="flex px-2 gap-[16px] pr-[25px] scrollbar w-screen overflow-x-auto whitespace-nowrap"
        >
          {hd?.map((tab: any, index) => (
            <div
              key={index}
              ref={(el) => (tabRefs.current[index] = el)}
              className="flex flex-col justify-center items-center py-[10px] gap-[3px] pr-[16px] relative"
            >
              <h1
                className={`cursor-pointer transition duration-300 text-[18px] ${
                  exp_header !== tab.name
                    ? "text-white/60 font-[500] leading-[20px]"
                    : " font-[700] leading-[20px] text-white"
                }`}
                // onClick={() => setActiveTab(tab?.title)}
                // onClick={() => dispatch(setExpHeader(tab?.name))}
                onClick={() => handleTabsClick(tab, index)}
              >
                {tab.name}
              </h1>
              <span
                className={`${
                  exp_header !== tab.name ? "opacity-0" : "opacity-100"
                } w-[52px] absolute bottom-0 h-[4px] bg-[#CD3EFF] rounded-full`}
              ></span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Header;
