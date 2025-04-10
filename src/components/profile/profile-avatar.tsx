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
        
        // Convert the data URL to a Blob and create a blob URL
        if (decryptedStr.startsWith('data:')) {
          try {
            // Extract mime type and base64 data
            const matches = decryptedStr.match(/^data:([^;]+);base64,(.+)$/);
            if (!matches || matches.length !== 3) {
              throw new Error('Invalid data URL format');
            }
            
            const mimeType = matches[1];
            const base64Data = matches[2];
            
            // Convert base64 to binary
            const binaryString = atob(base64Data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            
            // Create Blob and blob URL
            const blob = new Blob([bytes], { type: mimeType });
            const blobUrl = URL.createObjectURL(blob);
            setDecryptedPhoto(blobUrl);
          } catch (err) {
            console.error('Error converting data URL to blob:', err);
            // Fall back to data URL if conversion fails
            setDecryptedPhoto(decryptedStr);
          }
        } else {
          setDecryptedPhoto(decryptedStr);
        }
      } catch (error) {
        console.error("Error loading profile photo:", error);
        setDecryptedPhoto("");
      }
    };

    loadAndDecryptPhoto();
    
    // Clean up blob URLs when component unmounts or when levelImage changes
    return () => {
      if (decryptedPhoto && decryptedPhoto.startsWith('blob:')) {
        URL.revokeObjectURL(decryptedPhoto);
      }
    };
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
