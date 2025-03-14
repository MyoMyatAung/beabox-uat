import { AvatarImage, Avatar } from "../ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { paths } from "@/routes/paths";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import RankBtn from "./rank-btn";
import rank1 from "@/assets/createcenter/rank1.jpeg";
import RankBtn2 from "./rank-btn2";

const decryptImage = (arrayBuffer: any, key = 0x12, decryptSize = 4096) => {
  const data = new Uint8Array(arrayBuffer);
  const maxSize = Math.min(decryptSize, data.length);
  for (let i = 0; i < maxSize; i++) {
    data[i] ^= key;
  }
  // Decode the entire data as text.
  return new TextDecoder().decode(data);
};

const TopRankCard2 = ({ data, rank }: { data: any; rank: any }) => {
  const [decryptedPhoto, setDecryptedPhoto] = useState("");
  const me = useSelector((state: any) => state?.persist?.user?.id);
  const navigate = useNavigate();
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
    <div
      className={`w-full pt-1 ${
        (rank == 1 && "rank1bg") ||
        (rank == 2 && "rank2bg") ||
        (rank == 3 && "rank3bg")
      }  relative flex flex-col justify-center items-center rounded-[4px]`}
    >
      {/* <p className="text-[16px] text-[#080608] font-semibold absolute top-3 left-3">
        {rank}
      </p> */}
      <div className="bg-gradient-to-b from-[#00000000] absolute top-0 left-0  to-[#000000] w-full min-h-[100px]  rounded-[8px]"></div>

      <img
        src={decryptedPhoto}
        className="w-5 h-5 rounded-full object-cover object-center"
        alt=""
      />
      <h1 className="text-[5px] font-semibold z-50 py-0.5">{data?.nickname}</h1>
      <h1 className="text-[#AAA] text-[5px] z-[9999] text-center">
        {data?.total >= 1000 ? formatToK(data?.total) : data?.total}
        followers
      </h1>
      <RankBtn2 id={data?.id} followBack={data?.follows_back} rank={rank} />
      {/* {data?.id == me ? (
        <></>
      ) : (
        <RankBtn2 id={data?.id} followBack={data?.follows_back} rank={rank} />
      )} */}
    </div>
    // <div
    //   className={`${
    //     (rank == 1 && "rank1") ||
    //     (rank == 2 && "rank2") ||
    //     (rank == 3 && "rank3 ")
    //   }  w-[110px] h-[131px] border-[0px] relative flex flex-col justify-center items-center rounded-[8px] pt-5`}
    // >
    //   <div className="bg-gradient-to-b from-[#00000000] absolute top-0 left-0  to-[#000000] w-[110px] h-[131px]  rounded-[8px]"></div>
    //   <Avatar>
    //     <AvatarImage className="" src={decryptedPhoto} alt="@shadcn" />
    //   </Avatar>
    //   <h1 className="text-[14px] font-semibold z-50">{data?.nickname}</h1>
    //   <h1 className="text-[#AAA] text-[12px] z-50">
    //     {data?.total >= 1000 ? formatToK(data?.total) : data?.total} followers
    //   </h1>
    //   {data?.id == me ? (
    //     <></>
    //   ) : (
    //     <RankBtn id={data?.id} followBack={data?.follows_back} rank={rank} />
    //   )}
    //   <p className="text-[16px] text-[#080608] font-semibold absolute top-3 left-3">
    //     {rank}
    //   </p>
    // </div>
  );
};

export default TopRankCard2;
