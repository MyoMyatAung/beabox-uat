// import { AvatarImage, Avatar } from "../ui/avatar";
// import { Link, useNavigate } from "react-router-dom";
// import { paths } from "@/routes/paths";
// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import RankBtn from "./rank-btn";
// import { MdPerson } from "react-icons/md";

// const decryptImage = (arrayBuffer: any, key = 0x12, decryptSize = 4096) => {
//   const data = new Uint8Array(arrayBuffer);
//   const maxSize = Math.min(decryptSize, data.length);
//   for (let i = 0; i < maxSize; i++) {
//     data[i] ^= key;
//   }
//   // Decode the entire data as text.
//   return new TextDecoder().decode(data);
// };

// const TopRankCard = ({ data, rank }: { data: any; rank: any }) => {
//   const [decryptedPhoto, setDecryptedPhoto] = useState("");
//   const me = useSelector((state: any) => state?.persist?.user?.id);
//   const navigate = useNavigate();
//   function formatToK(number: any) {
//     return (number / 1000).toFixed(2) + "k";
//   }
//   useEffect(() => {
//     const loadAndDecryptPhoto = async () => {
//       if (!data?.photo) {
//         setDecryptedPhoto("");
//         return;
//       }

//       try {
//         const photoUrl = data?.photo;

//         // If it's not a .txt file, assume it's already a valid URL
//         if (!photoUrl.endsWith(".txt")) {
//           setDecryptedPhoto(photoUrl);
//           return;
//         }

//         // Fetch encrypted image data
//         const response = await fetch(photoUrl);
//         const arrayBuffer = await response.arrayBuffer();

//         // Decrypt the first 4096 bytes and decode as text.
//         const decryptedStr = decryptImage(arrayBuffer);

//         // Set the decrypted profile photo source
//         setDecryptedPhoto(decryptedStr);
//       } catch (error) {
//         console.error("Error loading profile photo:", error);
//         setDecryptedPhoto("");
//       }
//     };

//     loadAndDecryptPhoto();
//   }, [data?.photo]);
//   console.log(data?.photo);
//   return (
//     <div
//       // onClick={() => navigate(paths.getUserProfileId(data?.id))}
//       className={`${
//         (rank == 1 && "rank1") ||
//         (rank == 2 && "rank2") ||
//         (rank == 3 && "rank3 ")
//       } rank1 w-[110px] h-[131px] border-[0px] relative flex flex-col justify-center items-center rounded-[8px] pt-5`}
//     >
//       <div className="bg-gradient-to-b from-[#00000000] absolute top-0 left-0  to-[#000000] w-[110px] h-[131px]  rounded-[8px]"></div>
//       {data?.photo ? (
//         <Avatar>
//           <AvatarImage src={decryptedPhoto} alt="@shadcn" />
//         </Avatar>
//       ) : (
//         <div className="bg-gray-800 rounded-full p-2 mb-1">
//           <MdPerson size={28} className="" />
//         </div>
//       )}
//       {/* <Avatar>
//         <AvatarImage src={decryptedPhoto} alt="@shadcn" />
//       </Avatar> */}

//       <h1 className="text-[14px] font-semibold z-50">{data?.nickname}</h1>
//       <h1 className="text-[#AAA] text-[14px] z-50">
//         {/* {data?.total >= 1000 ? formatToK(data?.total) : data?.total} followers */}
//         {data?.total_followers}
//       </h1>
//       {data?.id == me ? (
//         <div className="opacity-0">
//           <RankBtn id={data?.id} followBack={data?.follows_back} rank={rank} />
//         </div>
//       ) : (
//         <RankBtn id={data?.id} followBack={data?.follows_back} rank={rank} />
//       )}
//       <p className="text-[16px] text-[#080608] font-semibold absolute top-3 left-3">
//         {rank}
//       </p>
//     </div>
//   );
// };

// export default TopRankCard;

import { Sparkle } from "lucide-react";
import React from "react";
import { BsPersonFill } from "react-icons/bs";
import { FaCrown } from "react-icons/fa6";
import { useSelector } from "react-redux";
import RankBtn from "./rank-btn";
import ImageWithPlaceholder from "@/page/explore/comp/imgPlaceHolder";
import AvatarImage from "../avatar/avatar-image";
import { Link } from "react-router-dom";
import { paths } from "@/routes/paths";

const TopRankCard = ({
  data,
  rank,
  refetch,
}: {
  data: any;
  rank: any;
  refetch: any;
}) => {
  const me = useSelector((state: any) => state?.persist?.user?.id);
  // console.log(data);
  const followStatus =
    useSelector((state: any) => state.follow.status) ?? data?.is_followed;
  const isFollowed = followStatus[data?.id] ?? data?.is_followed;

  return (
    <div
      className={`
      ${
        (rank == 1 && "rank1") ||
        (rank == 2 && "rank2") ||
        (rank == 3 && "rank3 ")
      }
     flex flex-col items-center w-full justify-center  z-50 rounded-[8px] pt-7 relative`}
    >
      <div className="bg-gradient-to-b from-[#00000000] to-[#000000] absolute top-0 left-0   w-full h-full  rounded-[8px]"></div>
      <p className="absolute top-2 left-2 text-[#fff] font-semibold text-[16px]">
        {rank}
      </p>
      {data?.photo ? (
        <Link to={paths.getUserProfileId(data?.id)}>
          <div className="w-10 h-10 relative">
            <AvatarImage
              src={data?.photo}
              width={""}
              height={""}
              className="w-10 h-10 rounded-full"
              alt=""
            />
            <FaCrown
              className={` ${
                (rank == 1 && "text-[#F7E29B]") ||
                (rank == 2 && "text-[#D7D7D8]") ||
                (rank == 3 && "text-[#FF9C7B] ")
              }  absolute -top-3 -rotate-45 -left-2`}
            />
          </div>
        </Link>
      ) : (
        <div className="bg-[#FFFFFF52] w-10 h-10 rounded-full flex justify-center items-center border relative">
          <BsPersonFill size={24} />
          <FaCrown
            className={` ${
              (rank == 1 && "text-[#F7E29B]") ||
              (rank == 2 && "text-[#D7D7D8]") ||
              (rank == 3 && "text-[#FF9C7B] ")
            }  absolute -top-3 -rotate-45 -left-2`}
          />
        </div>
      )}
      <p className="text-[14px] pt-3 z-50">
        {data?.nickname ? data?.nickname : "未知"}
      </p>
      <p className="text-[#AAA] text-[14px] z-50 pb-1">
        {data?.total_followers}
      </p>
      {data?.id == me ? (
        <div className="opacity-0">
          <RankBtn id={data?.id} followBack={isFollowed} refetch={refetch} />
        </div>
      ) : (
        <RankBtn id={data?.id} followBack={isFollowed} refetch={refetch} />
      )}
    </div>
  );
};

export default TopRankCard;
