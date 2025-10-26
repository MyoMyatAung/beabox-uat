import { AvatarImage, Avatar } from "../ui/avatar";
import AvatarImage2 from "../avatar/avatar-image";
import { Link } from "react-router-dom";
import { paths } from "@/routes/paths";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FollowBtn from "../profile/follow-btn";
import davatar from "@/assets/davatar.png";
import ImageWithPlaceholder from "./img-with-placeholder";

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
  // console.log(data?.is_followed);
  const followStatus =
    useSelector((state: any) => state.follow.status) ?? data?.is_followed;

  const [decryptedPhoto, setDecryptedPhoto] = useState("");
  const me = useSelector((state: any) => state?.persist?.user?.id);
  const isFollowed = followStatus[data?.id] ?? data?.is_followed;
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
  onVideoClick,
}: {
  data: any;
  refetch: any;
  onVideoClick?: (videoId: string) => void;
}) => {
  const handleClick = () => {
    if (onVideoClick && data?.post_id) {
      onVideoClick(data.post_id);
    }
  };

  return (
    <div className="w-full flex justify-between items-center py-1 gap-x-2 cursor-pointer">
      <div
        className="aspect-square w-20 h-20 rounded-[6px] flex-shrink-0"
        onClick={handleClick}
      >
        <ImageWithPlaceholder
          src={data?.preview_image}
          alt={data?.title || "Video"}
          width="100%"
          height="100%"
          className="rounded-[6px]"
          useBlurBackground={true}
        />
      </div>
      <div className="flex flex-col w-full">
        <p className="line-clamp-2" onClick={handleClick}>
          {data?.title}
        </p>
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-x-1">
            <AvatarImage2
              src={data?.user?.avatar}
              width={""}
              height={""}
              className="w-5 h-5 rounded-full bg-red-500"
              alt=""
            />
            <Link to={paths.getUserProfileId(data?.user?.id)}>
              <p className="text-xs font-medium">{data?.user?.name}</p>
            </Link>
          </div>
          <div className="flex items-center gap-x-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="12"
              viewBox="0 0 13 12"
              fill="none"
            >
              <path
                d="M8.56675 1.13281C7.53401 1.13281 6.6298 1.57692 6.06616 2.32759C5.50253 1.57692 4.59832 1.13281 3.56557 1.13281C2.74349 1.13374 1.95535 1.46072 1.37405 2.04202C0.792751 2.62332 0.46577 3.41146 0.464844 4.23354C0.464844 7.73437 5.65557 10.568 5.87662 10.6851C5.93488 10.7164 6.00001 10.7328 6.06616 10.7328C6.13232 10.7328 6.19745 10.7164 6.25571 10.6851C6.47676 10.568 11.6675 7.73437 11.6675 4.23354C11.6666 3.41146 11.3396 2.62332 10.7583 2.04202C10.177 1.46072 9.38883 1.13374 8.56675 1.13281Z"
                stroke="#BBBBBB"
                strokeWidth="0.8"
              />
            </svg>
            <p className="text-xs">{data?.like_count} likes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankingCard;
