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

import React, { useEffect, useRef, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useGetExploreListQuery } from "@/store/api/explore/exploreApi";
import InfiniteScroll from "react-infinite-scroll-component";
import { Person } from "@/assets/profile";
import Loader from "../../../page/home/vod_loader.gif";
import { useDispatch, useSelector } from "react-redux";
import { setDetails } from "@/store/slices/exploreSlice";
import { replace, useNavigate, useSearchParams } from "react-router-dom";
import { paths } from "@/routes/paths";
import ImageWithPlaceholder from "@/page/explore/comp/imgPlaceHolder";
import personE from "../../../assets/explore/personE.svg";
import AsyncDecryptedImage from "@/utils/asyncDecryptedImage";
import empty from "../../../page/home/empty.png";
import Artplayer from "artplayer";
import Hls from "hls.js";

interface LatestPorp {
  list_id: string;
  setShowVideoFeed: any;
  setSelectedMovieId: any;
  waterfall: any;
  setWaterFall: any;
  exp_header: any;
  page: any;
  setPage: any;
}

const Latest: React.FC<LatestPorp> = ({
  list_id,
  setShowVideoFeed,
  setSelectedMovieId,
  waterfall,
  setWaterFall,
  exp_header,
  page,
  setPage,
}) => {
  const dispatch = useDispatch();
  const [hasMore, setHasMore] = useState(true);
  const { data, isLoading } = useGetExploreListQuery({ id: list_id, page });
  const navigate = useNavigate();
  const scrollPositionRef = useRef<number>(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Long press video preview states
  const [activeLongPressCard, setActiveLongPressCard] = useState<any>(null);
  const videoPlayerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const artPlayerInstances = useRef<{ [key: string]: Artplayer | null }>({});
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = scrollPositionRef.current;
    }
  }, []);

  useEffect(() => {
    setWaterFall([]); // Reset list when switching tabs
  }, [exp_header]);

  useEffect(() => {
    if (data?.data) {
      setWaterFall((prev: any) => [...prev, ...data.data]);

      const loadedItems =
        data?.pagination?.current_page * data?.pagination?.per_page;
      setHasMore(loadedItems < data?.pagination?.total);
    } else {
      setHasMore(false);
    }
  }, [data, exp_header]);

  // Add this at the top of your component
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Initialize video players when they enter the viewport
  useEffect(() => {
    // Clean up previous observer if it exists
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new Intersection Observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const postId = (entry.target as HTMLElement).dataset.postId;
            if (!postId) return;

            const card = waterfall.find((c: any) => c.post_id === postId);
            if (!card?.preview?.url) return;

            // Only initialize if not already initialized
            if (!artPlayerInstances.current[postId]) {
              initializePlayer(card);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: "200px", // Load when 200px away from viewport
        threshold: 0.01,
      }
    );

    // Observe all video containers
    Object.keys(videoPlayerRefs.current).forEach((postId) => {
      const container = videoPlayerRefs.current[postId];
      if (container) {
        container.dataset.postId = postId; // Set postId as data attribute
        observerRef.current?.observe(container);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [waterfall]);
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
              maxBufferLength: 1, // Maximum buffer length in seconds
              maxMaxBufferLength: 1, // Absolute maximum buffer length
              maxBufferSize: 1 * 1000 * 1000, // 2MB buffer size
              maxBufferHole: 0.5, // Skip small gaps in the stream
              lowLatencyMode: true, // Reduce latency
              enableWorker: true, // Use web worker for better performance
              backBufferLength: 1, // Keep only 1 second of back buffer
            });

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              // Only load the first 2 seconds
              hls.startLoad(0);
              // hls.stopLoad(2);
            });

            hls.loadSource(url);
            hls.attachMedia(videoElement);

            // Optional: Clean up buffer when not playing
            videoElement.addEventListener("pause", () => {
              hls.stopLoad();
            });
            videoElement.addEventListener("play", () => {
              hls.startLoad(-1); // Resume loading from current position
            });
          } else if (
            videoElement.canPlayType("application/vnd.apple.mpegurl")
          ) {
            // For Safari's native HLS support, we have less control
            videoElement.src = url;
            videoElement.preload = "none"; // Minimal preloading
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

      // Hide all controls
      const controls = container.querySelectorAll(".art-controls, .art-mask");
      controls.forEach((control) => {
        (control as HTMLElement).style.display = "none";
      });

      player.on("error", (error) => {
        console.error("ArtPlayer error:", error);
      });

      // Additional optimization: Only load video when needed
      player.on("play", () => {
        const hlsInstance = player.hls;
        if (hlsInstance) {
          hlsInstance.startLoad(-1); // Start loading from current position
        }
      });

      player.on("pause", () => {
        const hlsInstance = player.hls;
        if (hlsInstance) {
          hlsInstance.stopLoad(); // Stop loading when paused
        }
      });
    } catch (error) {
      console.error("Error initializing ArtPlayer:", error);
    }
  };

  // // Extract player initialization to a separate function
  // const initializePlayer = (card: any) => {
  //   const container = videoPlayerRefs.current[card.post_id];
  //   if (!container) return;

  //   const options: Artplayer["Option"] = {
  //     container: container,
  //     url: card.preview.url,
  //     volume: 0.5,
  //     muted: true,
  //     autoplay: false,
  //     loop: true,
  //     isLive: false,
  //     aspectRatio: true,
  //     controls: [],
  //     fullscreen: false,
  //     theme: "#d53ff0",
  //     type: card.preview.url.includes(".m3u8") ? "m3u8" : "auto",
  //     moreVideoAttr: {
  //       playsInline: true,
  //     },
  //     customType: {
  //       m3u8: (videoElement: HTMLVideoElement, url: string) => {
  //         if (Hls.isSupported()) {
  //           const hls = new Hls();
  //           hls.loadSource(url);
  //           hls.attachMedia(videoElement);
  //         } else if (
  //           videoElement.canPlayType("application/vnd.apple.mpegurl")
  //         ) {
  //           videoElement.src = url;
  //         }
  //       },
  //     },
  //     icons: {
  //       loading: `<div style="display:none"></div>`,
  //       state: `<div style="display:none"></div>`,
  //     },
  //   };

  //   try {
  //     const player = new Artplayer(options);
  //     artPlayerInstances.current[card.post_id] = player;

  //     // Hide all controls
  //     const controls = container.querySelectorAll(".art-controls, .art-mask");
  //     controls.forEach((control) => {
  //       (control as HTMLElement).style.display = "none";
  //     });

  //     player.on("error", (error) => {
  //       console.error("ArtPlayer error:", error);
  //     });
  //   } catch (error) {
  //     console.error("Error initializing ArtPlayer:", error);
  //   }
  // };

  // Clean up all players when component unmounts
  useEffect(() => {
    return () => {
      Object.values(artPlayerInstances.current).forEach((player) => {
        player?.destroy();
      });
      artPlayerInstances.current = {};
      observerRef.current?.disconnect();
    };
  }, []);

  // // Initialize all video players when waterfall changes
  // useEffect(() => {
  //   waterfall.forEach((card: any) => {
  //     if (card?.preview?.url) {
  //       const container = videoPlayerRefs.current[card.post_id];
  //       if (container && !artPlayerInstances.current[card.post_id]) {
  //         const options: Artplayer["Option"] = {
  //           container: container,
  //           url: card.preview.url,
  //           volume: 0.5, // Set initial volume
  //           muted: true, // Start muted
  //           autoplay: false, // Don't autoplay initially
  //           loop: true,
  //           isLive: false,
  //           aspectRatio: true,
  //           controls: [], // No controls
  //           fullscreen: false,
  //           theme: "#d53ff0",
  //           type: card.preview.url.includes(".m3u8") ? "m3u8" : "auto",
  //           moreVideoAttr: {
  //             playsInline: true,
  //           },
  //           customType: {
  //             m3u8: (videoElement: HTMLVideoElement, url: string) => {
  //               if (Hls.isSupported()) {
  //                 const hls = new Hls();
  //                 hls.loadSource(url);
  //                 hls.attachMedia(videoElement);
  //               } else if (
  //                 videoElement.canPlayType("application/vnd.apple.mpegurl")
  //               ) {
  //                 videoElement.src = url;
  //               }
  //             },
  //           },
  //           icons: {
  //             loading: `<div style="display:none"></div>`,
  //             state: `<div style="display:none"></div>`,
  //           },
  //         };

  //         try {
  //           const player = new Artplayer(options);
  //           artPlayerInstances.current[card.post_id] = player;

  //           // Hide all controls
  //           const controls = container.querySelectorAll(
  //             ".art-controls, .art-mask"
  //           );
  //           controls.forEach((control) => {
  //             (control as HTMLElement).style.display = "none";
  //           });

  //           player.on("error", (error) => {
  //             console.error("ArtPlayer error:", error);
  //           });
  //         } catch (error) {
  //           console.error("Error initializing ArtPlayer:", error);
  //         }
  //       }
  //     }
  //   });

  //   return () => {
  //     // Clean up all players
  //     Object.values(artPlayerInstances.current).forEach((player) => {
  //       player?.destroy();
  //     });
  //     artPlayerInstances.current = {};
  //   };
  // }, [waterfall]);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}k`;
    }
    return num;
  };

  const fetchMoreData = () => {
    setPage((prevPage: any) => prevPage + 1);
  };

  const calculateHeight = (width: number, height: number) => {
    if (width > height) {
      return 112; // Portrait
    }
    if (width < height) {
      return 240; // Landscape
    }
    return 200;
  };

  const showDetailsVod = (file: any) => {
    setSelectedMovieId(file?.post_id);
    setShowVideoFeed(true);
  };

  const navigateToUserProfile = (userId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(paths.getUserProfileId(userId));
  };

  // Long press handlers
  const handleLongPress = (card: any) => {
    const player = artPlayerInstances.current[card.post_id];
    if (player) {
      // Unmute and play the video
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
        // Mute and pause the video when released
        player.muted = true;
        player.pause();
      }
      setActiveLongPressCard(null);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="w-full grid grid-cols-2 justify-center items-center gap-[12px] pt-[20px]">
          <div className="rounded-lg shadow-lg bg-white/20 animate-pulse mb-4 max-w-full h-[312px]"></div>
          <div className="rounded-lg shadow-lg bg-white/20 animate-pulse mb-4 max-w-full h-[312px]"></div>
          <div className="rounded-lg shadow-lg bg-white/20 animate-pulse mb-4 max-w-full h-[312px]"></div>
          <div className="rounded-lg shadow-lg bg-white/20 animate-pulse mb-4 max-w-full h-[312px]"></div>
        </div>
      ) : (
        <>
          <div className="flex w-full justify-center">
            <div
              className="grid grid-cols-2 relative gap-[6px] px-2 w-full"
              ref={contentRef}
            >
              {waterfall?.map((card: any, index: number) => (
                <div
                  key={index}
                  className="chinese_photo h-[320px] max-w-full relative pt-[20px]"
                >
                  <div
                    className="relative flex justify-center items-center bg-[#010101] rounded-t-[4px] overflow-hidden h-[240px]"
                    onClick={() => showDetailsVod(card)}
                    onTouchStart={() => handleTouchStart(card)}
                    onTouchEnd={handleTouchEnd}
                    onTouchMove={handleTouchEnd}
                  >
                    {/* Video Player (always present but hidden) */}
                    <div
                      ref={(el) => (videoPlayerRefs.current[card.post_id] = el)}
                      className="w-full h-full object-cover rounded-none"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: 1,
                        backgroundColor: "#000",
                        opacity:
                          activeLongPressCard?.post_id === card.post_id ? 1 : 0,
                        transition: "opacity 0.3s ease",
                        pointerEvents: "none",
                      }}
                    ></div>

                    {/* Image (always visible) */}
                    <ImageWithPlaceholder
                      src={card?.preview_image}
                      alt={card.title || "Video"}
                      width={"100%"}
                      height={calculateHeight(
                        card?.files[0]?.width,
                        card?.files[0]?.height
                      )}
                      className="object-cover h-full w-full rounded-none"
                      style={{
                        opacity:
                          activeLongPressCard?.post_id === card.post_id ? 0 : 1,
                        transition: "opacity 0.3s ease",
                      }}
                    />
                  </div>
                  <h1 className="search_text font-cnFont line-clamp-2 text-left text-[14px] font-[400] px-[6px] pt-[6px]">
                    {card.title.length > 50
                      ? `${card.title.slice(0, 50)}...`
                      : card.title}
                  </h1>
                  <div className="w-full px-[6px] text-white text-[14px] font-[400] leading-[30px] flex justify-between items-center">
                    <div className="flex justify-center items-center gap-[4px]">
                      {card.user?.avatar ? (
                        <AsyncDecryptedImage
                          className="w-[20px] h-[20px] rounded-full"
                          imageUrl={card.user.avatar}
                          onError={(e) => (e.currentTarget.src = personE)}
                          alt=""
                        />
                      ) : (
                        <AsyncDecryptedImage
                          imageUrl={personE}
                          className="w-[20px] h-[20px] rounded-full"
                          alt=""
                        />
                      )}
                      <h1
                        className="text-[#888] text-[14px] font-[500] cursor-pointer hover:text-white"
                        onClick={(e) => navigateToUserProfile(card.user.id, e)}
                      >
                        {card.user.name}
                      </h1>
                    </div>
                    <span className="flex gap-[5px] items-center">
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
                      <h1 className="text-[#888] text-[14px] font-[400] leading-[20px]">
                        {formatNumber(card?.like_count)}
                      </h1>
                    </span>
                  </div>
                </div>
              ))}
              <InfiniteScroll
                className="py-[20px]"
                dataLength={waterfall.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={
                  <div className="flex justify-center w-screen absolute bottom-[-30px] left-[-2px]">
                    <div className="">
                      <img
                        src={Loader}
                        className="w-[70px] h-[70px]"
                        alt="Loading"
                      />
                    </div>
                  </div>
                }
                endMessage={
                  <div className="flex bg-whit pt-20 justify-center items-center w-screen absolute bottom-[-20px] left-[-20px]">
                    <p className="py-10" style={{ textAlign: "center" }}>
                      {/* <b>No more yet!</b> */}
                    </p>
                  </div>
                }
              >
                <></>
              </InfiniteScroll>
            </div>
          </div>
          {waterfall.length === 0 && (
            <div className="mt-[20px]">
              <div className={`flex justify-center items-center py-[60px]`}>
                <div className="flex flex-col items-center">
                  <img src={empty} className="w-[80px]" alt="" />
                  <h1 className="text-center text-white/60">暂无视频内容</h1>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Latest;
