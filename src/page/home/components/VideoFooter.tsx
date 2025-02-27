// import { useState } from "react";

// function VideoFooter({
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
//     <div className="videoFooter">
//       <div className="">
//         <div className="flex items-center gap-3 mb-2">
//           <div className="flex items-center gap-2">
//             <span className="footer_head_text font-cnFont">{username}</span>
// <svg
//   xmlns="http://www.w3.org/2000/svg"
//   width="19"
//   height="18"
//   viewBox="0 0 19 18"
//   fill="none"
// >
//   <path
//     d="M14.8567 9.5C14.8567 12.5376 12.3943 15 9.35669 15C6.31912 15 3.85669 12.5376 3.85669 9.5C3.85669 6.46243 6.31912 4 9.35669 4C12.3943 4 14.8567 6.46243 14.8567 9.5Z"
//     fill="#3D3D3D"
//   />
//   <path
//     d="M8.79875 0.102885C8.61421 0.202535 8.1787 0.578994 7.46269 1.2581C7.21541 1.49061 7.07516 1.59396 6.99027 1.61241C6.80943 1.64563 6.40713 1.59765 5.8203 1.47216C5.43646 1.39096 5.19287 1.36144 4.87915 1.35775C4.47686 1.35037 4.44364 1.35406 4.28125 1.45002C4.11516 1.54967 3.88264 1.8154 3.88264 1.91136C3.88264 1.9372 3.8605 2.01101 3.83097 2.07745C3.80145 2.14388 3.75347 2.29151 3.72394 2.40224C3.64643 2.69012 3.55417 3.05181 3.49511 3.28802C3.35855 3.84164 3.32534 3.93391 3.23307 4.02987C3.17033 4.0963 2.88244 4.24024 2.44693 4.42847C1.05551 5.02637 0.89312 5.14448 0.804541 5.62059C0.767634 5.82358 0.922646 6.43625 1.2991 7.56931C1.40614 7.8941 1.42459 8.03804 1.36923 8.16722C1.34339 8.23365 1.0998 8.6138 0.834068 9.0161C0.114367 10.0901 0.0442427 10.271 0.188183 10.6622C0.291524 10.9316 0.546188 11.19 1.16993 11.6587C1.70878 12.061 1.85272 12.2086 2.00035 12.5076C2.11107 12.729 2.11476 12.7585 2.09631 13.0427C2.04095 13.8326 2.02988 14.5707 2.07417 14.7663C2.15167 15.1096 2.32514 15.3162 2.65362 15.4528C2.80125 15.5155 3.32165 15.5857 4.11516 15.6484C4.75367 15.7001 4.87915 15.737 5.06 15.9215C5.14489 16.0064 5.21132 16.0876 5.21132 16.1061C5.21132 16.1245 5.31097 16.3054 5.43277 16.5084C5.55456 16.7077 5.65421 16.8811 5.65421 16.8885C5.65421 16.9107 5.98269 17.3868 6.1414 17.5971C6.22259 17.7042 6.36653 17.8333 6.4588 17.8887C6.60643 17.9773 6.66918 17.9921 6.90908 17.9884C7.24125 17.9847 7.43316 17.9035 8.6991 17.2391C8.93531 17.1173 9.03496 17.0841 9.19735 17.0804C9.38558 17.0767 9.46309 17.1063 10.2751 17.5086C10.7807 17.7595 11.231 17.9551 11.338 17.9773C11.7403 18.0548 11.9913 17.9404 12.3234 17.5344C12.4305 17.4015 12.519 17.2834 12.519 17.2687C12.519 17.2539 12.5818 17.1469 12.663 17.0288C12.7405 16.9107 12.9066 16.6302 13.0321 16.4087C13.4159 15.7296 13.4307 15.7222 14.3976 15.6336C15.5676 15.5229 15.6931 15.5008 15.9552 15.3347C16.1175 15.2314 16.2246 15.0911 16.2984 14.8733C16.3648 14.6851 16.3759 13.803 16.3205 13.0944C16.2689 12.4227 16.243 12.4633 17.1141 11.7731C17.8522 11.1826 18.1143 10.9168 18.2065 10.6548C18.2693 10.4703 18.2766 10.4112 18.2397 10.2525C18.1918 10.02 18.0921 9.79485 17.9482 9.58447C17.8854 9.49221 17.8338 9.40732 17.8338 9.39625C17.8338 9.38148 17.6935 9.18587 17.5237 8.96073C17.354 8.73191 17.1805 8.46617 17.1362 8.36652C16.9996 8.05281 17.0439 7.49919 17.2322 7.14488C17.4093 6.81271 17.6086 6.07824 17.6123 5.76822C17.6123 5.2146 17.4019 5.02268 16.2467 4.54288C15.9921 4.43585 15.6673 4.30298 15.5196 4.24024C15.1063 4.06677 15.0915 4.04463 14.859 3.10348C14.8073 2.88942 14.752 2.64952 14.7335 2.56832C14.7151 2.48712 14.6486 2.28044 14.5896 2.11066C14.4161 1.62717 14.1947 1.39835 13.8551 1.35406C13.6706 1.33191 13.0468 1.37989 12.818 1.43894C12.4342 1.53859 11.9839 1.60503 11.6665 1.60503L11.3122 1.60872L11.039 1.35775C10.8877 1.22119 10.5445 0.903783 10.2714 0.65281C9.99825 0.398147 9.69561 0.154556 9.58858 0.0991946C9.32653 -0.0336731 9.05341 -0.033674 8.79875 0.102885ZM12.8807 6.31445C13.0468 6.40303 13.2572 6.6171 13.3495 6.79056C13.427 6.94188 13.4602 7.2962 13.4085 7.47705C13.3864 7.55824 13.2978 7.72433 13.2092 7.84612C13.1206 7.96792 12.0614 9.0567 10.8545 10.271C8.34848 12.7844 8.47396 12.6847 7.93142 12.6552C7.67676 12.6404 7.60294 12.622 7.45531 12.5297C7.26708 12.4116 6.72454 11.9097 5.81661 11.0165C5.11905 10.3263 5.00833 10.1529 5.03416 9.76901C5.07476 9.0936 5.75017 8.61749 6.34439 8.84263C6.58429 8.93121 7.04933 9.30029 7.53651 9.78378C7.77272 10.02 7.90927 10.1159 8.00154 10.1159C8.05691 10.1159 8.22299 9.97201 8.51825 9.66567C9.23057 8.9349 10.4965 7.66527 11.1756 7.00832C11.9507 6.2554 12.054 6.19266 12.4858 6.21849C12.6372 6.22956 12.7848 6.26647 12.8807 6.31445Z"
//     fill="url(#paint0_linear_6400_4920)"
//   />
//   <defs>
//     <linearGradient
//       id="paint0_linear_6400_4920"
//       x1="5.85645"
//       y1="-3.02605e-07"
//       x2="19.3655"
//       y2="0.00767983"
//       gradientUnits="userSpaceOnUse"
//     >
//       <stop stop-color="#B2B2B2" />
//       <stop offset="1" stop-color="white" />
//     </linearGradient>
//   </defs>
// </svg>
//           </div>
//         </div>

//         <div className="relative flex items-end overflow-hidden">
//           {/* Combined Title and Tags Section */}
//           {title.length > 30 || tags.length > 3 ? (
//             <div
//               onClick={toggleExpand}
//               className={`footer_title font-cnFont  transition-all ${
//                 isExpanded ? "max-h-full" : "line-clamp-2"
//               } w-[80%] flex flex-wrap`}
//             >
//               <span className="mr-2">{title}</span>
//               {tags?.map((tag: any, index: number) => (
//                 <span key={index} className="footer_tag mr-2">
//                   #{tag}
//                 </span>
//               ))}
//             </div>
//           ) : (
//             <div
//               className={`footer_title  font-cnFont  transition-all max-h-full w-[80%] flex flex-wrap`}
//             >
//               <span className="mr-2">{title}</span>
//               {tags?.map((tag: any, index: number) => (
//                 <span key={index} className="footer_tag mr-2">
//                   #{tag}
//                 </span>
//               ))}
//             </div>
//           )}

//           {/* More/Less Button Inline */}
//           {(title.length > 30 || tags.length > 3) && (
//             <button
//               className="more_text font-cnFont inline ml-[-3px]"
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

// export default VideoFooter;

// import { setHistoryData } from "@/page/search/slice/HistorySlice";
// import { decryptImage } from "@/utils/imageDecrypt";
// import { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";

// function VideoFooter({
//   title,
//   tags,
//   city,
//   username,
//   badge,
//   id
// }: {
//   title: string;
//   tags: string[];
//   city: string;
//   username: string;
//   badge: string;
//   id: string;
// }) {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const toggleExpand = () => setIsExpanded(!isExpanded);
//   const [decryptedPhoto, setDecryptedPhoto] = useState("");

//   // Calculate title length without spaces
//   const titleLength = title.replace(/\s/g, "").length;
//   const shouldExpand =
//     titleLength > 40 || (tags?.length > 5 && titleLength > 10);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const loadAndDecryptPhoto = async () => {
//       if (!badge) {
//         setDecryptedPhoto("");
//         return;
//       }

//       try {
//         const photoUrl = badge;

//         // If it's not a .txt file, assume it's already a valid URL
//         if (!photoUrl.endsWith(".txt")) {
//           setDecryptedPhoto(photoUrl);
//           return;
//         }
//         const decryptedUrl = await decryptImage(photoUrl);
//         setDecryptedPhoto(decryptedUrl);
//       } catch (error) {
//         console.error("Error loading profile photo:", error);
//         setDecryptedPhoto("");
//       }
//     };

//     loadAndDecryptPhoto();
//   }, [badge]);

//   const onSearch = (suggestion: any) => {
//     if (suggestion.trim()) {
//       dispatch(setHistoryData({ data: suggestion.trim() }));
//       navigate(`/search?query=${encodeURIComponent(suggestion.trim())}`);
//     }
//   };

//   const handleProfile = () => {
//     navigate(`/user/${id}`);
//   };

//   return (
//     <div className="videoFooter w-full">
//       <div className="w-full">
//         <div className="flex items-center gap-3 mb-2">
//           <div className="flex items-center gap-2" onClick={handleProfile}>
//             <span className="footer_head_text font-cnFont">{username}</span>
//             <img src={decryptedPhoto} alt="" className="w-[18px] h-[18px]" />
//           </div>
//         </div>

//         <div className="relative flex items-end overflow-hidden w-full">
//           {/* Combined Title and Tags Section */}
//           {/* {shouldExpand ? (
//             <div
//               onClick={toggleExpand}
//               className={`footer_title font-cnFont transition-all ${
//                 isExpanded ? "max-h-full" : "line-clamp-2"
//               } w-[80%] flex flex-wrap`}
//             >
//               <span className="mr-2">{title}</span>
//               {tags?.map((tag, index) => (
//                 <span key={index} className="footer_tag mr-2">
//                   #{tag}
//                 </span>
//               ))}
//             </div>
//           ) : (
//             <div className="footer_title font-cnFont transition-all max-h-full w-[80%] flex flex-wrap">
//               <span className="mr-2">{title}</span>
//               {tags?.map((tag, index) => (
//                 <span key={index} className="footer_tag mr-2">
//                   #{tag}
//                 </span>
//               ))}
//             </div>
//           )} */}
//           <div
//             onClick={shouldExpand ? toggleExpand : undefined}
//             className={`footer_title font-cnFont transition-all w-[80%] flex flex-wrap ${
//               shouldExpand
//                 ? isExpanded
//                   ? "max-h-full"
//                   : "line-clamp-2"
//                 : "max-h-full"
//             }`}
//           >
//             <span className="mr-2">{title}</span>
//             {tags?.map((tag, index) => (
//               <span
//                 key={index}
//                 className="footer_tag mr-1"
//                 onClick={() => onSearch(tag)}
//               >
//                 #{tag}
//               </span>
//             ))}
//           </div>

//           {/* More/Less Button Inline */}
//           {/* {shouldExpand && (
//             <button
//               className="more_text font-cnFont inline ml-[-3px]"
//               onClick={toggleExpand}
//             >
//               {isExpanded ? "更多" : "收起"}
//             </button>
//           )} */}
//           {shouldExpand && (
//             <button
//               className="more_text font-cnFont inline ml-[0px] text-primary"
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

// export default VideoFooter;

import { setHistoryData } from "@/page/search/slice/HistorySlice";
import { decryptImage } from "@/utils/imageDecrypt";
import useCachedImage from "@/utils/useCachedImage";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const VideoFooter = React.memo(
  ({
    id,
    title,
    tags,
    city,
    username,
    badge,
  }: {
    id: any;
    title: string;
    tags: string[];
    city: string;
    username: string;
    badge: string;
  }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleExpand = () => setIsExpanded(!isExpanded);
    const { hideBar } = useSelector((state: any) => state.hideBarSlice);

    // Ref to store previous badge value
    const prevBadgeRef = useRef<string | null>(null);
    const [decryptedPhoto, setDecryptedPhoto] = useState<string | null>(null);

    // const { imgSrc, isLoading: imageLoading } = useCachedImage(
    //   decryptedPhoto || ""
    // );

    // Calculate title length without spaces
    const titleLength = title.replace(/\s/g, "").length;
    const shouldExpand =
      titleLength > 40 || (tags?.length > 5 && titleLength > 10);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
      // Only decrypt the image if the badge has changed

      if (badge !== prevBadgeRef.current) {
        const loadAndDecryptPhoto = async () => {
          if (!badge) {
            setDecryptedPhoto(null);
            return;
          }

          try {
            const photoUrl = badge;

            // If it's not a .txt file, assume it's already a valid URL
            if (!photoUrl.endsWith(".txt")) {
              setDecryptedPhoto(photoUrl);
              return;
            }

            // Decrypt the image if it's a .txt file
            const decryptedUrl = await decryptImage(photoUrl);
            setDecryptedPhoto(decryptedUrl);
          } catch (error) {
            console.error("Error loading profile photo:", error);
            setDecryptedPhoto(null);
          }
        };

        loadAndDecryptPhoto();
        prevBadgeRef.current = badge; // Update the ref with the new badge
      }
    }, []); // Run only when the badge prop changes

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
        className="videoFooter w-full"
        style={{ display: hideBar ? "none" : "block" }}
      >
        <div className="w-full">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-2" onClick={handleProfile}>
              <span className="footer_head_text font-cnFont">{username}</span>

              {decryptedPhoto && (
                <img
                  src={decryptedPhoto || ""}
                  alt="profile"
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
              {" "}
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
              {/* <span className="mr-2">{title}</span>
              {tags?.map((tag, index) => (
                <span
                  key={index}
                  className="footer_tag mr-1"
                  onClick={() => onSearch(tag)}
                >
                  #{tag}
                </span>
              ))} */}
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
);

export default VideoFooter;
