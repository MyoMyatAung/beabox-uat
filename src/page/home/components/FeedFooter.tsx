// import { useState } from "react";

// function FeedFooter({
//   title,
//   tags,
//   city,
//   username,
// }: {
//   title: any;
//   tags: any;
//   city: any;
//   username: any;
// }) {
//   const [isExpanded, setIsExpanded] = useState(false);

//   const toggleExpand = () => {
//     setIsExpanded(!isExpanded);
//   };

//   return (
//     <div className="videoFooter1">
//       <div className="">
//         <div className="flex items-center gap-3 mb-2">
//           <div className="flex items-center gap-2">
//             <span className="footer_head_text font-cnFont">{username}</span>
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="18"
//               height="19"
//               viewBox="0 0 18 19"
//               fill="none"
//             >
//               <circle
//                 cx="9"
//                 cy="9.5"
//                 r="9"
//                 fill="url(#paint0_linear_3792_3390)"
//               />
//               <path
//                 d="M13.2002 6.3999L7.7002 11.8999L5.2002 9.3999"
//                 stroke="white"
//                 stroke-width="1.5"
//                 stroke-linecap="round"
//                 stroke-linejoin="round"
//               />
//               <defs>
//                 <linearGradient
//                   id="paint0_linear_3792_3390"
//                   x1="8.59091"
//                   y1="11.75"
//                   x2="0.390618"
//                   y2="0.222136"
//                   gradientUnits="userSpaceOnUse"
//                 >
//                   <stop stop-color="#CD3EFF" />
//                   <stop offset="1" stop-color="#FFB2E0" />
//                 </linearGradient>
//               </defs>
//             </svg>
//           </div>
//         </div>

//         <div className="relative flex items-end overflow-hidden">
//           {/* Combined Title and Tags Section */}
//           {title.length > 30 || tags.length > 3 ? (
//             <div
//               onClick={toggleExpand}
//               className={`footer_title  transition-all ${
//                 isExpanded ? "max-h-full" : "line-clamp-2"
//               } w-[80%] flex flex-wrap`}
//             >
//               <span className="mr-2">{title}</span>
//               {tags?.map((tag: any, index: number) => (
//                 <span key={index} className="footer_tag mr-1">
//                   #{tag}
//                 </span>
//               ))}
//             </div>
//           ) : (
//             <div
//               className={`footer_title  transition-all max-h-full w-[80%] flex flex-wrap`}
//             >
//               <span className="mr-2">{title}</span>
//               {tags?.map((tag: any, index: number) => (
//                 <span key={index} className="footer_tag mr-1">
//                   #{tag}
//                 </span>
//               ))}
//             </div>
//           )}

//           {/* More/Less Button Inline */}
//           {(title.length > 30 || tags.length > 3) && (
//             <button
//               className="more_text inline ml-[-3px]"
//               onClick={toggleExpand}
//             >
//               {isExpanded ? "收起" : "更多"}
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default FeedFooter;

import { setHistoryData } from "@/page/search/slice/HistorySlice";
import { decryptImage } from "@/utils/imageDecrypt";
import useCachedImage from "@/utils/useCachedImage";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function FeedFooter({
  title,
  tags,
  city,
  username,
  badge,
  id,
}: {
  title: string;
  tags: string[];
  city: string;
  username: string;
  badge: string;
  id: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => setIsExpanded(!isExpanded);
  const [decryptedPhoto, setDecryptedPhoto] = useState("");
  const { hideBar } = useSelector((state: any) => state.hideBarSlice);
  // const { imgSrc, isLoading: imageLoading } = useCachedImage(
  //   decryptedPhoto || ""
  // );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Calculate title length without spaces
  const titleLength = title.replace(/\s/g, "").length;
  const shouldExpand =
    titleLength > 40 || (tags?.length > 5 && titleLength > 10);

  useEffect(() => {
    const loadAndDecryptPhoto = async () => {
      if (!badge) {
        setDecryptedPhoto("");
        return;
      }

      try {
        const photoUrl = badge;

        // If it's not a .txt file, assume it's already a valid URL
        if (!photoUrl.endsWith(".txt")) {
          setDecryptedPhoto(photoUrl);
          return;
        }
        const decryptedUrl = await decryptImage(photoUrl);
        setDecryptedPhoto(decryptedUrl);
      } catch (error) {
        console.error("Error loading profile photo:", error);
        setDecryptedPhoto("");
      }
    };

    loadAndDecryptPhoto();
  }, [badge]);

  const onSearch = (suggestion: any) => {
    if (suggestion.trim()) {
      dispatch(setHistoryData({ data: suggestion.trim() }));
      navigate(`/search?query=${encodeURIComponent(suggestion.trim())}`);
    }
  };

  const handleProfile = () => {
    navigate(`/user/${id}`);
  };
  return (
    <div
      className="videoFooter1 w-full"
      style={{
        opacity: hideBar ? 0 : 1,
        transition: "opacity 0.3s ease-in-out",
        pointerEvents: hideBar ? "none" : "auto",
      }}
    >
      <div className="w-full">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-2" onClick={handleProfile}>
            <span className="footer_head_text font-cnFont">{username}</span>
            {decryptedPhoto && (
              <img
                src={decryptedPhoto || ""}
                alt=""
                className="w-[18px] h-[18px]"
              />
            )}
          </div>
        </div>

        <div className="relative flex items-end overflow-hidden w-full">
          <div
            onClick={shouldExpand ? toggleExpand : undefined}
            className={`footer_title font-cnFont transition-all w-[80%] flex flex-wrap ${
              shouldExpand
                ? isExpanded
                  ? "max-h-full"
                  : "line-clamp-2"
                : "max-h-full"
            }`}
          >
            <div className="mr-0">
              {title}

              {tags?.map((tag, index) => (
                <span
                  key={index}
                  className="footer_tag ml-1"
                  onClick={() => onSearch(tag)}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {shouldExpand && (
            <button
              className="more_text font-cnFont inline ml-[0px] text-primary"
              onClick={toggleExpand}
            >
              {isExpanded ? "收起" : "更多"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default FeedFooter;
