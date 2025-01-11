const TopNavbar = ({
  currentTab,
  onTabClick,
}: {
  currentTab: number;
  onTabClick: (tab: number) => void;
}) => {
  const TABS = [
    { text: "follow", id: 0 },
    { text: "explore", id: 1 },
    { text: "for_you", id: 2 },
  ];

  return (
    <div className="absolute top-5 left-0 right-0 flex justify-center items-center z-[9999]">
      <div className="flex gap-2 items-center text-white">
        {TABS.map((tab, index) => (
          <button
            key={index}
            className={`px-2 py-1 nav_text flex flex-col items-center justify-center ${
              currentTab === tab.id ? "opacity-100" : "opacity-50"
            }`}
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
    </div>
  );
};

export default TopNavbar;

// import React, { useRef } from "react";

// const TopNavbar = ({
//   currentTab,
//   onTabClick,
// }: {
//   currentTab: string;
//   onTabClick: (tab: string) => void;
// }) => {
//   const TABS = ["follow", "explore", "for_you"];
//   const swiperRef = useRef<any>(null);

//   const handleTabClick = (tab: string) => {
//     const index = TABS.indexOf(tab);
//     if (index >= 0 && swiperRef.current) {
//       swiperRef.current.slideTo(index);
//     }
//     onTabClick(tab);
//   };

//   return (
//     <div className="relative">
//       {/* Swiper for Tab Navigation */}
//       <div className="absolute top-5 left-0 right-0 flex justify-center items-center z-[9999]">
//         <div className="flex gap-2 items-center text-white">
//           {TABS.map((tab) => (
//             <button
//               key={tab}
//               className={`px-2 py-1 nav_text flex flex-col items-center justify-center ${
//                 currentTab === tab ? "opacity-100" : "opacity-50"
//               }`}
//               onClick={() => handleTabClick(tab)}
//             >
//               <div className="mb-1 capitalize">
//                 {tab === "for_you" ? "For You" : tab}
//               </div>
//               {currentTab === tab && (
//                 <div className="w-[30px] h-[2px] bg-white"></div>
//               )}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TopNavbar;
