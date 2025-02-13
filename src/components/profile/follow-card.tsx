import { AvatarImage, Avatar } from "../ui/avatar";
import { Link } from "react-router-dom";
import { paths } from "@/routes/paths";
import FollowBtn from "./follow-btn";
import { useEffect, useState } from "react";

const decryptImage = (arrayBuffer, key = 0x12, decryptSize = 4096) => {
  const data = new Uint8Array(arrayBuffer);
  const maxSize = Math.min(decryptSize, data.length);
  for (let i = 0; i < maxSize; i++) {
    data[i] ^= key;
  }
  // Decode the entire data as text.
  return new TextDecoder().decode(data);
};

const FollowCard = ({ data }: { data: any }) => {
  const [decryptedPhoto, setDecryptedPhoto] = useState("");

  console.log(data, "follow card");

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
        console.log("Decrypted profile photo string is =>", decryptedStr);

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
    <div className="w-full flex justify-between items-center py-1">
      <Link
        to={paths.getUserProfileId(data?.id)}
        className="flex items-center gap-4"
      >
        <Avatar className="border-2">
          <AvatarImage src={decryptedPhoto} alt="@shadcn" />
        </Avatar>
        <div className="text-[14px] space-y-2">
          <h1>{data?.nickname}</h1>
          <h1 className="text-[#888]">ID : {data?.user_code}</h1>
        </div>
      </Link>

      <FollowBtn id={data?.id} followBack={data?.follows_back} />
      {/* <Button
        onClick={() => changeFollowStatusHandler(data?.user_code)}
        className={`${
          data?.follows_back ? "bg-[#FFFFFF17]" : "gradient-bg"
        } w-[88px]`}
        size={"sm"}
      >
        {data?.follows_back ? "Following" : "Follow"}
      </Button> */}
    </div>
  );
};

export default FollowCard;
