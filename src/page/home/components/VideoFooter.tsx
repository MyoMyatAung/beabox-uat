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
//     <div className="videoFooter mt-[-70px]">
//       <div className="videoFooter__text">
//         <div className="flex gap-2 items-center mb-4">
//           {tags?.map((tag: any) => (
//             <span className="footer_tag">#{tag}</span>
//           ))}
//         </div>
//         <div className="flex items-center gap-3 mb-2">
//           {/* <div className="flex items-center gap-2">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="11"
//               height="15"
//               viewBox="0 0 11 15"
//               fill="none"
//             >
//               <path
//                 d="M5.50006 0.5C4.04186 0.501654 2.64386 1.08165 1.61276 2.11276C0.581654 3.14386 0.00165422 4.54186 0 6.00006C0 10.7064 5.00005 14.2608 5.21318 14.4095C5.29725 14.4684 5.39741 14.5 5.50006 14.5C5.6027 14.5 5.70286 14.4684 5.78693 14.4095C6.00006 14.2608 11.0001 10.7064 11.0001 6.00006C10.9985 4.54186 10.4185 3.14386 9.38735 2.11276C8.35625 1.08165 6.95825 0.501654 5.50006 0.5ZM5.50006 4.00004C5.89562 4.00004 6.2823 4.11733 6.61121 4.3371C6.94011 4.55686 7.19646 4.86922 7.34783 5.23468C7.49921 5.60014 7.53882 6.00227 7.46165 6.39024C7.38447 6.77821 7.19399 7.13457 6.91428 7.41428C6.63457 7.69399 6.27821 7.88447 5.89024 7.96165C5.50227 8.03882 5.10014 7.99921 4.73468 7.84783C4.36922 7.69646 4.05686 7.44011 3.8371 7.11121C3.61733 6.7823 3.50004 6.39562 3.50004 6.00006C3.50004 5.46962 3.71075 4.9609 4.08583 4.58583C4.4609 4.21075 4.96962 4.00004 5.50006 4.00004Z"
//                 fill="#00B36B"
//               />
//             </svg>
//             <span className="footer_head_text"> {city ? city : "Tokyo"}</span>
//           </div> */}
//           <div className="flex items-center gap-2">
//             <span className="footer_head_text">{username}</span>
// <svg
//   xmlns="http://www.w3.org/2000/svg"
//   width="18"
//   height="19"
//   viewBox="0 0 18 19"
//   fill="none"
// >
//   <circle
//     cx="9"
//     cy="9.5"
//     r="9"
//     fill="url(#paint0_linear_3792_3390)"
//   />
//   <path
//     d="M13.2002 6.3999L7.7002 11.8999L5.2002 9.3999"
//     stroke="white"
//     stroke-width="1.5"
//     stroke-linecap="round"
//     stroke-linejoin="round"
//   />
//   <defs>
//     <linearGradient
//       id="paint0_linear_3792_3390"
//       x1="8.59091"
//       y1="11.75"
//       x2="0.390618"
//       y2="0.222136"
//       gradientUnits="userSpaceOnUse"
//     >
//       <stop stop-color="#CD3EFF" />
//       <stop offset="1" stop-color="#FFB2E0" />
//     </linearGradient>
//   </defs>
// </svg>
//           </div>
//         </div>

//         <div className="content-card relative h-[150px] flex overflow-hidden">
//           {/* Combined Title and Tags Section */}
//           <div
//             className={`footer_content transition-all ${
//               isExpanded ? "max-h-full" : "line-clamp-2 h-[60px]"
//             } w-[80%] flex flex-wrap`}
//           >
//             <span className="mr-2">{title}</span>
//             {tags?.map((tag: any, index: number) => (
//               <span key={index} className="footer_tag mr-2">
//                 #{tag}
//               </span>
//             ))}
//           </div>
//           {/* More/Less Button Inline */}
//           {(title.length > 50 || tags.length > 3) && (
//             <button
//               className="text-blue-500 inline ml-2"
//               onClick={toggleExpand}
//             >
//               {isExpanded ? "less" : "more"}
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default VideoFooter;

// {
//   /* <div className="">
//           <div className="footer_title mb-5 line-clamp-2 w-[80%]">
//             <span>
//               {" "}
//               {title && "sseajahdhadhahdhadhahdh hadhahdha ahhahhca ahhahhca"}
//             </span>
//             <div className="flex">
//               {tags?.map((tag: any) => (
//                 <span className="footer_tag">#{tag}</span>
//               ))}
//             </div>
//           </div>
//         </div> */
// }
// {
//   /* <div className="content-card">
//           <div
//             className={`footer_content h-[100px] ${
//               isExpanded ? "line-clamp-none" : "line-clamp-2"
//             } w-[80%] flex flex-wrap`}
//           >
//             <span className="mr-2">{title}</span>
//             {tags?.map((tag: any, index: number) => (
//               <span key={index} className="footer_tag mr-2">
//                 #{tag}
//               </span>
//             ))}
//           </div>

//           {(title.length > 50 || tags.length > 3) && (
//             <button className="text-blue-500 inline" onClick={toggleExpand}>
//               {isExpanded ? "less" : "more"}
//             </button>
//           )}
//         </div> */
// }

function VideoFooter({
  title,
  tags,
  city,
  username,
}: {
  title: any;
  tags: any;
  city: any;
  username: any;
}) {
  return (
    <div className="videoFooter mt-[-70px]">
      <div className="videoFooter__text">
        <div className="flex gap-2 items-center mb-4">
          {tags?.map((tag: any) => (
            <span className="footer_tag">#{tag}</span>
          ))}
        </div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="footer_head_text">{username}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="19"
              viewBox="0 0 18 19"
              fill="none"
            >
              <circle
                cx="9"
                cy="9.5"
                r="9"
                fill="url(#paint0_linear_3792_3390)"
              />
              <path
                d="M13.2002 6.3999L7.7002 11.8999L5.2002 9.3999"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_3792_3390"
                  x1="8.59091"
                  y1="11.75"
                  x2="0.390618"
                  y2="0.222136"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#CD3EFF" />
                  <stop offset="1" stop-color="#FFB2E0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <div className="">
          <p className="footer_title mb-5 line-clamp-2 w-[80%]">
            {title && title}
          </p>
        </div>
      </div>
    </div>
  );
}

export default VideoFooter;
