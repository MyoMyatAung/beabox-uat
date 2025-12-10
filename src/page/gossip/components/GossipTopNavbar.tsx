import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";

interface Tab {
  id: string;
  label: string;
}

interface GossipTopNavbarProps {
  tabs: Tab[];
  activeTab: string;
  onTabClick: (tabId: string) => void;
}

const GossipTopNavbar = ({
  tabs,
  activeTab,
  onTabClick,
}: GossipTopNavbarProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const { hideBar } = useSelector((state: any) => state.hideBarSlice);
  const { hideNew } = useSelector((state: any) => state.hideNewSlice);
  const shouldCenterTabs = tabs.length <= 4;

  useEffect(() => {
    const activeTabElement = tabRefs.current[activeTab];
    const scrollContainer = scrollContainerRef.current;

    if (activeTabElement && scrollContainer) {
      activeTabElement.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeTab]);

  return (
    <AnimatePresence>
      {!hideBar && !hideNew && (
        <motion.div
          className="px-4 py-3 z-[9999] max-w-[480px] mx-auto"
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: "0", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
          }}
        >
          <div className="relative">
            <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-[#16131C] to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-[#16131C] to-transparent" />
            <div
              ref={scrollContainerRef}
              className={`flex items-center ${
                shouldCenterTabs ? "justify-center" : "justify-start"
              } text-white min-h-14 overflow-x-auto scrollbar-hide px-6`}
            >
              <div className="flex items-center gap-5 w-max">
                {tabs.map((tab) => (
                  <div
                    ref={(element) => {
                      tabRefs.current[tab.id] = element;
                    }}
                    onClick={() => onTabClick(tab.id)}
                    key={tab.id}
                    className="flex flex-col items-center cursor-pointer min-w-20 px-3"
                    data-tab-id={tab.id}
                  >
                    <div className="w-[24px] h-[3px] bg-transparent rounded-full transition-all duration-300" />
                    <p
                      className={`whitespace-nowrap transition-all duration-300 ease-in-out ${
                        activeTab === tab.id
                          ? "text-2xl opacity-100 font-semibold home-normal-text-shadow"
                          : "home-normal-text"
                      }`}
                    >
                      {tab.label}
                    </p>
                    {activeTab === tab.id ? (
                      <div className="w-[24px] h-[3px] bg-white rounded-full" />
                    ) : (
                      <div className="w-[24px] h-[3px] bg-transparent rounded-full" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GossipTopNavbar;
