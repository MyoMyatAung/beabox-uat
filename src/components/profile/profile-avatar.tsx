import { Person } from "@/assets/profile";
import AsyncDecryptedImage from "@/utils/asyncDecryptedImage";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

interface ProfileAvatarProps {
  progressData?: number;
  levelImage?: string;
  photo?: string;
  myday?: any;
  id?: any;
}

const ProfileAvatar = ({
  id,
  myday,
  levelImage,
  progressData,
  photo,
}: ProfileAvatarProps) => {
  const progress = progressData ?? 0;
  const circleRadius = 41.4; // Half of 82.8px
  const strokeWidth = 3.95; // Border width from design
  const normalizedRadius = circleRadius - strokeWidth / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const navigate = useNavigate();
  const location = useLocation();

  const seenUserIds = useSelector((state: any) => state.seenUsers.seenUserIds);
  const onlyseenUserIds = useSelector(
    (state: any) => state.onlyseenUser.onlyseenUserIds
  );

  const handleRedirect = () => {
    if (myday?.uploaded && id) {
      navigate(`/story_detail/${id}`, { state: { from: location.pathname } });
    }
  };

  return (
    <button
      onClick={handleRedirect}
      className={`w-[82.8px] h-[82.8px] z-[1900] rounded-full  flex justify-center items-center relative`}
    >
      {/* <svg
        height={circleRadius * 2}
        width={circleRadius * 2}
        className="absolute transform rotate-[90deg] scale-x-[-1]"
      >
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "#E8B9FF", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#FF94B4", stopOpacity: 1 }}
            />
          </linearGradient>
          <linearGradient id="paint0_linear_4877_9460" x1="2" y1="83.8476" x2="70.2615" y2="83.4222" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E8B9FF"/>
            <stop offset="1" stopColor="#FF94B4"/>
          </linearGradient>
        </defs>

        <circle
          stroke="url(#paint0_linear_4877_9460)"
          opacity={'22%'}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={circleRadius}
          cy={circleRadius}
        />
       
        <circle
          stroke="url(#gradient)"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          r={normalizedRadius}
          cx={circleRadius}
          cy={circleRadius}
        />
      </svg> */}
      {myday?.uploaded && (
        <>
          {myday?.watched ||
          !seenUserIds.includes(id) ||
          !onlyseenUserIds.includes(id) ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="87"
              height="87"
              viewBox="0 0 64 64"
              className="absolute transform rotate-[90deg] scale-x-[-1]"
              fill="none"
            >
              <path
                d="M64 32C64 49.6731 49.6731 64 32 64C14.3269 64 0 49.6731 0 32C0 14.3269 14.3269 0 32 0C49.6731 0 64 14.3269 64 32ZM3.0407 32C3.0407 47.9938 16.0062 60.9593 32 60.9593C47.9938 60.9593 60.9593 47.9938 60.9593 32C60.9593 16.0062 47.9938 3.0407 32 3.0407C16.0062 3.0407 3.0407 16.0062 3.0407 32Z"
                fill="white"
                fill-opacity="0.4"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="87"
              height="87"
              className="absolute transform rotate-[90deg] scale-x-[-1]"
              viewBox="0 0 87 87"
              fill="none"
            >
              <path
                d="M84.7993 43.3997C84.7993 66.2641 66.2641 84.7993 43.3997 84.7993C20.5353 84.7993 2 66.2641 2 43.3997C2 20.5353 20.5353 2 43.3997 2C66.2641 2 84.7993 20.5353 84.7993 43.3997ZM2.55072 43.3997C2.55072 65.9599 20.8394 84.2486 43.3997 84.2486C65.9599 84.2486 84.2486 65.9599 84.2486 43.3997C84.2486 20.8394 65.9599 2.55072 43.3997 2.55072C20.8394 2.55072 2.55072 20.8394 2.55072 43.3997Z"
                stroke="url(#paint0_linear_754_6260)"
                stroke-width="3.94963"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_754_6260"
                  x1="2"
                  y1="84.7993"
                  x2="71.0553"
                  y2="84.369"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#E8B9FF" />
                  <stop offset="1" stop-color="#FF94B4" />
                </linearGradient>
              </defs>
            </svg>
          )}
        </>
      )}

      {photo ? (
        <AsyncDecryptedImage
          imageUrl={photo}
          className="w-[76px] h-[76px] rounded-full object-cover object-center p-[2px]"
          alt="Profile"
        />
      ) : (
        <div className="w-[70px] h-[70px] rounded-full bg-[#FFFFFF12] flex justify-center items-center p-[2px]">
          <Person />
        </div>
      )}

      {levelImage && (
        <AsyncDecryptedImage
          imageUrl={levelImage}
          className="absolute -bottom-4 right-1"
          alt="Level"
        />
      )}
    </button>
  );
};

export default ProfileAvatar;
