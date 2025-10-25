import { AvatarImage, Avatar } from "../ui/avatar";
import AvatarImage2 from "../avatar/avatar-image";
import { Link } from "react-router-dom";
import { paths } from "@/routes/paths";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FollowBtn from "../profile/follow-btn";
import davatar from "@/assets/davatar.png";
import ImageWithPlaceholder1 from "@/page/explore/comp/ImgPlaceHolder1";

const decryptImage = async (
  arrayBuffer: any,
  key = 0x12,
  decryptSize = 4096
) => {
  const data = new Uint8Array(arrayBuffer);
  const maxSize = Math.min(decryptSize, data.length);
  for (let i = 0; i < maxSize; i++) {
    data[i] ^= key;
  }
  // Decode the entire data as text.
  const decryptedStr = new TextDecoder().decode(data);

  // Convert the data URL to a Blob and create a blob URL
  if (decryptedStr.startsWith("data:")) {
    try {
      // Extract mime type and base64 data
      const matches = decryptedStr.match(/^data:([^;]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        throw new Error("Invalid data URL format");
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
      console.error("Error converting data URL to blob:", err);
      // Fall back to data URL if conversion fails
      return decryptedStr;
    }
  }

  return decryptedStr;
};

const RankingCard = ({ data, refetch }: { data: any; refetch: any }) => {
  const user = useSelector((state: any) => state?.persist?.user);
  // console.log(data?.is_followed);
  const followStatus =
    useSelector((state: any) => state.follow.status) ?? data?.is_followed;

  const [decryptedPhoto, setDecryptedPhoto] = useState("");
  const me = useSelector((state: any) => state?.persist?.user?.id);
  const isFollowed = followStatus[data?.id] ?? data?.is_followed;
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
      if (decryptedPhoto && decryptedPhoto.startsWith("blob:")) {
        URL.revokeObjectURL(decryptedPhoto);
      }
    };
  }, [data?.photo]);

  // useEffect(() => {
  //   if (user?.token) refetch();
  // }, [user?.token]);

  // console.log(data);
  return (
    <div className="w-full flex justify-between items-center py-1">
      <Link
        to={paths.getUserProfileId(data?.id)}
        className="flex items-center gap-4"
      >
        <Avatar className="">
          <AvatarImage
            src={data?.photo ? decryptedPhoto : davatar}
            alt="@shadcn"
          />
        </Avatar>
        <div className="text-[14px] space-y-0.5">
          <h1>{data?.nickname}</h1>
          <h1 className="text-[#888]">
            {/* {data?.total >= 1000 ? formatToK(data?.total) : data?.total}{" "}
            followers */}
            {data?.total_followers}
          </h1>
        </div>
      </Link>

      {data?.id == me ? (
        <></>
      ) : (
        <FollowBtn id={data?.id} followBack={isFollowed} refetch={refetch} />
      )}
    </div>
  );
};

export const RankingCardVideo = ({
  data,
  refetch,
}: {
  data: any;
  refetch: any;
}) => {
  return (
    <div className="w-full flex justify-between items-center py-1 gap-x-2">
      <div className="bg-gray-200 aspect-square w-20 rounded-[6px] flex-shrink-0">
        <ImageWithPlaceholder1
          src={data?.preview_image}
          width={""}
          height={""}
          alt={data?.title || "Video"}
          className={`w-full relative aspect-square rounded-[6px] object-cover`}
        />
      </div>
      <div className="flex flex-col w-full">
        <p className="line-clamp-2">{data?.title}</p>
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-x-1">
            <AvatarImage2
              src={data?.user?.avatar}
              width={""}
              height={""}
              className="w-5 h-5 rounded-full bg-red-500"
              alt=""
            />
            <p className="text-xs font-medium">{data?.user?.name}</p>
          </div>
          <p className="text-xs">{data?.like_count} likes</p>
        </div>
      </div>
    </div>
  );
};

export default RankingCard;
