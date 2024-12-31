const TopNavbar = ({
  currentTab,
  onTabClick,
}: {
  currentTab: string;
  onTabClick: (tab: string) => void;
}) => {
  const TABS = ["follow", "explore", "for_you"];

  return (
    <div className="absolute top-5 left-0 right-0 flex justify-center items-center z-[9999]">
      <div className="flex gap-2 items-center text-white">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`px-2 py-1 nav_text flex flex-col items-center justify-center ${
              currentTab === tab ? "opacity-100" : "opacity-50"
            }`}
            onClick={() => onTabClick(tab)}
          >
            <div className="mb-1 capitalize">
              {tab === "for_you" ? "For You" : tab}
            </div>
            {currentTab === tab && (
              <div className="w-[30px] h-[2px] bg-white"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopNavbar;
