import { AvatarImage, Avatar } from "../ui/avatar";
import { Link } from "react-router-dom";
import { paths } from "@/routes/paths";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FollowBtn from "../profile/follow-btn";

const decryptImage = async (arrayBuffer: any, key = 0x12, decryptSize = 4096) => {
  const data = new Uint8Array(arrayBuffer);
  const maxSize = Math.min(decryptSize, data.length);
  for (let i = 0; i < maxSize; i++) {
    data[i] ^= key;
  }
  // Decode the entire data as text.
  const decryptedStr = new TextDecoder().decode(data);
  
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
      return URL.createObjectURL(blob);
    } catch (err) {
      console.error('Error converting data URL to blob:', err);
      // Fall back to data URL if conversion fails
      return decryptedStr;
    }
  }
  
  return decryptedStr;
};

const MyRank = ({ data, rankno }: any) => {
  const [decryptedPhoto, setDecryptedPhoto] = useState("");
  const me = useSelector((state: any) => state?.persist?.user?.id);
  function formatToK(number: any) {
    return (number / 1000).toFixed(2) + "k";
  }
  useEffect(() => {
    const loadAndDecryptPhoto = async () => {
      if (!data?.photo) {
        setDecryptedPhoto("");
        return;
      }

      try {
        const photoUrl = data?.photo;

        // If it's not a .txt file, assume it's already a valid URL
        if (!photoUrl.endsWith(".txt")) {
          setDecryptedPhoto(photoUrl);
          return;
        }

        // Fetch encrypted image data
        const response = await fetch(photoUrl);
        const arrayBuffer = await response.arrayBuffer();

        // Decrypt the data and convert to blob URL if it's a data URL
        const decryptedUrl = await decryptImage(arrayBuffer);
        setDecryptedPhoto(decryptedUrl);
      } catch (error) {
        console.error("Error loading profile photo:", error);
        setDecryptedPhoto("");
      }
    };

    loadAndDecryptPhoto();
    
    // Clean up blob URLs when component unmounts or data changes
    return () => {
      if (decryptedPhoto && decryptedPhoto.startsWith('blob:')) {
        URL.revokeObjectURL(decryptedPhoto);
      }
    };
  }, [data?.photo]);

  return (
    <div className="w-full flex justify-between bg-gradient-to-r from-[#5a256d] to-[#641544]  items-center py-3 px-5">
      <div className="flex items-center gap-4">
        <p>{rankno}</p>
        <Link
          to={paths.getUserProfileId(data?.id)}
          className="flex items-center gap-4"
        >
          <Avatar className="border-[0.5px]">
            <AvatarImage src={decryptedPhoto} alt="@shadcn" />
          </Avatar>
          <div className="text-[14px] space-y-2">
            <h1>{data?.nickname}</h1>
            <h1 className="text-[#888]">
              {data?.total >= 1000 ? formatToK(data?.total) : data?.total}{" "}
              followers
            </h1>
          </div>
        </Link>
      </div>

      <button className="text-[14px] bg-[#FFFFFF17] px-2 py-1 rounded-[8px]">
        你的排名
      </button>
    </div>
  );
};

export default MyRank;
