// import React, { useEffect, useRef, useState } from "react";
// // import sp from "../../../assets/explore/sp.png";
// import { FaHeart } from "react-icons/fa";
// import { useGetExploreListQuery } from "@/store/api/explore/exploreApi";
// import InfiniteScroll from "react-infinite-scroll-component";
// import { Person } from "@/assets/profile";
// import Loader from "../../../page/home/vod_loader.gif";
// import { useDispatch, useSelector } from "react-redux";
// import { setDetails } from "@/store/slices/exploreSlice";
// import { replace, useNavigate, useSearchParams } from "react-router-dom";
// import { paths } from "@/routes/paths";
// import ImageWithPlaceholder from "@/page/explore/comp/imgPlaceHolder";
// import personE from "../../../assets/explore/personE.svg";
// import AsyncDecryptedImage from "@/utils/asyncDecryptedImage";
// import empty from "../../../page/home/empty.png";

// interface LatestPorp {
//   list_id: string;
//   setShowVideoFeed: any;
//   setSelectedMovieId: any;
//   waterfall: any;
//   setWaterFall: any;
//   exp_header: any;
//   page: any;
//   setPage: any;
// }

// const Latest: React.FC<LatestPorp> = ({
//   list_id,
//   setShowVideoFeed,
//   setSelectedMovieId,
//   waterfall,
//   setWaterFall,
//   exp_header,
//   page,
//   setPage,
// }) => {
//   // const [searchParams, setSearchParams] = useSearchParams();
//   const dispatch = useDispatch();
//   // const [waterfall, setWaterFall] = useState<any[]>([]);
//   const [hasMore, setHasMore] = useState(true);
//   const { data, isLoading } = useGetExploreListQuery({ id: list_id, page });
//   const navigate = useNavigate();
//   const scrollPositionRef = useRef<number>(0);
//   const contentRef = useRef<HTMLDivElement>(null);

//   console.log(data);

//   useEffect(() => {
//     if (contentRef.current) {
//       contentRef.current.scrollTop = scrollPositionRef.current;
//     }
//   }, []);

//   useEffect(() => {
//     setWaterFall([]); // Reset list when switching tabs
//   }, [exp_header]);

//   useEffect(() => {
//     if (data?.data) {
//       setWaterFall((prev) => [...prev, ...data.data]);

//       const loadedItems =
//         data?.pagination?.current_page * data?.pagination?.per_page;
//       setHasMore(loadedItems < data?.pagination?.total);
//     } else {
//       setHasMore(false);
//     }
//   }, [data, exp_header]);
//   // console.log(data?.data)

//   const formatNumber = (num: number) => {
//     if (num >= 1000) {
//       return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}k`;
//     }
//     return num;
//   };

//   const fetchMoreData = () => {
//     setPage((prevPage) => prevPage + 1);
//   };

//   const calculateHeight = (width: number, height: number) => {
//     if (width > height) {
//       return 112; // Portrait
//     }
//     if (width < height) {
//       return 240; // Landscape
//     }
//     return 200;
//   };

//   const showDetailsVod = (file: any) => {
//     // scrollPositionRef.current = contentRef.current?.scrollTop || 0;
//     // dispatch(setDetails(file));
//     // navigate("/vod_details");
//     setSelectedMovieId(file?.post_id);
//     setShowVideoFeed(true);
//   };

//   const navigateToUserProfile = (userId: string, event: React.MouseEvent) => {
//     event.stopPropagation(); // Prevent triggering the parent click event
//     navigate(paths.getUserProfileId(userId));
//   };

//   // console.log(waterfall);
//   return (
//     <>
//       {isLoading ? (
//         <div className=" w-full grid grid-cols-2 justify-center items-center  gap-[12px] pt-[20px]">
//           <div className="rounded-lg shadow-lg bg-white/20 animate-pulse mb-4 max-w-full h-[312px]"></div>
//           <div className="rounded-lg shadow-lg bg-white/20 animate-pulse mb-4 max-w-full h-[312px]"></div>
//           <div className="rounded-lg shadow-lg bg-white/20 animate-pulse mb-4 max-w-full h-[312px]"></div>
//           <div className="rounded-lg shadow-lg bg-white/20 animate-pulse mb-4 max-w-full h-[312px]"></div>
//         </div>
//       ) : (
//         <>
//           <div className=" flex w-full justify-center">
//             <div
//               className=" grid grid-cols-2 relative gap-[6px] px-2 w-full"
//               ref={contentRef}
//             >
//               <>
//                 {waterfall?.map((card: any, index: number) => (
//                   <div
//                     key={index}
//                     className="chinese_photo h-[320px] max-w-full relative pt-[20px]"
//                   >
//                     <div
//                       className=" relative flex justify-center items-center bg-[#010101] rounded-t-[4px] overflow-hidden  h-[240px]"
//                       onClick={() => showDetailsVod(card)}
//                     >
//                       <ImageWithPlaceholder
//                         src={card?.preview_image}
//                         alt={card.title || "Video"}
//                         width={"100%"}
//                         height={calculateHeight(
//                           card?.files[0]?.width,
//                           card?.files[0]?.height
//                         )}
//                         className=" object-cover h-full w-full rounded-none"
//                       />
//                     </div>
//                     <h1 className="search_text font-cnFont line-clamp-2 text-left text-[14px] font-[400] px-[6px] pt-[6px]">
//                       {/* <h1 className="search_text font-cnFont px-[6px] line-clamp-2 text-left"> */}
//                       {card.title.length > 50
//                         ? `${card.title.slice(0, 50)}...`
//                         : card.title}
//                     </h1>
//                     <div className="  w-full px-[6px] text-white text-[14px] font-[400] leading-[30px] flex justify-between items-center ">
//                       <div className=" flex justify-center items-center gap-[4px]">
//                         {card.user?.avatar ? (
//                           <AsyncDecryptedImage
//                             className=" w-[20px] h-[20px] rounded-full"
//                             imageUrl={card.user.avatar}
//                             onError={(e) => (e.currentTarget.src = personE)}
//                             alt=""
//                           />
//                         ) : (
//                           <AsyncDecryptedImage
//                             imageUrl={personE}
//                             className="w-[20px] h-[20px] rounded-full"
//                             alt=""
//                           />
//                         )}
//                         <h1
//                           className=" text-[#888] text-[14px] font-[500] cursor-pointer hover:text-white"
//                           onClick={(e) =>
//                             navigateToUserProfile(card.user.id, e)
//                           }
//                         >
//                           {card.user.name}
//                         </h1>
//                       </div>
//                       <span className="flex gap-[5px] items-center">
//                         {/* <FaHeart /> */}
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           width="13"
//                           height="12"
//                           viewBox="0 0 13 12"
//                           fill="none"
//                         >
//                           <path
//                             d="M8.56675 1.13281C7.53401 1.13281 6.6298 1.57692 6.06616 2.32759C5.50253 1.57692 4.59832 1.13281 3.56557 1.13281C2.74349 1.13374 1.95535 1.46072 1.37405 2.04202C0.792751 2.62332 0.46577 3.41146 0.464844 4.23354C0.464844 7.73437 5.65557 10.568 5.87662 10.6851C5.93488 10.7164 6.00001 10.7328 6.06616 10.7328C6.13232 10.7328 6.19745 10.7164 6.25571 10.6851C6.47676 10.568 11.6675 7.73437 11.6675 4.23354C11.6666 3.41146 11.3396 2.62332 10.7583 2.04202C10.177 1.46072 9.38883 1.13374 8.56675 1.13281Z"
//                             stroke="#BBBBBB"
//                             stroke-width="0.8"
//                           />
//                         </svg>
//                         <h1 className=" text-[#888] text-[14px] font-[400] leading-[20px]">
//                           {formatNumber(card?.like_count)}
//                         </h1>
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//                 <InfiniteScroll
//                   className="py-[20px]"
//                   dataLength={waterfall.length}
//                   next={fetchMoreData}
//                   hasMore={hasMore}
//                   loader={
//                     <div className=" flex justify-center w-screen absolute bottom-[-30px] left-[-2px]">
//                       <div className="">
//                         <img
//                           src={Loader}
//                           className="w-[70px] h-[70px]"
//                           alt="Loading"
//                         />
//                       </div>
//                     </div>
//                   }
//                   endMessage={
//                     <div className="flex bg-whit pt-20 justify-center items-center  w-screen absolute bottom-[-20px] left-[-20px]">
//                       <p className="py-10" style={{ textAlign: "center" }}>
//                         {/* <b>No more yet!</b> */}
//                       </p>
//                     </div>
//                   }
//                 >
//                   <></>
//                 </InfiniteScroll>
//               </>
//             </div>
//           </div>
//           {waterfall.length === 0 && (
//             <div className=" mt-[20px]">
//               <div className={`flex justify-center items-center py-[60px]`}>
//                 <div className="flex flex-col items-center">
//                   <img src={empty} className="w-[80px]" alt="" />
//                   <h1 className="text-center text-white/60">暂无视频内容</h1>
//                 </div>
//               </div>
//             </div>
//           )}
//         </>
//       )}
//     </>
//   );
// };

// export default Latest;

// import React, { useEffect, useRef, useState } from "react";
// import { FaHeart } from "react-icons/fa";
// import { useGetExploreListQuery } from "@/store/api/explore/exploreApi";
// import InfiniteScroll from "react-infinite-scroll-component";
// import { Person } from "@/assets/profile";
// import Loader from "../../../page/home/vod_loader.gif";
// import { useDispatch, useSelector } from "react-redux";
// import { setDetails } from "@/store/slices/exploreSlice";
// import { replace, useNavigate, useSearchParams } from "react-router-dom";
// import { paths } from "@/routes/paths";
// import ImageWithPlaceholder from "@/page/explore/comp/imgPlaceHolder";
// import personE from "../../../assets/explore/personE.svg";
// import AsyncDecryptedImage from "@/utils/asyncDecryptedImage";
// import empty from "../../../page/home/empty.png";
// import Artplayer from "artplayer";
// import Hls from "hls.js";

// interface LatestPorp {
//   list_id: string;
//   setShowVideoFeed: any;
//   setSelectedMovieId: any;
//   waterfall: any;
//   setWaterFall: any;
//   exp_header: any;
//   page: any;
//   setPage: any;
// }

// const Latest: React.FC<LatestPorp> = ({
//   list_id,
//   setShowVideoFeed,
//   setSelectedMovieId,
//   waterfall,
//   setWaterFall,
//   exp_header,
//   page,
//   setPage,
// }) => {
//   const dispatch = useDispatch();
//   const [hasMore, setHasMore] = useState(true);
//   const { data, isLoading } = useGetExploreListQuery({ id: list_id, page });
//   const navigate = useNavigate();
//   const scrollPositionRef = useRef<number>(0);
//   const contentRef = useRef<HTMLDivElement>(null);

//   // Long press video preview states
//   const [activeLongPressCard, setActiveLongPressCard] = useState<any>(null);
//   const videoPlayerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
//   const artPlayerInstances = useRef<{ [key: string]: Artplayer | null }>({});
//   const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(
//     null
//   );

//   useEffect(() => {
//     if (contentRef.current) {
//       contentRef.current.scrollTop = scrollPositionRef.current;
//     }
//   }, []);

//   useEffect(() => {
//     setWaterFall([]); // Reset list when switching tabs
//   }, [exp_header]);

//   useEffect(() => {
//     if (data?.data) {
//       setWaterFall((prev: any) => [...prev, ...data.data]);

//       const loadedItems =
//         data?.pagination?.current_page * data?.pagination?.per_page;
//       setHasMore(loadedItems < data?.pagination?.total);
//     } else {
//       setHasMore(false);
//     }
//   }, [data, exp_header]);

//   // Add this at the top of your component
//   const observerRef = useRef<IntersectionObserver | null>(null);

//   // Initialize video players when they enter the viewport
//   useEffect(() => {
//     // Clean up previous observer if it exists
//     if (observerRef.current) {
//       observerRef.current.disconnect();
//     }

//     // Create new Intersection Observer
//     observerRef.current = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             const postId = (entry.target as HTMLElement).dataset.postId;
//             if (!postId) return;

//             const card = waterfall.find((c: any) => c.post_id === postId);
//             if (!card?.preview?.url) return;

//             // Only initialize if not already initialized
//             if (!artPlayerInstances.current[postId]) {
//               initializePlayer(card);
//             }
//           }
//         });
//       },
//       {
//         root: null,
//         rootMargin: "200px", // Load when 200px away from viewport
//         threshold: 0.01,
//       }
//     );

//     // Observe all video containers
//     Object.keys(videoPlayerRefs.current).forEach((postId) => {
//       const container = videoPlayerRefs.current[postId];
//       if (container) {
//         container.dataset.postId = postId; // Set postId as data attribute
//         observerRef.current?.observe(container);
//       }
//     });

//     return () => {
//       observerRef.current?.disconnect();
//     };
//   }, [waterfall]);
//   const initializePlayer = (card: any) => {
//     const container = videoPlayerRefs.current[card.post_id];
//     if (!container) return;

//     const options: Artplayer["Option"] = {
//       container: container,
//       url: card.preview.url,
//       volume: 0.5,
//       muted: true,
//       autoplay: false,
//       loop: true,
//       isLive: false,
//       aspectRatio: true,
//       controls: [],
//       fullscreen: false,
//       theme: "#d53ff0",
//       type: card.preview.url.includes(".m3u8") ? "m3u8" : "auto",
//       moreVideoAttr: {
//         playsInline: true,
//       },
//       customType: {
//         m3u8: (videoElement: HTMLVideoElement, url: string) => {
//           if (Hls.isSupported()) {
//             const hls = new Hls({
//               maxBufferLength: 1, // Maximum buffer length in seconds
//               maxMaxBufferLength: 1, // Absolute maximum buffer length
//               maxBufferSize: 1 * 1000 * 1000, // 2MB buffer size
//               maxBufferHole: 0.5, // Skip small gaps in the stream
//               lowLatencyMode: true, // Reduce latency
//               enableWorker: true, // Use web worker for better performance
//               backBufferLength: 1, // Keep only 1 second of back buffer
//             });

//             hls.on(Hls.Events.MANIFEST_PARSED, () => {
//               // Only load the first 2 seconds
//               hls.startLoad(0);
//               // hls.stopLoad(2);
//             });

//             hls.loadSource(url);
//             hls.attachMedia(videoElement);

//             // Optional: Clean up buffer when not playing
//             videoElement.addEventListener("pause", () => {
//               hls.stopLoad();
//             });
//             videoElement.addEventListener("play", () => {
//               hls.startLoad(-1); // Resume loading from current position
//             });
//           } else if (
//             videoElement.canPlayType("application/vnd.apple.mpegurl")
//           ) {
//             // For Safari's native HLS support, we have less control
//             videoElement.src = url;
//             videoElement.preload = "none"; // Minimal preloading
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

//       // Hide all controls
//       const controls = container.querySelectorAll(".art-controls, .art-mask");
//       controls.forEach((control) => {
//         (control as HTMLElement).style.display = "none";
//       });

//       player.on("error", (error) => {
//         console.error("ArtPlayer error:", error);
//       });

//       // Additional optimization: Only load video when needed
//       player.on("play", () => {
//         const hlsInstance = player.hls;
//         if (hlsInstance) {
//           hlsInstance.startLoad(-1); // Start loading from current position
//         }
//       });

//       player.on("pause", () => {
//         const hlsInstance = player.hls;
//         if (hlsInstance) {
//           hlsInstance.stopLoad(); // Stop loading when paused
//         }
//       });
//     } catch (error) {
//       console.error("Error initializing ArtPlayer:", error);
//     }
//   };

//   // // Extract player initialization to a separate function
//   // const initializePlayer = (card: any) => {
//   //   const container = videoPlayerRefs.current[card.post_id];
//   //   if (!container) return;

//   //   const options: Artplayer["Option"] = {
//   //     container: container,
//   //     url: card.preview.url,
//   //     volume: 0.5,
//   //     muted: true,
//   //     autoplay: false,
//   //     loop: true,
//   //     isLive: false,
//   //     aspectRatio: true,
//   //     controls: [],
//   //     fullscreen: false,
//   //     theme: "#d53ff0",
//   //     type: card.preview.url.includes(".m3u8") ? "m3u8" : "auto",
//   //     moreVideoAttr: {
//   //       playsInline: true,
//   //     },
//   //     customType: {
//   //       m3u8: (videoElement: HTMLVideoElement, url: string) => {
//   //         if (Hls.isSupported()) {
//   //           const hls = new Hls();
//   //           hls.loadSource(url);
//   //           hls.attachMedia(videoElement);
//   //         } else if (
//   //           videoElement.canPlayType("application/vnd.apple.mpegurl")
//   //         ) {
//   //           videoElement.src = url;
//   //         }
//   //       },
//   //     },
//   //     icons: {
//   //       loading: `<div style="display:none"></div>`,
//   //       state: `<div style="display:none"></div>`,
//   //     },
//   //   };

//   //   try {
//   //     const player = new Artplayer(options);
//   //     artPlayerInstances.current[card.post_id] = player;

//   //     // Hide all controls
//   //     const controls = container.querySelectorAll(".art-controls, .art-mask");
//   //     controls.forEach((control) => {
//   //       (control as HTMLElement).style.display = "none";
//   //     });

//   //     player.on("error", (error) => {
//   //       console.error("ArtPlayer error:", error);
//   //     });
//   //   } catch (error) {
//   //     console.error("Error initializing ArtPlayer:", error);
//   //   }
//   // };

//   // Clean up all players when component unmounts
//   useEffect(() => {
//     return () => {
//       Object.values(artPlayerInstances.current).forEach((player) => {
//         player?.destroy();
//       });
//       artPlayerInstances.current = {};
//       observerRef.current?.disconnect();
//     };
//   }, []);

//   // // Initialize all video players when waterfall changes
//   // useEffect(() => {
//   //   waterfall.forEach((card: any) => {
//   //     if (card?.preview?.url) {
//   //       const container = videoPlayerRefs.current[card.post_id];
//   //       if (container && !artPlayerInstances.current[card.post_id]) {
//   //         const options: Artplayer["Option"] = {
//   //           container: container,
//   //           url: card.preview.url,
//   //           volume: 0.5, // Set initial volume
//   //           muted: true, // Start muted
//   //           autoplay: false, // Don't autoplay initially
//   //           loop: true,
//   //           isLive: false,
//   //           aspectRatio: true,
//   //           controls: [], // No controls
//   //           fullscreen: false,
//   //           theme: "#d53ff0",
//   //           type: card.preview.url.includes(".m3u8") ? "m3u8" : "auto",
//   //           moreVideoAttr: {
//   //             playsInline: true,
//   //           },
//   //           customType: {
//   //             m3u8: (videoElement: HTMLVideoElement, url: string) => {
//   //               if (Hls.isSupported()) {
//   //                 const hls = new Hls();
//   //                 hls.loadSource(url);
//   //                 hls.attachMedia(videoElement);
//   //               } else if (
//   //                 videoElement.canPlayType("application/vnd.apple.mpegurl")
//   //               ) {
//   //                 videoElement.src = url;
//   //               }
//   //             },
//   //           },
//   //           icons: {
//   //             loading: `<div style="display:none"></div>`,
//   //             state: `<div style="display:none"></div>`,
//   //           },
//   //         };

//   //         try {
//   //           const player = new Artplayer(options);
//   //           artPlayerInstances.current[card.post_id] = player;

//   //           // Hide all controls
//   //           const controls = container.querySelectorAll(
//   //             ".art-controls, .art-mask"
//   //           );
//   //           controls.forEach((control) => {
//   //             (control as HTMLElement).style.display = "none";
//   //           });

//   //           player.on("error", (error) => {
//   //             console.error("ArtPlayer error:", error);
//   //           });
//   //         } catch (error) {
//   //           console.error("Error initializing ArtPlayer:", error);
//   //         }
//   //       }
//   //     }
//   //   });

//   //   return () => {
//   //     // Clean up all players
//   //     Object.values(artPlayerInstances.current).forEach((player) => {
//   //       player?.destroy();
//   //     });
//   //     artPlayerInstances.current = {};
//   //   };
//   // }, [waterfall]);

//   const formatNumber = (num: number) => {
//     if (num >= 1000) {
//       return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}k`;
//     }
//     return num;
//   };

//   const fetchMoreData = () => {
//     setPage((prevPage: any) => prevPage + 1);
//   };

//   const calculateHeight = (width: number, height: number) => {
//     if (width > height) {
//       return 112; // Portrait
//     }
//     if (width < height) {
//       return 240; // Landscape
//     }
//     return 200;
//   };

//   const showDetailsVod = (file: any) => {
//     setSelectedMovieId(file?.post_id);
//     setShowVideoFeed(true);
//   };

//   const navigateToUserProfile = (userId: string, event: React.MouseEvent) => {
//     event.stopPropagation();
//     navigate(paths.getUserProfileId(userId));
//   };

//   // Long press handlers
//   const handleLongPress = (card: any) => {
//     const player = artPlayerInstances.current[card.post_id];
//     if (player) {
//       // Unmute and play the video
//       player.muted = false;
//       player.play().catch((e) => console.log("Play error:", e));
//       setActiveLongPressCard(card);
//     }
//   };

//   const handleTouchStart = (card: any) => {
//     const timer = setTimeout(() => {
//       handleLongPress(card);
//     }, 1000); // 1 second long press
//     setLongPressTimer(timer);
//   };

//   const handleTouchEnd = () => {
//     if (longPressTimer) {
//       clearTimeout(longPressTimer);
//       setLongPressTimer(null);
//     }
//     if (activeLongPressCard) {
//       const player = artPlayerInstances.current[activeLongPressCard.post_id];
//       if (player) {
//         // Mute and pause the video when released
//         player.muted = true;
//         player.pause();
//       }
//       setActiveLongPressCard(null);
//     }
//   };

//   return (
//     <>
//       {isLoading ? (
//         <div className="w-full grid grid-cols-2 justify-center items-center gap-[12px] pt-[20px]">
//           <div className="rounded-lg shadow-lg bg-white/20 animate-pulse mb-4 max-w-full h-[312px]"></div>
//           <div className="rounded-lg shadow-lg bg-white/20 animate-pulse mb-4 max-w-full h-[312px]"></div>
//           <div className="rounded-lg shadow-lg bg-white/20 animate-pulse mb-4 max-w-full h-[312px]"></div>
//           <div className="rounded-lg shadow-lg bg-white/20 animate-pulse mb-4 max-w-full h-[312px]"></div>
//         </div>
//       ) : (
//         <>
//           <div className="flex w-full justify-center">
//             <div
//               className="grid grid-cols-2 relative gap-[6px] px-2 w-full"
//               ref={contentRef}
//             >
//               {waterfall?.map((card: any, index: number) => (
//                 <div
//                   key={index}
//                   className="chinese_photo h-[320px] max-w-full relative pt-[20px]"
//                 >
//                   <div
//                     className="relative flex justify-center items-center bg-[#010101] rounded-t-[4px] overflow-hidden h-[240px]"
//                     onClick={() => showDetailsVod(card)}
//                     onTouchStart={() => handleTouchStart(card)}
//                     onTouchEnd={handleTouchEnd}
//                     onTouchMove={handleTouchEnd}
//                   >
//                     {/* Video Player (always present but hidden) */}
//                     <div
//                       ref={(el) => (videoPlayerRefs.current[card.post_id] = el)}
//                       className="w-full h-full object-cover rounded-none"
//                       style={{
//                         position: "absolute",
//                         top: 0,
//                         left: 0,
//                         zIndex: 1,
//                         backgroundColor: "#000",
//                         opacity:
//                           activeLongPressCard?.post_id === card.post_id ? 1 : 0,
//                         transition: "opacity 0.3s ease",
//                         pointerEvents: "none",
//                       }}
//                     ></div>

//                     {/* Image (always visible) */}
//                     <ImageWithPlaceholder
//                       src={card?.preview_image}
//                       alt={card.title || "Video"}
//                       width={"100%"}
//                       height={calculateHeight(
//                         card?.files[0]?.width,
//                         card?.files[0]?.height
//                       )}
//                       className="object-cover h-full w-full rounded-none"
//                       style={{
//                         opacity:
//                           activeLongPressCard?.post_id === card.post_id ? 0 : 1,
//                         transition: "opacity 0.3s ease",
//                       }}
//                     />
//                   </div>
//                   <h1 className="search_text font-cnFont line-clamp-2 text-left text-[14px] font-[400] px-[6px] pt-[6px]">
//                     {card.title.length > 50
//                       ? `${card.title.slice(0, 50)}...`
//                       : card.title}
//                   </h1>
//                   <div className="w-full px-[6px] text-white text-[14px] font-[400] leading-[30px] flex justify-between items-center">
//                     <div className="flex justify-center items-center gap-[4px]">
//                       {card.user?.avatar ? (
//                         <AsyncDecryptedImage
//                           className="w-[20px] h-[20px] rounded-full"
//                           imageUrl={card.user.avatar}
//                           onError={(e) => (e.currentTarget.src = personE)}
//                           alt=""
//                         />
//                       ) : (
//                         <AsyncDecryptedImage
//                           imageUrl={personE}
//                           className="w-[20px] h-[20px] rounded-full"
//                           alt=""
//                         />
//                       )}
//                       <h1
//                         className="text-[#888] text-[14px] font-[500] cursor-pointer hover:text-white"
//                         onClick={(e) => navigateToUserProfile(card.user.id, e)}
//                       >
//                         {card.user.name}
//                       </h1>
//                     </div>
//                     <span className="flex gap-[5px] items-center">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="13"
//                         height="12"
//                         viewBox="0 0 13 12"
//                         fill="none"
//                       >
//                         <path
//                           d="M8.56675 1.13281C7.53401 1.13281 6.6298 1.57692 6.06616 2.32759C5.50253 1.57692 4.59832 1.13281 3.56557 1.13281C2.74349 1.13374 1.95535 1.46072 1.37405 2.04202C0.792751 2.62332 0.46577 3.41146 0.464844 4.23354C0.464844 7.73437 5.65557 10.568 5.87662 10.6851C5.93488 10.7164 6.00001 10.7328 6.06616 10.7328C6.13232 10.7328 6.19745 10.7164 6.25571 10.6851C6.47676 10.568 11.6675 7.73437 11.6675 4.23354C11.6666 3.41146 11.3396 2.62332 10.7583 2.04202C10.177 1.46072 9.38883 1.13374 8.56675 1.13281Z"
//                           stroke="#BBBBBB"
//                           strokeWidth="0.8"
//                         />
//                       </svg>
//                       <h1 className="text-[#888] text-[14px] font-[400] leading-[20px]">
//                         {formatNumber(card?.like_count)}
//                       </h1>
//                     </span>
//                   </div>
//                 </div>
//               ))}
//               <InfiniteScroll
//                 className="py-[20px]"
//                 dataLength={waterfall.length}
//                 next={fetchMoreData}
//                 hasMore={hasMore}
//                 loader={
//                   <div className="flex justify-center w-screen absolute bottom-[-30px] left-[-2px]">
//                     <div className="">
//                       <img
//                         src={Loader}
//                         className="w-[70px] h-[70px]"
//                         alt="Loading"
//                       />
//                     </div>
//                   </div>
//                 }
//                 endMessage={
//                   <div className="flex bg-whit pt-20 justify-center items-center w-screen absolute bottom-[-20px] left-[-20px]">
//                     <p className="py-10" style={{ textAlign: "center" }}>
//                       {/* <b>No more yet!</b> */}
//                     </p>
//                   </div>
//                 }
//               >
//                 <></>
//               </InfiniteScroll>
//             </div>
//           </div>
//           {waterfall.length === 0 && (
//             <div className="mt-[20px]">
//               <div className={`flex justify-center items-center py-[60px]`}>
//                 <div className="flex flex-col items-center">
//                   <img src={empty} className="w-[80px]" alt="" />
//                   <h1 className="text-center text-white/60">暂无视频内容</h1>
//                 </div>
//               </div>
//             </div>
//           )}
//         </>
//       )}
//     </>
//   );
// };

// export default Latest;

import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { setHistoryData } from "../slice/HistorySlice";
import back from "../../../assets/explore/back.svg";
import sc from "../../../assets/explore/sc.svg";
import loader from "../../home/vod_loader.gif";
import {
  useGetTabListQuery,
  useLazyGetSuggestionsQuery,
  usePostSearchMutation,
} from "@/store/api/search/searchApi";
import Header from "./Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import VideoFeed from "@/page/home/components/VideoFeed";
import empty from "../../home/empty.png";
import ImageWithPlaceholder from "@/page/explore/comp/imgPlaceHolder";
import { paths } from "@/routes/paths";
import Artplayer from "artplayer";
import Hls from "hls.js";
import indicator from "../../home/indicator.png";
import vod_loader from "../../home/vod_loader.gif";
import he from "he";
import personE from "../../../assets/explore/personE.svg";
import backButton from "../../../assets/backButton.svg";
import { useGetConfigQuery } from "@/page/home/services/homeApi";
import { decryptImage } from "@/utils/imageDecrypt";
import { load } from "@fingerprintjs/fingerprintjs";

interface ResultsProps {}

const Results: React.FC<ResultsProps> = ({}) => {
  const [tabs, setTabs] = useState([]);
  interface Tab {
    key: string;
  }

  const [activeTab, setActiveTab] = useState<Tab | null>(null);
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("query") || "";
  const [query, setQuery] = useState(initialQuery);
  const dispatch = useDispatch();
  const [loadingTabs, setLoadingTabs] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [movies, setMovies] = useState<any[]>([]);
  const navigate = useNavigate();
  const [postSearch, { data, isLoading }] = usePostSearchMutation();
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [showVideoFeed, setShowVideoFeed] = useState(false);
  const [page, setPage] = useState(1);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [triggerAutocomplete, { data: autocompleteData }] =
    useLazyGetSuggestionsQuery();
  const [decryptedAvatars, setDecryptedAvatars] = useState<{
    [key: string]: string;
  }>({});

  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleMoreRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<(HTMLLIElement | null)[]>([]);
  const scrollPositionRef = useRef(0);
  const videoPlayerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const artPlayerInstances = useRef<{ [key: string]: Artplayer | null }>({});
  const [activeLongPressCard, setActiveLongPressCard] = useState<any>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleSearch = () => {
    if (query.trim()) {
      dispatch(setHistoryData({ data: query.trim() }));
      postSearch({
        search: query,
        tab: activeTab?.key,
        page: currentPage,
      });
    }
  };

  useEffect(() => {
    postSearch({
      search: query,
      tab: "",
      page: currentPage,
    }).then((response) => {
      if (response?.data?.data?.orders) {
        setTabs(response.data.data.orders);
        setActiveTab(response.data.data.orders[0]);
      }
      setLoadingTabs(false);
    });
  }, []);

  useEffect(() => {
    if (!loadingTabs && activeTab) {
      postSearch({
        search: query,
        tab: activeTab?.key,
        page: currentPage,
      });
    }
  }, [activeTab, currentPage, loadingTabs]);

  useEffect(() => {
    if (data?.data?.list && !loadingTabs) {
      setMovies((prevMovies) =>
        currentPage === 1
          ? data.data?.list
          : [...prevMovies, ...data.data?.list]
      );
    }
  }, [data]);

  const [videoFeedHistoryState, setVideoFeedHistoryState] = useState(false);

  const handleVideoClick = (postId: any) => {
    const scrollY = window.scrollY;
    window.history.pushState(
      {
        isVideoFeed: true,
        scrollY,
      },
      ""
    );
    scrollPositionRef.current = window.scrollY;
    setSelectedMovieId(postId);
    setShowVideoFeed(true);
    setVideoFeedHistoryState(true);
  };

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (videoFeedHistoryState && !event.state) {
        setShowVideoFeed(false);
        setVideoFeedHistoryState(false);

        setTimeout(() => {
          if (event.state?.scrollY) {
            window.scrollTo(0, event.state?.scrollY);
          }
        }, 50);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (query.trim()) {
      dispatch(setHistoryData({ data: query.trim() }));
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
      handleSearch();
      setCurrentPage(1);
    }
  };

  const noData = !data || data?.data?.list.length === 0;

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 50
      ) {
        if (!isLoading && !noData) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [data]);

  useEffect(() => {
    if (query.trim()) {
      setPage(1);
      const timer = setTimeout(() => {
        triggerAutocomplete({ query, page: 1 });
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
    }
  }, [query, triggerAutocomplete]);

  useEffect(() => {
    if (page !== 1 && query.trim()) {
      const timer = setTimeout(() => {
        triggerAutocomplete({ query, page });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [page, query, triggerAutocomplete]);

  useEffect(() => {
    if (autocompleteData) {
      if (page === 1) {
        setSuggestions(autocompleteData.data);
      } else {
        setSuggestions((prevSuggestions) => [
          ...prevSuggestions,
          ...autocompleteData.data,
        ]);
      }
    }
  }, [autocompleteData]);

  const onSearch = (suggestion: any) => {
    if (suggestion.trim()) {
      dispatch(setHistoryData({ data: suggestion.trim() }));
      navigate(`/search?query=${encodeURIComponent(suggestion.trim())}`);
      handleSearch();
      setCurrentPage(1);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setSuggestions([]);
    onSearch(suggestion);
  };

  function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  const highlightKeywords = (text: string, keyword: string) => {
    if (!keyword.trim()) return he.decode(text);
    const safeKeyword = escapeRegExp(keyword);
    const parts = he.decode(text).split(new RegExp(`(${safeKeyword})`, "gi"));

    return parts.map((part: string, index: number) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <span key={index} className="search_btn">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const calculateHeight = (width: number, height: number) => {
    if (width > height) {
      return 112;
    }
    if (width < height) {
      return 240;
    }
    return 200;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}k`;
    }
    return num;
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

  useEffect(() => {
    const decryptAvatar = async (avatarUrl: string, userId: string) => {
      if (!avatarUrl.endsWith(".txt")) {
        setDecryptedAvatars((prev) => ({ ...prev, [userId]: avatarUrl }));
        return;
      }

      try {
        const decryptedUrl = await decryptImage(avatarUrl);
        setDecryptedAvatars((prev) => ({ ...prev, [userId]: decryptedUrl }));
      } catch (error) {
        console.error("Error decrypting avatar:", error);
        setDecryptedAvatars((prev) => ({ ...prev, [userId]: "" }));
      }
    };

    movies.forEach((movie) => {
      if (movie.user.avatar) {
        decryptAvatar(movie.user.avatar, movie.user.id);
      }
    });
  }, [movies]);

  const navigateToUserProfile = (userId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(paths.getUserProfileId(userId));
  };

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    const bodyElement = document.querySelector("body");

    if (suggestions.length > 0 && isFocused) {
      if (bodyElement) {
        bodyElement.style.overflow = "hidden";
      }
    } else {
      if (bodyElement) {
        bodyElement.style.overflow = "auto";
      }
    }
  }, [isFocused, suggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      const clickedInsideAListItem = listRef.current.some(
        (ref) => ref && ref.contains(target)
      );

      if (
        inputRef.current &&
        !inputRef.current.contains(target) &&
        !clickedInsideAListItem &&
        (!handleMoreRef.current || !handleMoreRef.current.contains(target))
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Initialize video players when they enter the viewport
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const postId = (entry.target as HTMLElement).dataset.postId;
            if (!postId) return;

            const card = movies.find((c: any) => c.post_id === postId);
            if (!card?.preview?.url) return;

            if (!artPlayerInstances.current[postId]) {
              initializePlayer(card);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.01,
      }
    );

    Object.keys(videoPlayerRefs.current).forEach((postId) => {
      const container = videoPlayerRefs.current[postId];
      if (container) {
        container.dataset.postId = postId;
        observerRef.current?.observe(container);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [movies]);

  const initializePlayer = (card: any) => {
    const container = videoPlayerRefs.current[card.post_id];
    if (!container) return;

    const options: Artplayer["Option"] = {
      container: container,
      url: card.preview.url,
      volume: 0.5,
      muted: true,
      autoplay: false,
      loop: true,
      isLive: false,
      aspectRatio: true,
      controls: [],
      fullscreen: false,
      theme: "#d53ff0",
      type: card.preview.url.includes(".m3u8") ? "m3u8" : "auto",
      moreVideoAttr: {
        playsInline: true,
      },
      customType: {
        m3u8: (videoElement: HTMLVideoElement, url: string) => {
          if (Hls.isSupported()) {
            const hls = new Hls({
              maxBufferLength: 1,
              maxMaxBufferLength: 1,
              maxBufferSize: 1 * 1000 * 1000,
              maxBufferHole: 0.5,
              lowLatencyMode: true,
              enableWorker: true,
              backBufferLength: 1,
            });

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              hls.startLoad(0);
            });

            hls.loadSource(url);
            hls.attachMedia(videoElement);

            videoElement.addEventListener("pause", () => {
              hls.stopLoad();
            });
            videoElement.addEventListener("play", () => {
              hls.startLoad(-1);
            });
          } else if (
            videoElement.canPlayType("application/vnd.apple.mpegurl")
          ) {
            videoElement.src = url;
            videoElement.preload = "none";
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
      artPlayerInstances.current[card.post_id] = player;

      const controls = container.querySelectorAll(".art-controls, .art-mask");
      controls.forEach((control) => {
        (control as HTMLElement).style.display = "none";
      });

      player.on("error", (error) => {
        console.error("ArtPlayer error:", error);
      });

      player.on("play", () => {
        const hlsInstance = player.hls;
        if (hlsInstance) {
          hlsInstance.startLoad(-1);
        }
      });

      player.on("pause", () => {
        const hlsInstance = player.hls;
        if (hlsInstance) {
          hlsInstance.stopLoad();
        }
      });
    } catch (error) {
      console.error("Error initializing ArtPlayer:", error);
    }
  };

  useEffect(() => {
    return () => {
      Object.values(artPlayerInstances.current).forEach((player) => {
        player?.destroy();
      });
      artPlayerInstances.current = {};
      observerRef.current?.disconnect();
    };
  }, []);

  // Long press handlers
  const handleLongPress = (card: any) => {
    const player = artPlayerInstances.current[card.post_id];
    if (player) {
      player.muted = false;
      player.play().catch((e) => console.log("Play error:", e));
      setActiveLongPressCard(card);
    }
  };

  const handleTouchStart = (card: any) => {
    const timer = setTimeout(() => {
      handleLongPress(card);
    }, 1000); // 1 second long press
    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    if (activeLongPressCard) {
      const player = artPlayerInstances.current[activeLongPressCard.post_id];
      if (player) {
        player.muted = true;
        player.pause();
      }
      setActiveLongPressCard(null);
    }
  };

  return (
    <div className="">
      {showVideoFeed && selectedMovieId && (
        <VideoFeed
          setPage={setCurrentPage}
          search={true}
          setVideos={setMovies}
          videos={movies}
          currentActiveId={selectedMovieId}
          setShowVideoFeed={(value: any) => {
            setShowVideoFeed(value);
            if (!value) {
              setTimeout(() => {
                window.scrollTo(0, scrollPositionRef.current);
              }, 50);
            }
          }}
          query={query}
        />
      )}

      <div
        style={{
          display: showVideoFeed ? "none" : "block",
        }}
      >
        <div className="fixed top-0 z-[99999] bg-[#15131c] w-full">
          <form
            onSubmit={handleSubmit}
            className="px-[16px] pb-[20px] pt-[20px] flex justify-between items-center gap-[10px]"
          >
            <img
              onClick={() => navigate("/search_overlay")}
              src={backButton}
              alt=""
            />

            <div className=" w-full px-[10px] py-[8px] search_input flex gap-[12px]">
              <img src={sc} alt="" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索影片"
                onFocus={() => setIsFocused(true)}
                ref={inputRef}
                className=" bg-transparent focus:outline-none text-[16px] font-[400] text-white w-full"
                type="text"
              />
              {query?.length > 0 && (
                <button
                  type="button"
                  className="cross-circle"
                  onClick={() => setQuery("")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="8"
                    height="8"
                    viewBox="0 0 8 8"
                    fill="none"
                  >
                    <path
                      d="M4 3.1668L6.9168 0.25L7.75 1.0832L4.8332 4L7.75 6.9168L6.9168 7.75L4 4.8332L1.0832 7.75L0.25 6.9168L3.1668 4L0.25 1.0832L1.0832 0.25L4 3.1668Z"
                      fill="white"
                      fill-opacity="0.8"
                    />
                  </svg>
                </button>
              )}
            </div>
            <button type="submit" className="search_btn w-[45px]">
              搜索
            </button>
          </form>

          <Header
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabs={tabs}
            setCurrentPage={setCurrentPage}
          />
        </div>

        <div className="mt-[130px] px-[8px]">
          {isLoading && currentPage === 1 ? (
            <div className=" flex justify-center items-center py-[200px]">
              <div className="heart">
                <img
                  src={loader}
                  className="w-[100px] h-[100px]"
                  alt="Loading"
                />
              </div>
            </div>
          ) : (
            <>
              {movies?.length > 0 && (
                <div className=" py-[12px] w-full grid grid-cols-2 justify-center items-center  gap-[8px]">
                  <>
                    {movies?.map((card: any) => (
                      <div
                        onClick={() => handleVideoClick(card?.post_id)}
                        onTouchStart={() => handleTouchStart(card)}
                        onTouchEnd={handleTouchEnd}
                        onTouchMove={handleTouchEnd}
                        key={card.post_id}
                        data-video-card
                        data-postid={card?.post_id}
                        className="max-w-full pb-[12px] chinese_photo h-[325px]"
                      >
                        <div
                          className={`relative flex justify-center items-center bg-[#010101] rounded-[4px] overflow-hidden h-[240px]`}
                        >
                          {/* Video Player */}
                          <div
                            ref={(el) =>
                              (videoPlayerRefs.current[card.post_id] = el)
                            }
                            className="w-full h-full object-cover rounded-none"
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              zIndex: 1,
                              backgroundColor: "#000",
                              opacity:
                                activeLongPressCard?.post_id === card.post_id
                                  ? 1
                                  : 0,
                              transition: "opacity 0.3s ease",
                              pointerEvents: "none",
                            }}
                          ></div>

                          {/* Image */}
                          <ImageWithPlaceholder
                            src={card?.preview_image}
                            alt={card.title || "Video"}
                            width={"100%"}
                            height={
                              card?.files[0]?.height &&
                              calculateHeight(
                                card?.files[0]?.width,
                                card?.files[0]?.height
                              )
                            }
                            className="object-cover h-full w-full rounded-none"
                            style={{
                              opacity:
                                activeLongPressCard?.post_id === card.post_id
                                  ? 0
                                  : 1,
                              transition: "opacity 0.3s ease",
                            }}
                          />

                          <div className="absolute hidden left-0 mx-auto right-0 bottom-0 fle justify-around items-center w-full max-w-[175px] bg-blac">
                            <div className="flex w-full justify-between px-2">
                              <span className="text-white text-[11px] left-">
                                {card?.view_count} 次观看
                              </span>
                              <span className="text-white text-[11px] right-0">
                                {formatDuration(card?.files[0].duration)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="search_text font-cnFont px-[6px] line-clamp-2 text-left">
                            {card.title}
                          </p>
                        </div>
                        <div className="flex w-full p-[6px] justify-between">
                          <div className="flex justify-cente items-center gap-[4px]">
                            {card.user.avatar ? (
                              <img
                                className="w-[20px] h-[20px] rounded-full"
                                src={
                                  decryptedAvatars[card.user.id] ||
                                  card.user.avatar
                                }
                                onError={(e) => (e.currentTarget.src = personE)}
                                alt=""
                              />
                            ) : (
                              <img
                                src={personE}
                                className="w-[20px] h-[20px] rounded-full"
                                alt=""
                              />
                            )}
                            <h1
                              className="text-white text-[14px] font-[400] leading-[20px] cursor-pointer hover:text-purple-300"
                              onClick={(e) =>
                                navigateToUserProfile(card.user.id, e)
                              }
                            >
                              {card.user.name}
                            </h1>
                          </div>
                          <div className="flex justify-center items-center gap-[4px]">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="19"
                              height="17"
                              viewBox="0 0 19 17"
                              fill="none"
                              className="mt-[8px]"
                            >
                              <g filter="url(#filter0_d_3792_5241)">
                                <path
                                  d="M12.0257 0.200195C10.993 0.200195 10.0888 0.6443 9.52515 1.39498C8.96152 0.6443 8.0573 0.200195 7.02456 0.200195C6.20248 0.201122 5.41433 0.528103 4.83303 1.1094C4.25174 1.6907 3.92475 2.47885 3.92383 3.30093C3.92383 6.80175 9.11455 9.63542 9.3356 9.75245C9.39387 9.78379 9.45899 9.8002 9.52515 9.8002C9.59131 9.8002 9.65643 9.78379 9.71469 9.75245C9.93575 9.63542 15.1265 6.80175 15.1265 3.30093C15.1255 2.47885 14.7986 1.6907 14.2173 1.1094C13.636 0.528103 12.8478 0.201122 12.0257 0.200195Z"
                                  fill="white"
                                />
                              </g>
                              <defs>
                                <filter
                                  id="filter0_d_3792_5241"
                                  x="0.723828"
                                  y="0.200195"
                                  width="17.6031"
                                  height="15.9996"
                                  filterUnits="userSpaceOnUse"
                                  color-interpolation-filters="sRGB"
                                >
                                  <feFlood
                                    flood-opacity="0"
                                    result="BackgroundImageFix"
                                  />
                                  <feColorMatrix
                                    in="SourceAlpha"
                                    type="matrix"
                                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                    result="hardAlpha"
                                  />
                                  <feOffset dy="3.2" />
                                  <feGaussianBlur stdDeviation="1.6" />
                                  <feComposite in2="hardAlpha" operator="out" />
                                  <feColorMatrix
                                    type="matrix"
                                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                                  />
                                  <feBlend
                                    mode="normal"
                                    in2="BackgroundImageFix"
                                    result="effect1_dropShadow_3792_5241"
                                  />
                                  <feBlend
                                    mode="normal"
                                    in="SourceGraphic"
                                    in2="effect1_dropShadow_3792_5241"
                                    result="shape"
                                  />
                                </filter>
                              </defs>
                            </svg>
                            <h1 className="text-white text-[14px] font-[400] leading-[20px]">
                              {formatNumber(card?.like_count)}
                            </h1>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                </div>
              )}

              <div className="flex justify-center items-center py-4">
                <img
                  style={{
                    visibility:
                      isLoading && data?.data?.list.length !== 0
                        ? "visible"
                        : "hidden",
                  }}
                  src={loader}
                  className="w-[50px] h-[50px] m-auto"
                  alt="Loading more"
                />
              </div>

              {data?.data?.list.length === 0 &&
                (currentPage === 1 ? (
                  <div
                    className={`flex justify-center items-center py-[200px]`}
                  >
                    <div className="flex flex-col items-center">
                      <img src={empty} className="w-[80px]" alt="" />
                      <h1 className="text-center text-white/60">
                        搜索结果为空
                      </h1>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`flex justify-center items-center -mt-[70px] py-[20px]`}
                  >
                    <div>
                      <h1 className="text-white/60">搜索结果为空</h1>
                    </div>
                  </div>
                ))}
            </>
          )}
        </div>

        {query.length > 0 && isFocused && suggestions.length > 0 && (
          <ul className="fixed top-[60px] px-[16px] left-0 pt-[20px] pb-[80px] h-screen w-full bg-[#16131C] text-white z-[99999] overflow-y-auto">
            {suggestions.map((suggestion: any, index) => (
              <li
                ref={(el) => (listRef.current[index] = el)}
                key={index}
                onClick={() => handleSuggestionClick(suggestion.title)}
                className="cursor-pointer gap-5 mb-4 flex items-center justify-between"
              >
                <div className="flex truncate gap-5 items-center">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M13.9521 9.53764C14.1523 8.90982 14.2603 8.24084 14.2603 7.54667C14.2603 3.93104 11.3293 1 7.71367 1C4.09804 1 1.16699 3.93104 1.16699 7.54667C1.16699 11.1623 4.09804 14.0934 7.71367 14.0934C9.43465 14.0934 11.0006 13.4293 12.1691 12.3433M12.267 12.44L14.8336 15"
                        stroke="#AAAAAA"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="truncate">
                    {highlightKeywords(suggestion?.title, query)}
                  </span>
                </div>

                <span className="">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M11 17V11M11 11H17M11 11L20.5 21"
                      stroke="white"
                      stroke-opacity="0.8"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
              </li>
            ))}
            {autocompleteData?.pagination?.current_page <
              autocompleteData?.pagination?.last_page && (
              <li className="flex justify-center mt-4">
                <button
                  ref={handleMoreRef}
                  onClick={handleLoadMore}
                  className="text-[#888] text-[14px] py-2 px-6 rounded"
                >
                  点击加载更多
                </button>
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Results;
