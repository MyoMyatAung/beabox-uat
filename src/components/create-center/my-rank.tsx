import { AvatarImage, Avatar } from "../ui/avatar";
import { Link } from "react-router-dom";
import { paths } from "@/routes/paths";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FollowBtn from "../profile/follow-btn";

const decryptImage = (arrayBuffer: any, key = 0x12, decryptSize = 4096) => {
  const data = new Uint8Array(arrayBuffer);
  const maxSize = Math.min(decryptSize, data.length);
  for (let i = 0; i < maxSize; i++) {
    data[i] ^= key;
  }
  // Decode the entire data as text.
  return new TextDecoder().decode(data);
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
