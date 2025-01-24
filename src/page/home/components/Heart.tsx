import React, { useEffect } from "react";

const HeartCount = ({
  id,
  remove,
}: {
  id: number;
  remove: (id: number) => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      remove(id); // Remove the heart after 1 second
    }, 1000);

    return () => clearTimeout(timer); // Cleanup timeout
  }, [id, remove]);

  return (
    <div
      className="absolute bottom-[140px] left-[30px] z-[999999] animate-fade-out"
      style={{
        animation: "fade-up 1s ease-in-out forwards",
      }}
    >
      <div className="flex items-center gap-2">
        <div className="flex items-end bg-[#bd4de6] py-2 px-5 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="27"
            height="25"
            viewBox="0 0 27 25"
            fill="none"
          >
            <path
              d="M19.6249 2.1001C17.3018 2.1001 15.2678 3.0991 13.9999 4.78772C12.732 3.0991 10.698 2.1001 8.3749 2.1001C6.52566 2.10218 4.75275 2.83772 3.44513 4.14533C2.13752 5.45294 1.40199 7.22585 1.3999 9.0751C1.3999 16.9501 13.0763 23.3243 13.5735 23.5876C13.7046 23.6581 13.8511 23.695 13.9999 23.695C14.1487 23.695 14.2952 23.6581 14.4263 23.5876C14.9235 23.3243 26.5999 16.9501 26.5999 9.0751C26.5978 7.22585 25.8623 5.45294 24.5547 4.14533C23.2471 2.83772 21.4741 2.10218 19.6249 2.1001Z"
              fill="#F70F2D"
            />
          </svg>
          <span className="count_x">x 1</span>
        </div>
      </div>
    </div>
  );
};

export default HeartCount;
