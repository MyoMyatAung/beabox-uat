import { Person } from "@/assets/profile";
import AsyncDecryptedImage from "@/utils/asyncDecryptedImage";

interface ProfileAvatarProps {
  progressData?: number;
  levelImage?: string;
  photo?: string;
}

const ProfileAvatar = ({
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

  return (
    <div className="w-[82.8px] h-[82.8px] z-[1900] rounded-full bg-[#FFFFFF12] flex justify-center items-center relative">
      <svg
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
        {/* Background Circle */}
        <circle
          stroke="url(#paint0_linear_4877_9460)"
          opacity={'22%'}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={circleRadius}
          cy={circleRadius}
        />
        {/* Progress Circle (now counter-clockwise starting from top) */}
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
      </svg>
      {photo ? (
        <AsyncDecryptedImage
          imageUrl={photo}
          className="w-[76px] h-[76px] rounded-full object-cover object-center p-[5px]"
          alt="Profile"
        />
      ) : (
        <div className="w-[70px] h-[70px] rounded-full bg-[#FFFFFF12] flex justify-center items-center p-[5px]">
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
    </div>
  );
};

export default ProfileAvatar;