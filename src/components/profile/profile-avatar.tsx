import { Person } from "@/assets/profile";
import { useEffect, useState } from "react";
const decryptImage = (arrayBuffer: any, key = 0x12, decryptSize = 4096) => {
  const data = new Uint8Array(arrayBuffer);
  const maxSize = Math.min(decryptSize, data.length);
  for (let i = 0; i < maxSize; i++) {
    data[i] ^= key;
  }
  // Decode the entire data as text.
  return new TextDecoder().decode(data);
};
const ProfileAvatar = ({ progressData, levelImage, photo }: any) => {
  const progress = progressData || 0;
  const circleRadius = 30; // Adjusted radius to fit within 60px
  const strokeWidth = 4; // Stroke width
  const normalizedRadius = circleRadius - strokeWidth / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const [decryptedPhoto, setDecryptedPhoto] = useState("");

  

  useEffect(() => {
    const loadAndDecryptPhoto = async () => {
      if (!levelImage) {
        setDecryptedPhoto("");
        return;
      }

      try {
        const photoUrl = levelImage;

        // If it's not a .txt file, assume it's already a valid URL
        if (!photoUrl.endsWith(".txt")) {
          setDecryptedPhoto(photoUrl);
          return;
        }

        // Fetch encrypted image data
        const response = await fetch(photoUrl);
        const arrayBuffer = await response.arrayBuffer();

        // Decrypt the first 4096 bytes and decode as text.
        const decryptedStr = decryptImage(arrayBuffer);

        // Set the decrypted profile photo source
        setDecryptedPhoto(decryptedStr);
      } catch (error) {
        console.error("Error loading profile photo:", error);
        setDecryptedPhoto("");
      }
    };

    loadAndDecryptPhoto();
  }, [levelImage]);

  return (
    // <img
    //   className="w-[58px] h-[58px] rounded-full object-cover object-center"
    //   src={photo}
    //   alt=""
    // />
    <div className="w-[60px] z-[1900] h-[60px] rounded-full bg-[#FFFFFF12] flex justify-center items-center relative">
      {progressData ? (
        <svg
          height={circleRadius * 2}
          width={circleRadius * 2}
          className="absolute transform rotate-[-90deg]"
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
            stroke="#888" // Tailwind gray-300
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={circleRadius}
            cy={circleRadius}
          />
          {/* Progress Circle */}
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
        <img
          className="w-[58px] h-[58px] rounded-full object-cover object-center"
          src={photo}
          alt=""
        />
      ) : (
        <div className="w-[58px] h-[58px] rounded-full bg-[#FFFFFF12] flex justify-center items-center p-2">
          <Person />
        </div>
      )}

      <img src={decryptedPhoto} className="absolute -bottom-3 right-1" alt="" />
    </div>
  );
};

export default ProfileAvatar;

{
  /* <div className="w-[58px] h-[58px] rounded-full bg-[#FFFFFF12] flex justify-center items-center">
<Person />
</div> */
}
