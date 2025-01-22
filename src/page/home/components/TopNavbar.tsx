import { Link } from "react-router-dom";

const TopNavbar = ({
  currentTab,
  onTabClick,
}: {
  currentTab: number;
  onTabClick: (tab: number) => void;
}) => {
  const TABS = [
    { text: "关注", id: 0 },
    { text: "探索", id: 1 },
    { text: "推荐", id: 2 },
  ];

  return (
    <div className="absolute top-5 left-0 px-5 right-0 flex justify-between items-center z-[9999]">
      <div></div>
      <div className="flex gap-2 items-center text-white">
        {TABS.map((tab, index) => (
          <button
            key={index}
            className={`px-2 py-1   flex flex-col items-center justify-center ${
              currentTab === tab.id
                ? "opacity-100 font-semibold"
                : "opacity-50 font-normal"
            } nav_text`}
            onClick={() => onTabClick(tab.id)}
          >
            <div className="mb-1 capitalize">
              {tab.text === "for_you" ? "For You" : tab.text}
            </div>
            {currentTab === tab.id && (
              <div className="w-[30px] h-[2px] bg-white"></div>
            )}
          </button>
        ))}
      </div>

      <div>
        <Link to={"/search_overlay"}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
          >
            <path
              d="M18.6374 13.2918C18.8894 12.5016 19.0254 11.6597 19.0254 10.786C19.0254 6.23546 15.3364 2.54651 10.7859 2.54651C6.23535 2.54651 2.54639 6.23546 2.54639 10.786C2.54639 15.3365 6.23535 19.0256 10.7859 19.0256C12.9519 19.0256 14.9227 18.1897 16.3934 16.823"
              stroke="white"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M16.5166 16.9447L19.7469 20.1667"
              stroke="white"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default TopNavbar;
