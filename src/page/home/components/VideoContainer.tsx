// import { useEffect, useRef, useState } from "react";
// import Player from "./Player";
// import VideoSidebar from "./VideoSidebar";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   useLikePostMutation,
//   useUnlikePostMutation,
// } from "../services/homeApi";
// import { setVideos } from "../services/videosSlice";
// import { useNavigate } from "react-router-dom";
// import LoginDrawer from "@/components/profile/auth/login-drawer";
// import { showToast } from "../services/errorSlice";

// const VideoContainer = ({
//   video,
//   setWidth,
//   setHeight,
//   setCountNumber,
//   setCountdown,
//   countNumber,
//   config,
//   countdown,
//   setHearts,
//   status,
//   width,
//   height,
//   container,
//   abortControllerRef,
//   indexRef,
//   videoData,
//   setShowHeart,
//   refetchUser,
//   coin,
// }: {
//   video: any;
//   setWidth: any;
//   setHeight: any;
//   setCountNumber: any;
//   setCountdown: any;
//   countNumber: any;
//   config: any;
//   countdown: any;
//   setHearts: any;
//   status: any;
//   width: any;
//   height: any;
//   container: any;
//   abortControllerRef: any;
//   refetchUser: any;
//   indexRef: any;
//   videoData: any;
//   setShowHeart: any;
//   coin: any;
// }) => {
//   const [likeCount, setLikeCount] = useState(video?.like_count);
//   const [isLiked, setIsLiked] = useState(video?.is_liked);
//   const [commentCount, setcommentCount] = useState(video?.comment_count);

//   const user = useSelector((state: any) => state.persist.user);
//   const [likePost] = useLikePostMutation();
//   const [unlikePost] = useUnlikePostMutation();
//   const dispatch = useDispatch();
//   const currentTab = useSelector((state: any) => state.home.currentTab);
//   const { videos } = useSelector((state: any) => state.videoSlice);

//   const post_id = video?.post_id;
//   const [rotateVideoId, setRotateVideoId] = useState<string | null>(null); // For controlling fullscreen per video
//   const [isOpen, setIsOpen] = useState(false);
//   const [coins, setCoins] = useState(coin);

//   // Add state to track if this video is active
//   const [isActive, setIsActive] = useState(false);

//   // const handleLike = (() => {
//   //   const likeTimeout = useRef<NodeJS.Timeout | null>(null); // Track the debounce timeout

//   //   const handleLikeClick = () => {
//   //     if (user?.token) {
//   //       if (coin >= coin_per_like) {
//   //         setLikeCount(+likeCount + 1);
//   //         setCountNumber((prev: any) => prev + 1);
//   //         setShowHeart(true);
//   //         if (status) {
//   //           dispatch(
//   //             setVideos({
//   //               ...videos,
//   //               [currentTab === 2 ? "foryou" : "follow"]: videos[
//   //                 currentTab === 2 ? "foryou" : "follow"
//   //               ]?.map((video: any) =>
//   //                 video.post_id === post_id
//   //                   ? {
//   //                       ...video,
//   //                       is_liked: true,
//   //                       like_count: +video?.like_count + 1,
//   //                     }
//   //                   : video
//   //               ),
//   //             })
//   //           );
//   //         }

//   //         setIsLiked(true);
//   //         // Clear any existing debounce timer
//   //         if (likeTimeout.current) {
//   //           clearTimeout(likeTimeout.current);
//   //         }

//   //         // Set up a new debounce timer
//   //         likeTimeout.current = setTimeout(async () => {
//   //           setShowHeart(false);
//   //           setCountNumber(0); // Reset pending likes after a successful API call

//   //           try {
//   //             const res = await likePost({ post_id, count: countNumber + 1 }); // Pass the accumulated count to the API

//   //             if (res.error) {
//   //               setLikeCount(+likeCount - countNumber);
//   //               if (status) {
//   //                 dispatch(
//   //                   setVideos({
//   //                     ...videos,
//   //                     [currentTab === 2 ? "foryou" : "follow"]: videos[
//   //                       currentTab === 2 ? "foryou" : "follow"
//   //                     ]?.map((video: any) =>
//   //                       video.post_id === post_id
//   //                         ? {
//   //                             ...video,
//   //                             is_liked: false,
//   //                             like_count: +video?.like_count - countNumber,
//   //                           }
//   //                         : video
//   //                     ),
//   //                   })
//   //                 );
//   //               }
//   //               const msg = JSON.parse(res.error?.data);
//   //               setIsLiked(false);
//   //               dispatch(
//   //                 showToast({
//   //                   message: msg.message,
//   //                   type: "error",
//   //                 })
//   //               );
//   //             }
//   //             refetchUser();
//   //           } catch (error) {
//   //             setLikeCount(+likeCount - countNumber);
//   //             if (status) {
//   //               dispatch(
//   //                 setVideos({
//   //                   ...videos,
//   //                   [currentTab === 2 ? "foryou" : "follow"]: videos[
//   //                     currentTab === 2 ? "foryou" : "follow"
//   //                   ]?.map((video: any) =>
//   //                     video.post_id === post_id
//   //                       ? {
//   //                           ...video,
//   //                           is_liked: false,
//   //                           like_count: +video?.like_count - countNumber,
//   //                         }
//   //                       : video
//   //                   ),
//   //                 })
//   //               );
//   //             }

//   //             setIsLiked(false);
//   //             setShowHeart(false);
//   //             setCountNumber(0);
//   //             console.error("Error liking the post:", error);
//   //           }
//   //         }, 3000); // Call API 1 second after the last click
//   //       } else {
//   //         dispatch(
//   //           showToast({
//   //             message: "硬币不足",
//   //             type: "success",
//   //           })
//   //         );
//   //       }
//   //     } else {
//   //       dispatch(
//   //         showToast({
//   //           message: "登陆后可点赞",
//   //           type: "success",
//   //         })
//   //       );
//   //     }
//   //   };

//   //   useEffect(() => {
//   //     // Cleanup on component unmount
//   //     return () => {
//   //       if (likeTimeout.current) {
//   //         clearTimeout(likeTimeout.current);
//   //       }
//   //     };
//   //   }, []);

//   //   return handleLikeClick;
//   // })();

//   useEffect(() => {
//     setCoins(coin);
//   }, [coin]);

//   const coin_per_like = config?.data?.coin_per_like;

//   const maxLikeCount = (coins: number, coinPerLike: number): number => {
//     return Math.floor(coins / coinPerLike);
//   };

//   const handleLike = (() => {
//     const likeTimeout = useRef<NodeJS.Timeout | null>(null); // Track the debounce timeout

//     const handleLikeClick = () => {
//       if (user?.token) {
//         const maxLikes = maxLikeCount(coins, coin_per_like);

//         if (maxLikes > 0) {
//           // Deduct coins immediately
//           setCoins(coins - coin_per_like);

//           setLikeCount(+likeCount + 1);
//           setCountNumber((prev: any) => prev + 1);
//           setShowHeart(true);

//           if (status) {
//             dispatch(
//               setVideos({
//                 ...videos,
//                 [currentTab === 2 ? "foryou" : "follow"]: videos[
//                   currentTab === 2 ? "foryou" : "follow"
//                 ]?.map((video: any) =>
//                   video.post_id === post_id
//                     ? {
//                         ...video,
//                         is_liked: true,
//                         like_count: +video?.like_count + 1,
//                       }
//                     : video
//                 ),
//               })
//             );
//           }

//           setIsLiked(true);

//           // Clear any existing debounce timer
//           if (likeTimeout.current) {
//             clearTimeout(likeTimeout.current);
//           }

//           // Set up a new debounce timer
//           likeTimeout.current = setTimeout(async () => {
//             setShowHeart(false);
//             setCountNumber(0); // Reset pending likes after a successful API call

//             try {
//               const res = await likePost({ post_id, count: countNumber + 1 }); // Pass the accumulated count to the API

//               if (res.error) {
//                 setLikeCount(+likeCount - countNumber);
//                 // Revert the coin deduction if the API call fails
//                 setCoins(coins + coin_per_like);
//                 if (status) {
//                   dispatch(
//                     setVideos({
//                       ...videos,
//                       [currentTab === 2 ? "foryou" : "follow"]: videos[
//                         currentTab === 2 ? "foryou" : "follow"
//                       ]?.map((video: any) =>
//                         video.post_id === post_id
//                           ? {
//                               ...video,
//                               is_liked: false,
//                               like_count: +video?.like_count - countNumber,
//                             }
//                           : video
//                       ),
//                     })
//                   );
//                 }
//                 const msg = JSON.parse(res.error?.data);
//                 setIsLiked(false);
//                 dispatch(
//                   showToast({
//                     message: msg.message,
//                     type: "error",
//                   })
//                 );
//               }
//               refetchUser();
//             } catch (error) {
//               setLikeCount(+likeCount - countNumber);
//               // Revert the coin deduction if the API call fails
//               setCoins(coins + coin_per_like);
//               if (status) {
//                 dispatch(
//                   setVideos({
//                     ...videos,
//                     [currentTab === 2 ? "foryou" : "follow"]: videos[
//                       currentTab === 2 ? "foryou" : "follow"
//                     ]?.map((video: any) =>
//                       video.post_id === post_id
//                         ? {
//                             ...video,
//                             is_liked: false,
//                             like_count: +video?.like_count - countNumber,
//                           }
//                         : video
//                     ),
//                   })
//                 );
//               }

//               setIsLiked(false);
//               setShowHeart(false);
//               setCountNumber(0);
//               console.error("Error liking the post:", error);
//             }
//           }, 3000); // Call API 1 second after the last click
//         } else {
//           dispatch(
//             showToast({
//               message: "硬币不足",
//               type: "success",
//             })
//           );
//         }
//       } else {
//         dispatch(
//           showToast({
//             message: "登陆后可点赞",
//             type: "success",
//           })
//         );
//       }
//     };

//     useEffect(() => {
//       // Cleanup on component unmount
//       return () => {
//         if (likeTimeout.current) {
//           clearTimeout(likeTimeout.current);
//         }
//       };
//     }, []);

//     return handleLikeClick;
//   })();

//   // const handleLike = (() => {
//   //   const likeTimeout = useRef<NodeJS.Timeout | null>(null); // Track the debounce timeout

//   //   const handleLikeClick = () => {
//   //     console.log("clicked");
//   //     if (user?.token) {
//   //       if (coins >= coin_per_like) {
//   //         // Deduct coins immediately
//   //         setCoins(coins - coin_per_like);

//   //         setLikeCount(+likeCount + 1);
//   //         setCountNumber((prev: any) => prev + 1);
//   //         setShowHeart(true);
//   //         if (status) {
//   //           dispatch(
//   //             setVideos({
//   //               ...videos,
//   //               [currentTab === 2 ? "foryou" : "follow"]: videos[
//   //                 currentTab === 2 ? "foryou" : "follow"
//   //               ]?.map((video: any) =>
//   //                 video.post_id === post_id
//   //                   ? {
//   //                       ...video,
//   //                       is_liked: true,
//   //                       like_count: +video?.like_count + 1,
//   //                     }
//   //                   : video
//   //               ),
//   //             })
//   //           );
//   //         }

//   //         setIsLiked(true);
//   //         // Clear any existing debounce timer
//   //         if (likeTimeout.current) {
//   //           clearTimeout(likeTimeout.current);
//   //         }

//   //         // Set up a new debounce timer
//   //         likeTimeout.current = setTimeout(async () => {
//   //           setShowHeart(false);
//   //           setCountNumber(0); // Reset pending likes after a successful API call

//   //           try {
//   //             const res = await likePost({ post_id, count: countNumber + 1 }); // Pass the accumulated count to the API

//   //             if (res.error) {
//   //               setLikeCount(+likeCount - countNumber);
//   //               // Revert the coin deduction if the API call fails
//   //               setCoins(coins + coin_per_like);
//   //               if (status) {
//   //                 dispatch(
//   //                   setVideos({
//   //                     ...videos,
//   //                     [currentTab === 2 ? "foryou" : "follow"]: videos[
//   //                       currentTab === 2 ? "foryou" : "follow"
//   //                     ]?.map((video: any) =>
//   //                       video.post_id === post_id
//   //                         ? {
//   //                             ...video,
//   //                             is_liked: false,
//   //                             like_count: +video?.like_count - countNumber,
//   //                           }
//   //                         : video
//   //                     ),
//   //                   })
//   //                 );
//   //               }
//   //               const msg = JSON.parse(res.error?.data);
//   //               setIsLiked(false);
//   //               dispatch(
//   //                 showToast({
//   //                   message: msg.message,
//   //                   type: "error",
//   //                 })
//   //               );
//   //             }
//   //             refetchUser();
//   //           } catch (error) {
//   //             setLikeCount(+likeCount - countNumber);
//   //             // Revert the coin deduction if the API call fails
//   //             setCoins(coins + coin_per_like);
//   //             if (status) {
//   //               dispatch(
//   //                 setVideos({
//   //                   ...videos,
//   //                   [currentTab === 2 ? "foryou" : "follow"]: videos[
//   //                     currentTab === 2 ? "foryou" : "follow"
//   //                   ]?.map((video: any) =>
//   //                     video.post_id === post_id
//   //                       ? {
//   //                           ...video,
//   //                           is_liked: false,
//   //                           like_count: +video?.like_count - countNumber,
//   //                         }
//   //                       : video
//   //                   ),
//   //                 })
//   //               );
//   //             }

//   //             setIsLiked(false);
//   //             setShowHeart(false);
//   //             setCountNumber(0);
//   //             console.error("Error liking the post:", error);
//   //           }
//   //         }, 3000); // Call API 1 second after the last click
//   //       } else {
//   //         dispatch(
//   //           showToast({
//   //             message: "硬币不足",
//   //             type: "success",
//   //           })
//   //         );
//   //       }
//   //     } else {
//   //       dispatch(
//   //         showToast({
//   //           message: "登陆后可点赞",
//   //           type: "success",
//   //         })
//   //       );
//   //     }
//   //   };

//   //   useEffect(() => {
//   //     // Cleanup on component unmount
//   //     return () => {
//   //       if (likeTimeout.current) {
//   //         clearTimeout(likeTimeout.current);
//   //       }
//   //     };
//   //   }, []);

//   //   return handleLikeClick;
//   // })();

//   // const unLike = (() => {
//   //   const likeTimeout = useRef<NodeJS.Timeout | null>(null); // Track the debounce timeout
//   //   // const [nextId, setNextId] = useState(0); // Generate unique IDs for hearts

//   //   const handleUnLikeClick = () => {
//   //     if (user?.token) {
//   //       // Clear any existing debounce timer

//   //       setLikeCount(+likeCount - 1);
//   //       if (status) {
//   //         dispatch(
//   //           setVideos({
//   //             ...videos,
//   //             [currentTab === 2 ? "foryou" : "follow"]: videos[
//   //               currentTab === 2 ? "foryou" : "follow"
//   //             ]?.map((video: any) =>
//   //               video.post_id === post_id
//   //                 ? {
//   //                     ...video,
//   //                     is_liked: false,
//   //                     like_count: +video?.like_count - 1,
//   //                   }
//   //                 : video
//   //             ),
//   //           })
//   //         );
//   //       }

//   //       setIsLiked(false);

//   //       if (likeTimeout.current) {
//   //         clearTimeout(likeTimeout.current);
//   //       }

//   //       // Set up a new debounce timer
//   //       likeTimeout.current = setTimeout(async () => {
//   //         try {
//   //           await unlikePost({ post_id }); // Pass the accumulated count to the API

//   //           setCountNumber(0); // Reset pending likes after a successful API call
//   //         } catch (error) {
//   //           setLikeCount(+likeCount + 1);
//   //           if (status) {
//   //             dispatch(
//   //               setVideos({
//   //                 ...videos,
//   //                 [currentTab === 2 ? "foryou" : "follow"]: videos[
//   //                   currentTab === 2 ? "foryou" : "follow"
//   //                 ]?.map((video: any) =>
//   //                   video.post_id === post_id
//   //                     ? {
//   //                         ...video,
//   //                         is_liked: true,
//   //                         like_count: +video?.like_count + 1,
//   //                       }
//   //                     : video
//   //                 ),
//   //               })
//   //             );
//   //           }

//   //           setIsLiked(true);

//   //           console.error("Error liking the post:", error);
//   //         }
//   //       }, 1000); // Call API 1 second after the last click
//   //     } else {
//   //       setIsOpen(true);
//   //     }
//   //   };

//   //   useEffect(() => {
//   //     // Cleanup on component unmount
//   //     return () => {
//   //       if (likeTimeout.current) {
//   //         clearTimeout(likeTimeout.current);
//   //       }
//   //     };
//   //   }, []);

//   //   return handleUnLikeClick;
//   // })();

//   useEffect(() => {
//     const handleIosEvent = (event: CustomEvent) => {
//       if (event.detail.post_id === post_id) {
//         if (event.detail.isLiked === "true") {
//           handleLike(); // Call the handleLike function
//         }
//         // } else if (event.detail.isLiked === "false") {
//         //   unLike();
//         // }
//       }
//     };

//     // Listen for the `iosEvent`
//     window.addEventListener("iosEvent", handleIosEvent as EventListener);

//     // Cleanup the event listener when the component unmounts
//     return () => {
//       window.removeEventListener("iosEvent", handleIosEvent as EventListener);
//     };
//   }, []);

//   useEffect(() => {
//     const handlefullscreenDismiss = (event: CustomEvent) => {
//       if (container) {
//         const activeElement = container.querySelector(
//           `[data-post-id="${event.detail.post_id}"]`
//         );
//         if (activeElement) {
//           activeElement.scrollIntoView({ block: "center" });
//         }
//       }
//     };

//     // Listen for the `iosEvent`
//     window.addEventListener(
//       "fullscreenDismiss",
//       handlefullscreenDismiss as EventListener
//     );

//     // Cleanup the event listener when the component unmounts
//     return () => {
//       window.removeEventListener(
//         "fullscreenDismiss",
//         handlefullscreenDismiss as EventListener
//       );
//     };
//   }, []);

//   const sendEventToNative = (name: string, text: any) => {
//     if (
//       (window as any).webkit &&
//       (window as any).webkit.messageHandlers &&
//       (window as any).webkit.messageHandlers.jsBridge
//     ) {
//       (window as any).webkit.messageHandlers.jsBridge.postMessage({
//         eventName: name,
//         value: text,
//       });
//     }
//   };

//   const handleFullscreen = (video: any) => {
//     if (
//       (window as any).webkit &&
//       (window as any).webkit.messageHandlers &&
//       (window as any).webkit.messageHandlers.jsBridge
//     ) {
//       // Send event to native app
//       sendEventToNative("beabox_fullscreen", {
//         post_id: video?.post_id,
//         like_api_url: `${import.meta.env.VITE_API_URL}/post/like`,
//         token: `Bearer ${user?.token}`,
//         video_url: video?.files[0].resourceURL,
//         share_link: config?.data?.share_link,
//         title: video.title,
//         like_count: +likeCount,
//         is_like: isLiked,
//       });
//     } else {
//       // Web fallback for rotation
//       if (rotateVideoId === video?.post_id) {
//         setRotateVideoId(null);
//         if (container) {
//           const activeElement = container.querySelector(
//             `[data-post-id="${video?.post_id}"]`
//           );
//           if (activeElement) {
//             activeElement.scrollIntoView({ block: "center" });
//           }
//         }
//       } else {
//         setRotateVideoId(video?.post_id);
//       }
//     }
//   };

//   useEffect(() => {
//     // Update active state based on visibility
//     const element = document.querySelector(`[data-post-id="${video.post_id}"]`);
//     if (!element) return;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           setIsActive(entry.isIntersecting);
//         });
//       },
//       { threshold: 0.5 }
//     );

//     observer.observe(element);
//     return () => observer.disconnect();
//   }, [video.post_id]);

//   if (isOpen) {
//     return <LoginDrawer isOpen={isOpen} setIsOpen={setIsOpen} />;
//   }

//   return (
//     <>
//       <Player
//         videoData={videoData}
//         indexRef={indexRef}
//         abortControllerRef={abortControllerRef}
//         width={video?.files[0].width}
//         height={video?.files[0].height}
//         type={video?.type == "ads" ? true : false}
//         rotate={rotateVideoId === video?.post_id}
//         src={video?.files[0].resourceURL}
//         thumbnail={
//           video?.preview_image ||
//           "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg"
//         }
//         handleLike={handleLike}
//         setWidth={setWidth}
//         setHeight={setHeight}
//         post_id={post_id}
//         isActive={isActive}
//       />

//       <VideoSidebar
//         status={status}
//         // unLike={unLike}
//         handleLike={handleLike}
//         setLikeCount={setLikeCount}
//         likeCount={likeCount}
//         isLiked={isLiked}
//         setIsLiked={setIsLiked}
//         // likes={video?.like_count}
//         // is_liked={video?.is_liked}
//         setCommentCount={setcommentCount}
//         messages={commentCount}
//         post_id={video?.post_id}
//         setCountNumber={setCountNumber}
//         setCountdown={setCountdown}
//         countNumber={countNumber}
//         countdown={countdown}
//         config={config?.data}
//         image={video?.preview_image}
//         post={video}
//         setHearts={setHearts}
//       />

//       {/* Rotate button - only show for non-ads landscape videos */}
//       {video?.type !== "ads" &&
//         video?.files[0].width > video?.files[0].height && (
//           <button
//             onClick={() => handleFullscreen(video)}
//             className="absolute left-[37%] top-[70%] bottom-0 right-0 w-[120px] bg-[#101010] h-[35px] rounded-md flex justify-center items-center z-[99] text-center text-white"
//           >
//             <div className="flex items-center p-1 gap-2">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="14"
//                 height="13"
//                 viewBox="0 0 14 13"
//                 fill="none"
//               >
//                 <path
//                   d="M11.9279 4.03607L10.664 2.68779C10.6123 2.63272 10.5969 2.55002 10.6249 2.47798C10.6528 2.40611 10.7186 2.35917 10.7916 2.35917L11.3304 2.35917C11.2894 1.07625 10.8481 0.573193 10.8434 0.568154L10.8434 0.567974C10.7879 0.507124 10.7764 0.414495 10.815 0.340101C10.8537 0.265707 10.9335 0.227068 11.0113 0.245124C11.0284 0.249096 12.6563 0.655005 12.7714 2.35915L13.3195 2.35915C13.3925 2.35915 13.4583 2.4061 13.4863 2.47796C13.5142 2.55001 13.4988 2.63271 13.4471 2.68778L12.1832 4.03606C12.1493 4.07217 12.1035 4.09257 12.0556 4.09257C12.0077 4.09257 11.9618 4.07218 11.9279 4.03607Z"
//                   fill="white"
//                 />
//                 <rect
//                   x="0.9"
//                   y="0.640723"
//                   width="7.38519"
//                   height="11.7185"
//                   rx="1.6"
//                   stroke="white"
//                   strokeWidth="0.8"
//                 />
//                 <path
//                   d="M9.16667 6.01855L11.5 6.01855C12.6046 6.01855 13.5 6.91399 13.5 8.01855L13.5 10.2778C13.5 11.3824 12.6046 12.2778 11.5 12.2778L9.16667 12.2778"
//                   stroke="white"
//                   strokeWidth="0.8"
//                 />
//               </svg>
//               <span>全屏</span>
//             </div>
//           </button>
//         )}
//     </>
//   );
// };

// export default VideoContainer;

import { useEffect, useRef, useState } from "react";
import Player from "./Player";
import VideoSidebar from "./VideoSidebar";
import { useDispatch, useSelector } from "react-redux";
import {
  useLikePostMutation,
  useUnlikePostMutation,
} from "../services/homeApi";
import { setVideos } from "../services/videosSlice";
import { useNavigate } from "react-router-dom";
import LoginDrawer from "@/components/profile/auth/login-drawer";
import { showToast } from "../services/errorSlice";

const VideoContainer = ({
  showFollowers = false,
  video,
  setWidth,
  setHeight,
  setCountNumber,
  setCountdown,
  countNumber,
  config,
  countdown,
  setHearts,
  status,
  width,
  height,
  container,
  abortControllerRef,
  indexRef,
  videoData,
}: {
  showFollowers: any;
  video: any;
  setWidth: any;
  setHeight: any;
  setCountNumber: any;
  setCountdown: any;
  countNumber: any;
  config: any;
  countdown: any;
  setHearts: any;
  status: any;
  width: any;
  height: any;
  container: any;
  abortControllerRef: any;
  indexRef: any;
  videoData: any;
}) => {
  const [likeCount, setLikeCount] = useState(video?.like_count);
  const [isLiked, setIsLiked] = useState(video?.is_liked);
  const [commentCount, setcommentCount] = useState(video?.comment_count);
  const [showRotate, setShowRotate] = useState(false);

  const user = useSelector((state: any) => state.persist.user);
  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();
  const dispatch = useDispatch();
  const currentTab = useSelector((state: any) => state.home.currentTab);
  const { videos } = useSelector((state: any) => state.videoSlice);

  const post_id = video?.post_id;
  const [rotateVideoId, setRotateVideoId] = useState<string | null>(null); // For controlling fullscreen per video
  const [isOpen, setIsOpen] = useState(false);
  const hideNew = useSelector((state: any) => state.hideNewSlice.hideNew);

  // Add state to track if this video is active
  const [isActive, setIsActive] = useState(false);

  const handleLike = (() => {
    const likeTimeout = useRef<NodeJS.Timeout | null>(null); // Track the debounce timeout
    const [nextId, setNextId] = useState(0); // Generate unique IDs for hearts

    const handleLikeClick = () => {
      if (user?.token) {
        // if (pendingLike) return; // Prevent further actions if a like is already pending
        const newId = nextId;
        setNextId((prev: any) => prev + 1); // Increment the next ID
        setHearts((prev: any) => [...prev, newId]); // Add the new heart
        setLikeCount(+likeCount + 1);
        if (status) {
          dispatch(
            setVideos({
              ...videos,
              [currentTab === 2 ? "foryou" : "follow"]: videos[
                currentTab === 2 ? "foryou" : "follow"
              ]?.map((video: any) =>
                video.post_id === post_id
                  ? {
                      ...video,
                      is_liked: true,
                      like_count: +video?.like_count + 1,
                    }
                  : video
              ),
            })
          );
        }

        setIsLiked(true);
        // Clear any existing debounce timer
        if (likeTimeout.current) {
          clearTimeout(likeTimeout.current);
        }

        // Set up a new debounce timer
        likeTimeout.current = setTimeout(async () => {
          try {
            await likePost({ post_id, count: 1 }); // Pass the accumulated count to the API

            setCountNumber(0); // Reset pending likes after a successful API call
          } catch (error) {
            setLikeCount(+likeCount - 1);
            if (status) {
              dispatch(
                setVideos({
                  ...videos,
                  [currentTab === 2 ? "foryou" : "follow"]: videos[
                    currentTab === 2 ? "foryou" : "follow"
                  ]?.map((video: any) =>
                    video.post_id === post_id
                      ? {
                          ...video,
                          is_liked: false,
                          like_count: +video?.like_count - 1,
                        }
                      : video
                  ),
                })
              );
            }

            setIsLiked(false);
            console.error("Error liking the post:", error);
          }
        }, 1000); // Call API 1 second after the last click
      } else {
        dispatch(
          showToast({
            message: "登陆后可点赞",
            type: "success",
          })
        );
      }
    };

    useEffect(() => {
      // Cleanup on component unmount
      return () => {
        if (likeTimeout.current) {
          clearTimeout(likeTimeout.current);
        }
      };
    }, []);

    return handleLikeClick;
  })();

  const unLike = (() => {
    const likeTimeout = useRef<NodeJS.Timeout | null>(null); // Track the debounce timeout
    // const [nextId, setNextId] = useState(0); // Generate unique IDs for hearts

    const handleUnLikeClick = () => {
      if (user?.token) {
        // Clear any existing debounce timer

        setLikeCount(+likeCount - 1);
        if (status) {
          dispatch(
            setVideos({
              ...videos,
              [currentTab === 2 ? "foryou" : "follow"]: videos[
                currentTab === 2 ? "foryou" : "follow"
              ]?.map((video: any) =>
                video.post_id === post_id
                  ? {
                      ...video,
                      is_liked: false,
                      like_count: +video?.like_count - 1,
                    }
                  : video
              ),
            })
          );
        }

        setIsLiked(false);

        if (likeTimeout.current) {
          clearTimeout(likeTimeout.current);
        }

        // Set up a new debounce timer
        likeTimeout.current = setTimeout(async () => {
          try {
            await unlikePost({ post_id }); // Pass the accumulated count to the API

            setCountNumber(0); // Reset pending likes after a successful API call
          } catch (error) {
            setLikeCount(+likeCount + 1);
            if (status) {
              dispatch(
                setVideos({
                  ...videos,
                  [currentTab === 2 ? "foryou" : "follow"]: videos[
                    currentTab === 2 ? "foryou" : "follow"
                  ]?.map((video: any) =>
                    video.post_id === post_id
                      ? {
                          ...video,
                          is_liked: true,
                          like_count: +video?.like_count + 1,
                        }
                      : video
                  ),
                })
              );
            }

            setIsLiked(true);

            console.error("Error liking the post:", error);
          }
        }, 1000); // Call API 1 second after the last click
      } else {
        setIsOpen(true);
      }
    };

    useEffect(() => {
      // Cleanup on component unmount
      return () => {
        if (likeTimeout.current) {
          clearTimeout(likeTimeout.current);
        }
      };
    }, []);

    return handleUnLikeClick;
  })();

  useEffect(() => {
    const handleIosEvent = (event: CustomEvent) => {
      if (event.detail.post_id === post_id) {
        if (event.detail.isLiked === "true") {
          handleLike(); // Call the handleLike function
        } else if (event.detail.isLiked === "false") {
          unLike();
        }
      }
    };

    // Listen for the `iosEvent`
    window.addEventListener("iosEvent", handleIosEvent as EventListener);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("iosEvent", handleIosEvent as EventListener);
    };
  }, []);

  useEffect(() => {
    const handlefullscreenDismiss = (event: CustomEvent) => {
      if (container) {
        const activeElement = container.querySelector(
          `[data-post-id="${event.detail.post_id}"]`
        );
        if (activeElement) {
          activeElement.scrollIntoView({ block: "center" });
        }
      }
    };

    // Listen for the `iosEvent`
    window.addEventListener(
      "fullscreenDismiss",
      handlefullscreenDismiss as EventListener
    );

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener(
        "fullscreenDismiss",
        handlefullscreenDismiss as EventListener
      );
    };
  }, []);

  const sendEventToNative = (name: string, text: any) => {
    if (
      (window as any).webkit &&
      (window as any).webkit.messageHandlers &&
      (window as any).webkit.messageHandlers.jsBridge
    ) {
      (window as any).webkit.messageHandlers.jsBridge.postMessage({
        eventName: name,
        value: text,
      });
    }
  };

  const handleFullscreen = (video: any) => {
    if (
      (window as any).webkit &&
      (window as any).webkit.messageHandlers &&
      (window as any).webkit.messageHandlers.jsBridge
    ) {
      // Send event to native app
      sendEventToNative("beabox_fullscreen", {
        post_id: video?.post_id,
        like_api_url: `${import.meta.env.VITE_API_URL}/post/like`,
        token: `Bearer ${user?.token}`,
        video_url: video?.files[0].resourceURL,
        share_link: config?.data?.share_link,
        title: video.title,
        like_count: +likeCount,
        is_like: isLiked,
      });
    } else {
      // Web fallback for rotation
      if (rotateVideoId === video?.post_id) {
        setRotateVideoId(null);
        if (container) {
          const activeElement = container.querySelector(
            `[data-post-id="${video?.post_id}"]`
          );
          if (activeElement) {
            activeElement.scrollIntoView({ block: "center" });
          }
        }
      } else {
        setRotateVideoId(video?.post_id);
      }
    }
  };

  useEffect(() => {
    // Update active state based on visibility
    const element = document.querySelector(`[data-post-id="${video.post_id}"]`);
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsActive(entry.isIntersecting);
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [video.post_id]);

  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    if (video?.decryptedPreview) {
      const img = new Image();
      img.onload = function () {
        // Compare width and height of the decrypted image
        setIsPortrait(img.width <= img.height);
      };
      img.src = video.decryptedPreview;
    }
  }, [video?.decryptedPreview]);

  if (isOpen) {
    return <LoginDrawer isOpen={isOpen} setIsOpen={setIsOpen} />;
  }

  return (
    <>
      <Player
        video={video}
        videoData={videoData}
        indexRef={indexRef}
        abortControllerRef={abortControllerRef}
        width={video?.files[0].width}
        height={video?.files[0].height}
        type={video?.type == "ads" ? true : false}
        rotate={rotateVideoId === video?.post_id}
        src={video?.files[0].resourceURL}
        p_img={!isPortrait}
        // thumbnail={video?.preview_image || ""}
        thumbnail={video?.decryptedPreview || video?.preview_image}
        handleLike={handleLike}
        setWidth={setWidth}
        setHeight={setHeight}
        post_id={post_id}
        isActive={isActive}
        setShowRotate={setShowRotate}
      />
      {!showFollowers && (
        <VideoSidebar
          status={status}
          unLike={unLike}
          handleLike={handleLike}
          setLikeCount={setLikeCount}
          likeCount={likeCount}
          isLiked={isLiked}
          setIsLiked={setIsLiked}
          // likes={video?.like_count}
          // is_liked={video?.is_liked}
          setCommentCount={setcommentCount}
          messages={commentCount}
          post_id={video?.post_id}
          setCountNumber={setCountNumber}
          setCountdown={setCountdown}
          countNumber={countNumber}
          countdown={countdown}
          config={config?.data}
          image={video?.preview_image}
          post={video}
          setHearts={setHearts}
        />
      )}

      {/* Rotate button - only show for non-ads landscape videos */}
      {video?.type !== "ads" &&
        video?.files[0].width > video?.files[0].height &&
        !showRotate &&
        !hideNew && (
          <button
            onClick={() => handleFullscreen(video)}
            className="absolute left-[37%] top-[70%] bottom-0 right-0 w-[120px] bg-[#101010] h-[35px] rounded-md flex justify-center items-center z-[99] text-center text-white"
          >
            <div className="flex items-center p-1 gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="13"
                viewBox="0 0 14 13"
                fill="none"
              >
                <path
                  d="M11.9279 4.03607L10.664 2.68779C10.6123 2.63272 10.5969 2.55002 10.6249 2.47798C10.6528 2.40611 10.7186 2.35917 10.7916 2.35917L11.3304 2.35917C11.2894 1.07625 10.8481 0.573193 10.8434 0.568154L10.8434 0.567974C10.7879 0.507124 10.7764 0.414495 10.815 0.340101C10.8537 0.265707 10.9335 0.227068 11.0113 0.245124C11.0284 0.249096 12.6563 0.655005 12.7714 2.35915L13.3195 2.35915C13.3925 2.35915 13.4583 2.4061 13.4863 2.47796C13.5142 2.55001 13.4988 2.63271 13.4471 2.68778L12.1832 4.03606C12.1493 4.07217 12.1035 4.09257 12.0556 4.09257C12.0077 4.09257 11.9618 4.07218 11.9279 4.03607Z"
                  fill="white"
                />
                <rect
                  x="0.9"
                  y="0.640723"
                  width="7.38519"
                  height="11.7185"
                  rx="1.6"
                  stroke="white"
                  strokeWidth="0.8"
                />
                <path
                  d="M9.16667 6.01855L11.5 6.01855C12.6046 6.01855 13.5 6.91399 13.5 8.01855L13.5 10.2778C13.5 11.3824 12.6046 12.2778 11.5 12.2778L9.16667 12.2778"
                  stroke="white"
                  strokeWidth="0.8"
                />
              </svg>
              <span>全屏</span>
            </div>
          </button>
        )}
    </>
  );
};

export default VideoContainer;
