import { Person } from "@/assets/profile";
import AsyncDecryptedImage from "@/utils/asyncDecryptedImage";

interface ProfileAvatarProps {
  progressData?: number;
  levelImage?: string;
  photo?: string;
}

const ProfileAvatar = ({
  progressData,
  levelImage,
  photo,
}: ProfileAvatarProps) => {
  const progress = progressData || 0;
  const circleRadius = 30; // Adjusted radius to fit within 60px
  const strokeWidth = 4; // Stroke width
  const normalizedRadius = circleRadius - strokeWidth / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="w-[60px] z-[1900] h-[60px] rounded-full bg-[#FFFFFF12] flex justify-center items-center relative">
      {progressData ? (
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
          </defs>
          {/* Background Circle */}
          <circle
            stroke="#888"
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
      ) : (
        <></>
      )}
      {photo ? (
        <AsyncDecryptedImage
          imageUrl={photo}
          className="w-[58px] h-[58px] rounded-full object-cover object-center"
          alt="Profile"
        />
      ) : (
        <div className="w-[58px] h-[58px] rounded-full bg-[#FFFFFF12] flex justify-center items-center p-2">
          <Person />
        </div>
      )}

      {levelImage && (
        <AsyncDecryptedImage
          imageUrl={levelImage}
          className="absolute -bottom-3 right-1"
          alt="Level"
        />
      )}
    </div>
  );
};

export default ProfileAvatar;
