// import React, { useEffect, useRef, useState } from "react";

// import uiLeft from "../../../assets/explore/uiLeftt.svg";
// import { CiHeart } from "react-icons/ci";
// import "../explore.css";
// import { useNavigate } from "react-router-dom";
// import personE from "../../../assets/explore/personE.svg";
// import {
//   useGetExploreListQuery,
//   useGetExploreTagQuery,
// } from "@/store/api/explore/exploreApi";
// import { Person } from "@/assets/profile";
// import { useDispatch } from "react-redux";
// import { setDetails, setTag, setTitle } from "@/store/slices/exploreSlice";
// import { paths } from "@/routes/paths";
// import ImageWithPlaceholder from "@/page/explore/comp/imgPlaceHolder";
// import { FaHeart } from "react-icons/fa";
// import empty from "../../../page/home/empty.png";
// import VideoFeed from "@/page/home/components/VideoFeed";
// import Artplayer from "artplayer";
// import LoadingAnimation from "@/page/search/comp/LoadingAnimation";
// import Hls from "hls.js";

// interface RecommandProps {
//   title: string;
//   list_id: string;
//   // setshow : any
//   selectedList: any;
//   setSelectedList: any;
//   setShowVideoFeedTopic: any;
//   // selectedMovieId: any;
//   setSelectedMovieId: any;
// }

// const Recommand: React.FC<RecommandProps> = ({
//   title,
//   list_id,
//   selectedList,
//   setSelectedList,
//   setShowVideoFeedTopic,
//   // selectedMovieId,
//   setSelectedMovieId,
// }) => {
//   // const [selectedMovieId, setSelectedMovieId] = useState(null);
//   const [showVideoFeed, setShowVideoFeed] = useState(false);
//   const dispatch = useDispatch();
//   const [list, setList] = useState([]);
//   // const [selectedList, setSelectedList] = useState<any[]>([]);
//   const [imgError, setImgError] = useState(false);
//   const { data, isLoading, refetch } = useGetExploreListQuery({
//     id: list_id,
//   });

//   // Video player states
//   const [activeLongPressCard, setActiveLongPressCard] = useState<any>(null);
//   const [playingVideos, setPlayingVideos] = useState<{
//     [key: string]: boolean;
//   }>({});
//   const [loadingVideoId, setLoadingVideoId] = useState<string | null>(null);

//   const videoPlayerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
//   const artPlayerInstances = useRef<{ [key: string]: Artplayer | null }>({});
//   const longPressTimer = useRef<NodeJS.Timeout | null>(null);
//   const loadingTimerRef = useRef<NodeJS.Timeout>();

//   useEffect(() => {
//     if (data?.data) {
//       setList(data?.data);
//     }
//   }, [data, list]);
//   // console.log(" this is mf", list);
//   const navigate = useNavigate();
//   const [refresh, setRefresh] = useState<boolean>(false);
//   const refreshCard = async () => {
//     setRefresh(true); // Show loading animation
//     await refetch(); // Refetch data
//     setRefresh(false); // Hide loading animation after refetch
//   };

//   const showMore = (tt: any) => {
//     const title = tt?.navigation[0].tag;
//     dispatch(setTitle(title));
//     dispatch(setTag(tt.title));
//     navigate(paths.recommand_more, { state: { tt } });
//   };

//   function formatDuration(duration: any) {
//     const hours = Math.floor(duration / 3600); // Get the hours
//     const minutes = Math.floor((duration % 3600) / 60); // Get the remaining minutes
//     const seconds = duration % 60; // Get the remaining seconds

//     // Ensure all values are padded to 2 digits
//     const formattedMinutes = minutes.toString().padStart(2, "0");
//     const formattedSeconds = seconds.toString().padStart(2, "0");

//     if (hours > 0) {
//       const formattedHours = hours.toString().padStart(2, "0");
//       return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
//     } else {
//       return `${formattedMinutes}:${formattedSeconds}`;
//     }
//   }

//   const calculateHeight = (width: number, height: number) => {
//     // console.log(width,height)
//     if (width > height) {
//       return 112; // Portrait
//     }
//     if (width < height) {
//       return 240; // Landscape
//     }
//     return 200;
//   };

//   const formatNumber = (num: number) => {
//     if (num >= 1000) {
//       return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}k`;
//     }
//     return num;
//   };

//   const navigateToUserProfile = (userId: string, event: React.MouseEvent) => {
//     event.stopPropagation(); // Prevent triggering the parent click event
//     navigate(paths.getUserProfileId(userId));
//   };

//   // console.log(list);

//   const showDetailsVod = (file: any, id: any) => {
//     // dispatch(setDetails(file));
//     // navigate(paths.vod_details);
//     // console.log(id);
//     setSelectedList(file);
//     setSelectedMovieId(id);
//     setShowVideoFeedTopic(true);
//     // setShowVideoFeed(true);
//   };

//   const handleLongPress = (card: any) => {
//     if (playingVideos[card.post_id]) return;
//     if (!card?.preview?.url) return;

//     // Pause any currently playing video
//     if (activeLongPressCard) {
//       const currentPlayer =
//         artPlayerInstances.current[activeLongPressCard?.post_id];
//       if (currentPlayer) {
//         currentPlayer.muted = true;
//         currentPlayer.pause();
//         setPlayingVideos((prev) => ({
//           ...prev,
//           [activeLongPressCard.post_id]: false,
//         }));
//       }
//     }

//     if (card?.preview?.url) {
//       initializePlayer(card);
//     }
//     setLoadingVideoId(card.post_id);
//     setActiveLongPressCard(card);
//   };

//   console.log(list);

//   const initializePlayer = (card: any) => {
//     const container = videoPlayerRefs.current[card.post_id];
//     if (!container) return;

//     // Destroy previous instance if exists
//     if (artPlayerInstances.current[card.post_id]) {
//       artPlayerInstances.current[card.post_id]?.destroy();
//     }

//     console.log(card);

//     const isM3u8 = card?.preview?.url?.includes(".m3u8");

//     const options: Artplayer["Option"] = {
//       container: container,
//       url: card.preview.url,
//       muted: true,
//       autoplay: true,
//       loop: true,
//       isLive: false,
//       aspectRatio: true,
//       fullscreen: false,
//       theme: "#d53ff0",
//       moreVideoAttr: {
//         playsInline: true,
//         preload: "auto" as const,
//       },
//       type: isM3u8 ? "m3u8" : "auto",
//       customType: {
//         m3u8: (videoElement: HTMLVideoElement, url: string) => {
//           if (Hls.isSupported()) {
//             const hls = new Hls();
//             hls.loadSource(url);
//             hls.attachMedia(videoElement);
//           } else if (
//             videoElement.canPlayType("application/vnd.apple.mpegurl")
//           ) {
//             videoElement.src = url;
//           }
//         },
//       },
//       icons: {
//         loading: `<div style="display:none"></div>`,
//         state: `<div style="display:none"></div>`,
//       },
//     };

//     try {
//       const player = new Artplayer(options);
//       artPlayerInstances.current[card.post_id] = player;

//       player.on("ready", () => {
//         console.log("Player is ready");
//         player.play();
//         setPlayingVideos((prev) => ({ ...prev, [card.post_id]: true }));
//         setLoadingVideoId(null);
//       });

//       player.on("play", () => {
//         console.log("Player is play");
//         setPlayingVideos((prev) => ({ ...prev, [card.post_id]: true }));
//         setLoadingVideoId(null);
//       });

//       player.on("pause", () => {
//         setPlayingVideos((prev) => ({ ...prev, [card.post_id]: false }));
//       });

//       player.on("video:playing", () => {
//         console.log("Player is playing");
//         setPlayingVideos((prev) => ({ ...prev, [card.post_id]: true }));
//         setLoadingVideoId(null);
//       });

//       player.on("video:waiting", () => {
//         setLoadingVideoId(card.post_id);
//       });

//       player.on("error", () => {
//         setPlayingVideos((prev) => ({ ...prev, [card.post_id]: false }));
//         setLoadingVideoId(null);
//       });
//     } catch (error) {
//       setPlayingVideos((prev) => ({ ...prev, [card.post_id]: false }));
//       console.error("Error initializing ArtPlayer:", error);
//       setLoadingVideoId(null);
//     }
//   };

//   const handleTouchStart = (card: any) => {
//     if (playingVideos[card.post_id]) return;

//     longPressTimer.current = setTimeout(() => {
//       handleLongPress(card);
//     }, 500); // 500ms threshold for long press
//   };

//   console.log("lisr", list);

//   // useEffect(() => {
//   //   if (ll.posts.length > 0 && ll.posts.length <= 10) {
//   //     const firstVideo = ll.posts[0];
//   //     if (firstVideo?.preview?.url) {
//   //       console.log("Initializing player for first video");
//   //       // Small timeout to ensure DOM is ready
//   //       setTimeout(() => {
//   //         handleLongPress(firstVideo);
//   //       }, 300);
//   //     }
//   //   }
//   // }, [ll.posts]);

//   // Clean up all players when component unmounts
//   useEffect(() => {
//     return () => {
//       Object.values(artPlayerInstances.current).forEach((player) => {
//         player?.destroy();
//       });
//       artPlayerInstances.current = {};

//       if (longPressTimer.current) {
//         clearTimeout(longPressTimer.current);
//       }

//       if (loadingTimerRef.current) {
//         clearTimeout(loadingTimerRef.current);
//       }
//     };
//   }, []);

//   return (
//     <>
//       {/* {showVideoFeed && selectedMovieId && (
//         <div className="fixed inset-0 z-[99999909090909] bg-black">
//           <VideoFeed
//             setVideos={setSelectedList}
//             videos={selectedList}
//             currentActiveId={selectedMovieId}
//             setShowVideoFeed={setShowVideoFeed}
//             query={"搜索影片"}
//           />
//         </div>
//       )} */}
//       <div className=" pb-[20px] px-[10px]">
//         {isLoading ? (
//           <div className=" flex flex-col w-full">
//             <div className="py-[12px]">
//               <div className=" w-full h-[20px] rounded-lg shadow-lg bg-white/20 animate-pulse mb-4"></div>
//             </div>
//             <div className=" w-full grid grid-cols-2 justify-center items-center  gap-[12px]">
//               <div className="rounded-lg shadow-lg bg-white/20 animate-pulse mb-4 max-w-full h-[312px]"></div>
//               <div className="rounded-lg shadow-lg bg-white/20 animate-pulse mb-4 max-w-full h-[312px]"></div>
//               <div className="rounded-lg shadow-lg bg-white/20 animate-pulse mb-4 max-w-full h-[312px]"></div>
//               <div className="rounded-lg shadow-lg bg-white/20 animate-pulse mb-4 max-w-full h-[312px]"></div>
//             </div>
//           </div>
//         ) : (
//           <>
//             {list?.map((ll: any, index) => (
//               <div key={index} className="flex flex-col w-full items-center">
//                 {/* header */}
//                 {ll.posts.length !== 0 && (
//                   <div className=" flex w-full justify-between items-center py-[12px] px-[10p]">
//                     <h1 className=" text-white text-[16px] font-[500] leading-[20px]">
//                       {ll.title}
//                     </h1>
//                     <div
//                       // onClick={() => navigate(paths.recommand_more, { state: { title } })}
//                       onClick={() => showMore(ll)}
//                       className="rec_exp_more_btn"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="21\5"
//                         height="25"
//                         viewBox="0 0 21 20"
//                         fill="none"
//                       >
//                         <path
//                           opacity="0.64"
//                           d="M11.9365 10.0001L7.81152 5.87511L8.98986 4.69678L14.2932 10.0001L8.98986 15.3034L7.81152 14.1251L11.9365 10.0001Z"
//                           fill="url(#paint0_linear_3794_4838)"
//                         />
//                         <defs>
//                           <linearGradient
//                             id="paint0_linear_3794_4838"
//                             x1="7.81152"
//                             y1="15.3034"
//                             x2="13.2174"
//                             y2="15.2829"
//                             gradientUnits="userSpaceOnUse"
//                           >
//                             <stop stop-color="#E8B9FF" />
//                             <stop offset="1" stop-color="#FF94B4" />
//                           </linearGradient>
//                         </defs>
//                       </svg>
//                     </div>
//                   </div>
//                 )}
//                 {/* content */}
//                 {ll.posts.length !== 0 ? (
//                   <div className=" py-[12px] w-full grid grid-cols-2 justify-center items-center  gap-[10px]">
//                     <>
//                       {ll.posts.map((card: any) => (
//                         <div
//                           key={card.post_id}
//                           className="max-w-full pb-[12px chinese_photo h-[320px]"
//                         >
//                           <div className="w-full h-[2px] relative">
//                             <LoadingAnimation
//                               loadingVideoId={loadingVideoId}
//                               postId={card?.post_id}
//                             />
//                           </div>

//                           <div
//                             onTouchStart={() => handleTouchStart(card)}
//                             onClick={() =>
//                               showDetailsVod(ll.posts, card.post_id)
//                             }
//                             className=" relative flex justify-center items-center bg-[#010101] rounded-t-[4px] overflow-hidden  h-[240px]"
//                           >
//                             {/* Video Player */}
//                             <div
//                               ref={(el) =>
//                                 (videoPlayerRefs.current[card.post_id] = el)
//                               }
//                               className="w-full h-full object-cover rounded-none"
//                               style={{
//                                 position: "absolute",
//                                 top: 0,
//                                 left: 0,
//                                 zIndex: 1,
//                                 backgroundColor: "#000",
//                                 opacity:
//                                   activeLongPressCard?.post_id ===
//                                     card.post_id &&
//                                   loadingVideoId !== card.post_id
//                                     ? 1
//                                     : 0,
//                                 transition: "opacity 1s ease",
//                                 pointerEvents: "none",
//                               }}
//                             />

//                             {/* Image */}
//                             <ImageWithPlaceholder
//                               src={card?.preview_image}
//                               alt={card.title || "Video"}
//                               width={"100%"}
//                               height={calculateHeight(
//                                 card?.files[0]?.width,
//                                 card?.files[0]?.height
//                               )}
//                               className="object-cover h-full w-full rounded-none"
//                               style={{
//                                 opacity:
//                                   activeLongPressCard?.post_id ===
//                                     card.post_id &&
//                                   loadingVideoId !== card.post_id
//                                     ? 0
//                                     : 1,
//                                 transition: "opacity 1s ease",
//                               }}
//                             />
//                             {/* <ImageWithPlaceholder
//                               src={card?.preview_image}
//                               alt={card.title || "Video"}
//                               width={"100%"}
//                               // height={240}
//                               height={
//                                 card?.files[0]?.height &&
//                                 calculateHeight(
//                                   card?.files[0]?.width,
//                                   card?.files[0]?.height
//                                 )
//                               }
//                               className=" object-cover h-full w-full rounded-none"
//                             /> */}

//                             <div className=" absolute hidden left-0 mx-auto right-0 bottom-0 fle justify-around items-center w-full max-w-[175px] bg-blac">
//                               <div className=" flex w-full  justify-between px-2">
//                                 <span className=" text-white text-[11px]  left-">
//                                   {card?.view_count} 次观看
//                                 </span>
//                                 <span className=" text-white text-[11px]  right-0">
//                                   {formatDuration(card?.files[0].duration)}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
//                           {/* <h1 className="text-white w-full text-[14px] font-[400] px-[6px] pt-[6px] leading-[20px] break-words"> */}
//                           <h1 className="search_text font-cnFont line-clamp-2 text-left text-[14px] font-[400] px-[6px] pt-[6px]">
//                             {card.title.length > 50
//                               ? `${card.title.slice(0, 50)}...`
//                               : card.title}
//                           </h1>
//                           <div className=" flex w-full p-[6px] justify-between">
//                             <div className=" flex justify-cente  items-center gap-[4px]">
//                               {card.user.avatar ? (
//                                 <img
//                                   // onError={() => console.log("gg")}
//                                   className=" w-[20px] h-[20px] rounded-full"
//                                   src={card.user.avatar}
//                                   onError={(e) =>
//                                     (e.currentTarget.src = personE)
//                                   }
//                                   alt=""
//                                 />
//                               ) : (
//                                 <img
//                                   src={personE}
//                                   className=" w-[20px] h-[20px] rounded-full"
//                                   alt=""
//                                 />
//                               )}
//                               <h1
//                                 className=" text-[#888] text-[14px] font-[400] leading-[20px] cursor-pointer hover:text-white"
//                                 onClick={(e) =>
//                                   navigateToUserProfile(card.user.id, e)
//                                 }
//                               >
//                                 {card.user.name}
//                                 {/* {card?.files[0]?.width} & {card?.files[0]?.height} {} */}
//                               </h1>
//                             </div>
//                             <div className=" flex justify-center items-center gap-[4px]">
//                               <svg
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 width="13"
//                                 height="12"
//                                 viewBox="0 0 13 12"
//                                 fill="none"
//                               >
//                                 <path
//                                   d="M8.56675 1.13281C7.53401 1.13281 6.6298 1.57692 6.06616 2.32759C5.50253 1.57692 4.59832 1.13281 3.56557 1.13281C2.74349 1.13374 1.95535 1.46072 1.37405 2.04202C0.792751 2.62332 0.46577 3.41146 0.464844 4.23354C0.464844 7.73437 5.65557 10.568 5.87662 10.6851C5.93488 10.7164 6.00001 10.7328 6.06616 10.7328C6.13232 10.7328 6.19745 10.7164 6.25571 10.6851C6.47676 10.568 11.6675 7.73437 11.6675 4.23354C11.6666 3.41146 11.3396 2.62332 10.7583 2.04202C10.177 1.46072 9.38883 1.13374 8.56675 1.13281Z"
//                                   stroke="#BBBBBB"
//                                   stroke-width="0.8"
//                                 />
//                               </svg>
//                               {/* <FaHeart /> */}
//                               <h1 className=" text-[#888] text-[14px] font-[400] leading-[20px]">
//                                 {formatNumber(card?.like_count)}
//                               </h1>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </>
//                   </div>
//                 ) : (
//                   <div className=" mt-[20px]">
//                     <div
//                       className={`flex justify-center items-center py-[60px]`}
//                     >
//                       <div className="flex flex-col items-center">
//                         <img src={empty} className="w-[80px]" alt="" />
//                         <h1 className="text-center text-white/60">
//                           暂无视频内容
//                         </h1>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </>
//         )}
//       </div>
//     </>
//   );
// };

// export default Recommand;

import React, { useEffect, useState, useRef } from "react";
import uiLeft from "../../../assets/explore/uiLeftt.svg";
import { CiHeart } from "react-icons/ci";
import "../explore.css";
import { useNavigate } from "react-router-dom";
import personE from "../../../assets/explore/personE.svg";
import {
  useGetExploreListQuery,
  useGetExploreTagQuery,
} from "@/store/api/explore/exploreApi";
import { Person } from "@/assets/profile";
import { useDispatch } from "react-redux";
import { setDetails, setTag, setTitle } from "@/store/slices/exploreSlice";
import { paths } from "@/routes/paths";
import ImageWithPlaceholder from "@/page/explore/comp/imgPlaceHolder";
import { FaHeart } from "react-icons/fa";
import empty from "../../../page/home/empty.png";
import VideoFeed from "@/page/home/components/VideoFeed";
import Artplayer from "artplayer";
import Hls from "hls.js";
import LoadingAnimation from "../../../page/search/comp/LoadingAnimation";
import { c } from "node_modules/framer-motion/dist/types.d-6pKw1mTI";

interface RecommandProps {
  title: string;
  list_id: string;
  selectedList: any;
  setSelectedList: any;
  setShowVideoFeedTopic: any;
  setSelectedMovieId: any;
}

const Recommand: React.FC<RecommandProps> = ({
  title,
  list_id,
  selectedList,
  setSelectedList,
  setShowVideoFeedTopic,
  setSelectedMovieId,
}) => {
  const [showVideoFeed, setShowVideoFeed] = useState(false);
  const dispatch = useDispatch();
  const [list, setList] = useState([]);
  const [imgError, setImgError] = useState(false);
  const { data, isLoading, refetch } = useGetExploreListQuery({
    id: list_id,
  });

  // Video player states
  const [activeLongPressCard, setActiveLongPressCard] = useState<any>(null);
  const [playingVideos, setPlayingVideos] = useState<{
    [key: string]: boolean;
  }>({});
  const [loadingVideoId, setLoadingVideoId] = useState<string | null>(null);

  const videoPlayerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const artPlayerInstances = useRef<{ [key: string]: Artplayer | null }>({});
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const loadingTimerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (data?.data) {
      setList(data?.data);
    }
  }, [data, list]);

  const navigate = useNavigate();
  const [refresh, setRefresh] = useState<boolean>(false);

  const refreshCard = async () => {
    setRefresh(true);
    await refetch();
    setRefresh(false);
  };

  const showMore = (tt: any) => {
    const title = tt?.navigation[0].tag;
    dispatch(setTitle(title));
    dispatch(setTag(tt.title));
    navigate(paths.recommand_more, { state: { tt } });
  };

  function formatDuration(duration: any) {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;

    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    if (hours > 0) {
      const formattedHours = hours.toString().padStart(2, "0");
      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    } else {
      return `${formattedMinutes}:${formattedSeconds}`;
    }
  }

  const calculateHeight = (width: number, height: number) => {
    if (width > height) {
      return 112; // Portrait
    }
    if (width < height) {
      return 240; // Landscape
    }
    return 200;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}k`;
    }
    return num;
  };

  const navigateToUserProfile = (userId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(paths.getUserProfileId(userId));
  };

  const showDetailsVod = (file: any, id: any) => {
    setSelectedList(file);
    setSelectedMovieId(id);
    setShowVideoFeedTopic(true);
  };

  const handleLongPress = (card: any, title: any) => {
    if (playingVideos[card.post_id + title]) return;
    if (!card?.preview?.url) return;

    // Pause any currently playing video
    if (activeLongPressCard) {
      const currentPlayer =
        artPlayerInstances.current[activeLongPressCard?.post_id + title];
      if (currentPlayer) {
        currentPlayer.muted = true;
        currentPlayer.pause();
        setPlayingVideos((prev) => ({
          ...prev,
          [activeLongPressCard.post_id + title]: false,
        }));
      }
    }

    if (card?.preview?.url) {
      initializePlayer(card, title);
    }
    setLoadingVideoId(card.post_id + title);
    setActiveLongPressCard(card);
  };

  const initializePlayer = (card: any, title: any) => {
    const container = videoPlayerRefs.current[card.post_id + title];
    if (!container) return;

    // Destroy previous instance if exists
    if (artPlayerInstances.current[card.post_id + title]) {
      artPlayerInstances.current[card.post_id + title]?.destroy();
    }

    const isM3u8 = card?.preview?.url?.includes(".m3u8");

    const options: Artplayer["Option"] = {
      container: container,
      url: card.preview.url,
      muted: true,
      autoplay: true,
      loop: true,
      isLive: false,
      aspectRatio: true,
      fullscreen: false,
      theme: "#d53ff0",
      moreVideoAttr: {
        playsInline: true,
        preload: "auto" as const,
      },
      type: isM3u8 ? "m3u8" : "auto",
      customType: {
        m3u8: (videoElement: HTMLVideoElement, url: string) => {
          if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(videoElement);
          } else if (
            videoElement.canPlayType("application/vnd.apple.mpegurl")
          ) {
            videoElement.src = url;
          }
        },
      },
      icons: {
        loading: `<div style="display:none"></div>`,
        state: `<div style="display:none"></div>`,
      },
    };

    try {
      const player = new Artplayer(options);
      artPlayerInstances.current[card.post_id + title] = player;

      player.on("ready", () => {
        player
          .play()
          .then(() => {
            console.log("Playback started successfully");
          })
          .catch((error) => {
            console.error("Playback failed:", error);
          });
        setPlayingVideos((prev) => ({ ...prev, [card.post_id + title]: true }));
        setLoadingVideoId(null);
      });

      player.on("play", () => {
        setPlayingVideos((prev) => ({ ...prev, [card.post_id + title]: true }));
        setLoadingVideoId(null);
      });

      player.on("pause", () => {
        setPlayingVideos((prev) => ({
          ...prev,
          [card.post_id + title]: false,
        }));
      });

      player.on("video:playing", () => {
        setPlayingVideos((prev) => ({ ...prev, [card.post_id + title]: true }));
        setLoadingVideoId(null);
      });

      player.on("video:waiting", () => {
        setLoadingVideoId(card.post_id + title);
      });

      player.on("error", () => {
        setPlayingVideos((prev) => ({
          ...prev,
          [card.post_id + title]: false,
        }));
        setLoadingVideoId(null);
      });
    } catch (error) {
      setPlayingVideos((prev) => ({ ...prev, [card.post_id + title]: false }));
      console.error("Error initializing ArtPlayer:", error);
      setLoadingVideoId(null);
    }
  };

  const handleTouchStart = (card: any, title: any) => {
    if (loadingVideoId === card.post_id + title) return;
    if (playingVideos[card.post_id]) return;

    longPressTimer.current = setTimeout(() => {
      handleLongPress(card, title);
    }, 500); // 500ms threshold for long press
  };

  useEffect(() => {
    return () => {
      Object.values(artPlayerInstances.current).forEach((player) => {
        player?.destroy();
      });
      artPlayerInstances.current = {};

      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }

      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
    };
  }, []);

  return (
    <>
      <div className=" pb-[20px] px-[10px]">
        {isLoading ? (
          <div className=" flex flex-col w-full">
            <div className="py-[12px]">
              <div className=" w-full h-[20px] rounded-lg shadow-lg bg-white/20 animate-pulse mb-4"></div>
            </div>
            <div className=" w-full grid grid-cols-2 justify-center items-center  gap-[12px]">
              <div className="rounded-lg shadow-lg bg-white/20 animate-pulse mb-4 max-w-full h-[312px]"></div>
              <div className="rounded-lg shadow-lg bg-white/20 animate-pulse mb-4 max-w-full h-[312px]"></div>
              <div className="rounded-lg shadow-lg bg-white/20 animate-pulse mb-4 max-w-full h-[312px]"></div>
              <div className="rounded-lg shadow-lg bg-white/20 animate-pulse mb-4 max-w-full h-[312px]"></div>
            </div>
          </div>
        ) : (
          <>
            {list?.map((ll: any, index) => (
              <div key={index} className="flex flex-col w-full items-center">
                {/* header */}
                {ll.posts.length !== 0 && (
                  <div className=" flex w-full justify-between items-center py-[12px] px-[10p]">
                    <h1 className=" text-white text-[16px] font-[500] leading-[20px]">
                      {ll.title}
                    </h1>
                    <div
                      onClick={() => showMore(ll)}
                      className="rec_exp_more_btn"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="21\5"
                        height="25"
                        viewBox="0 0 21 20"
                        fill="none"
                      >
                        <path
                          opacity="0.64"
                          d="M11.9365 10.0001L7.81152 5.87511L8.98986 4.69678L14.2932 10.0001L8.98986 15.3034L7.81152 14.1251L11.9365 10.0001Z"
                          fill="url(#paint0_linear_3794_4838)"
                        />
                        <defs>
                          <linearGradient
                            id="paint0_linear_3794_4838"
                            x1="7.81152"
                            y1="15.3034"
                            x2="13.2174"
                            y2="15.2829"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stop-color="#E8B9FF" />
                            <stop offset="1" stop-color="#FF94B4" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                )}
                {/* content */}
                {ll.posts.length !== 0 ? (
                  <div className=" py-[12px] w-full grid grid-cols-2 justify-center items-center  gap-[10px]">
                    <>
                      {ll.posts.map((card: any) => (
                        <div
                          key={card.post_id}
                          className="max-w-full pb-[12px] chinese_photo h-[325px]"
                        >
                          <div className="w-full h-[2px] relative">
                            <LoadingAnimation
                              loadingVideoId={loadingVideoId}
                              postId={card?.post_id + ll.title}
                            />
                          </div>

                          <div
                            onClick={() =>
                              showDetailsVod(ll.posts, card.post_id)
                            }
                            onTouchStart={() =>
                              handleTouchStart(card, ll.title)
                            }
                            className=" relative flex justify-center items-center bg-[#010101] rounded-[4px] overflow-hidden h-[240px]"
                          >
                            {/* Video Player */}
                            <div
                              ref={(el) =>
                                (videoPlayerRefs.current[
                                  card.post_id + ll.title
                                ] = el)
                              }
                              className="w-full h-full object-cover rounded-none"
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                zIndex: 1,
                                backgroundColor: "#000",
                                opacity:
                                  activeLongPressCard?.post_id + ll?.title ===
                                    card.post_id + ll?.title &&
                                  loadingVideoId !== card.post_id + ll?.title
                                    ? 1
                                    : 0,
                                transition: "opacity 1s ease",
                                pointerEvents: "none",
                              }}
                            />

                            <ImageWithPlaceholder
                              src={card?.preview_image}
                              alt={card.title || "Video"}
                              className=" object-cover h-full w-full rounded-none"
                              style={{
                                opacity:
                                  activeLongPressCard?.post_id + ll?.title ===
                                    card.post_id + ll?.title &&
                                  loadingVideoId !== card.post_id + ll?.title
                                    ? 0
                                    : 1,
                                transition: "opacity 1s ease",
                              }}
                            />

                            <div className=" absolute hidden left-0 mx-auto right-0 bottom-0 fle justify-around items-center w-full max-w-[175px] bg-blac">
                              <div className=" flex w-full  justify-between px-2">
                                <span className=" text-white text-[11px]  left-">
                                  {card?.view_count} 次观看
                                </span>
                                <span className=" text-white text-[11px]  right-0">
                                  {formatDuration(card?.files[0].duration)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <h1 className="search_text font-cnFont line-clamp-2 text-left text-[14px] font-[400] px-[6px] pt-[6px]">
                            {card.title}
                          </h1>

                          <div className=" flex w-full p-[6px] justify-between">
                            <div className=" flex justify-cente  items-center gap-[4px]">
                              {card.user.avatar ? (
                                <img
                                  className=" w-[20px] h-[20px] rounded-full"
                                  src={card.user.avatar}
                                  onError={(e) =>
                                    (e.currentTarget.src = personE)
                                  }
                                  alt=""
                                />
                              ) : (
                                <img
                                  src={personE}
                                  className=" w-[20px] h-[20px] rounded-full"
                                  alt=""
                                />
                              )}
                              <h1
                                className=" text-[#888] text-[14px] font-[400] leading-[20px] cursor-pointer hover:text-white"
                                onClick={(e) =>
                                  navigateToUserProfile(card.user.id, e)
                                }
                              >
                                {card.user.name}
                              </h1>
                            </div>
                            <div className=" flex justify-center items-center gap-[4px]">
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
                                  stroke-width="0.8"
                                />
                              </svg>
                              <h1 className=" text-[#888] text-[14px] font-[400] leading-[20px]">
                                {formatNumber(card?.like_count)}
                              </h1>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  </div>
                ) : (
                  <div className=" mt-[20px]">
                    <div
                      className={`flex justify-center items-center py-[60px]`}
                    >
                      <div className="flex flex-col items-center">
                        <img src={empty} className="w-[80px]" alt="" />
                        <h1 className="text-center text-white/60">
                          暂无视频内容
                        </h1>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default Recommand;
