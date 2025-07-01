import { useNavigate } from "react-router-dom";
import { setShow } from "../../services/showSlice";
import { useDispatch } from "react-redux";

const LoadingBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <div className="z-[9999999] videoNavbar left-0">
      <div className="w-full flex gap-1 mb-4">
        <div
          className={`h-1 flex-1 rounded-full bg-gray-500 bg-opacity-40
          `}
          style={{
            transition: "width 0.3s ease",
          }}
        />
      </div>
      <div className="flex items-center justify-between">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
        >
          <circle cx="20" cy="20" r="20" fill="url(#paint0_linear_754_5773)" />
          <defs>
            <linearGradient
              id="paint0_linear_754_5773"
              x1="1.96429"
              y1="-1.17698e-07"
              x2="40.3571"
              y2="40"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#1D1D1B" />
              <stop offset="1" stop-color="#383838" />
            </linearGradient>
          </defs>
        </svg>
        <button
          className="detail_cross_btn"
          onClick={() => {
            if (location.pathname.includes("/story_detail")) {
              // If the current path is a detail page, navigate back to the home page
              navigate(-1);
            } else {
              dispatch(setShow(""));
              console.log("Cross button clicked");
              // If the current path is not a detail page, navigate back to the previous page
            }
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M17.75 6.25L6.25 17.75"
              stroke="white"
              stroke-width="1.49593"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M6.25 6.25L17.75 17.75"
              stroke="white"
              stroke-width="1.49593"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default LoadingBar;
