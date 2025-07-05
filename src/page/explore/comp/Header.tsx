import { sethideBar } from "@/page/home/services/hideBarSlice";
import { useGetExploreHeaderQuery } from "@/store/api/explore/exploreApi";
import { setExpHeader } from "@/store/slices/exploreSlice";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { exp_header } = useSelector((state: any) => state.explore);
  const dispatch = useDispatch();

  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { data, isLoading } = useGetExploreHeaderQuery("");
  const [hd, sethd] = useState<any[]>([]);

  // Set tabs
  useEffect(() => {
    if (data?.data?.tabs) {
      sethd(data.data.tabs);
    }
  }, [data]);

  // Set default tab after tabs are ready
  useEffect(() => {
    if (hd.length > 0) {
      dispatch(setExpHeader(hd[0]?.name));
    }
  }, [hd]);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY <= 500) {
        setShowHeader(true);
        // dispatch(sethideBar(false));
      } else {
        if (currentY > lastScrollY) {
          // scrolling down
          setShowHeader(false);
          // dispatch(sethideBar(true));
        } else if (currentY < lastScrollY) {
          // scrolling up
          setShowHeader(true);
          // dispatch(sethideBar(false));
        }
      }

      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleTabsClick = (tab: any, index: number) => {
    if (exp_header === tab.name) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    dispatch(setExpHeader(tab.name));

    if (tabRefs.current[index] && scrollContainerRef.current) {
      const tabElement = tabRefs.current[index];
      const container = scrollContainerRef.current;

      const containerWidth = container.offsetWidth;
      const tabLeft = tabElement.offsetLeft;
      const tabWidth = tabElement.offsetWidth;
      const scrollTo = tabLeft - containerWidth / 2 + tabWidth / 2;

      container.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div
      className={`
        bg-[#16131C] sticky top-[60px] z-[99] w-full py-[15px] px-[10px]
        transition-transform duration-300 ease-in-out will-change-transform
        ${
          showHeader
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }
      `}
    >
      {isLoading ? (
        <div className="w-2/3 px-2 bg-white/20 rounded-md h-[50px] animate-pulse"></div>
      ) : (
        <div
          ref={scrollContainerRef}
          className="flex px-2 gap-[16px] pr-[25px] scrollbar overflow-x-auto whitespace-nowrap"
        >
          {hd.map((tab: any, index) => (
            <div
              key={index}
              ref={(el) => (tabRefs.current[index] = el)}
              className="flex flex-col justify-center items-center py-[10px] gap-[3px] pr-[16px] relative"
            >
              <h1
                className={`cursor-pointer transition duration-300 text-[18px] ${
                  exp_header !== tab.name
                    ? "text-white/60 font-[500] leading-[20px]"
                    : "font-[700] leading-[20px] text-white"
                }`}
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
